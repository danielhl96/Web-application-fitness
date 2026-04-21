import { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Supported MIME types ordered by preference
const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  '',
];

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  return SUPPORTED_MIME_TYPES.find((type) => !type || MediaRecorder.isTypeSupported(type)) ?? '';
}

export type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

export interface UseAudioRecorderReturn {
  /** Current state of the recorder */
  recorderState: RecorderState;
  /** Recorded audio as a Blob (available after stopping) */
  audioBlob: Blob | null;
  /** Object URL for the recorded audio (use as <audio src> ) */
  audioUrl: string | null;
  /** Canvas ref to attach to <canvas> element for waveform drawing */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Start recording */
  start: () => Promise<void>;
  /** Stop recording */
  stop: () => void;
  /** Pause recording (if supported) */
  pause: () => void;
  /** Resume a paused recording */
  resume: () => void;
  /** Reset everything back to idle */
  reset: () => void;
  /** Whether the browser supports recording at all */
  isSupported: boolean;
  /** MIME type being used */
  mimeType: string;
  /** Error message if something went wrong */
  error: string | null;
  /** Transcribed text from OpenAI Whisper (null until available) */
  transcript: string | null;
  /** True while transcription is in progress */
  transcriptLoading: boolean;
  /** True while a partial (live) transcription is in progress */
  partialTranscriptLoading: boolean;
}

export default function useAudioRecorder(options?: {
  /** Called with the final transcript when Whisper finishes */
  onTranscript?: (text: string) => void;
}): UseAudioRecorderReturn {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [partialTranscriptLoading, setPartialTranscriptLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const partialIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const pendingChunkSendsRef = useRef<Promise<void>[]>([]);
  const onTranscriptRef = useRef(options?.onTranscript);
  useEffect(() => {
    onTranscriptRef.current = options?.onTranscript;
  });
  const mimeType = getSupportedMimeType();
  const isSupported =
    typeof MediaRecorder !== 'undefined' && !!navigator?.mediaDevices?.getUserMedia;

  const stopPartialInterval = useCallback(() => {
    if (partialIntervalRef.current !== null) {
      clearInterval(partialIntervalRef.current);
      partialIntervalRef.current = null;
    }
  }, []);

  const stopSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopPartialInterval();
      stopSilenceTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Start ─────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser.');
      return;
    }

    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Web Audio API analyser for waveform
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Connect WebSocket for STT
      const WS_URL =
        (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ||
        'http://localhost:3000';
      const socket = io(`${WS_URL}/stt`, {
        withCredentials: true,
        transports: ['websocket'],
      });
      socketRef.current = socket;

      socket.on('stt:transcript', ({ transcript: text }: { transcript: string }) => {
        setTranscript(text);
        console.log('Final transcript received:', text);
        setTranscriptLoading(false);
        setPartialTranscriptLoading(false);
        onTranscriptRef.current?.(text);
      });
      socket.on('stt:partial_transcript', ({ transcript: text }: { transcript: string }) => {
        setTranscript(text);
        setPartialTranscriptLoading(false);
      });
      socket.on('stt:transcribing', () => setTranscriptLoading(true));
      socket.on('stt:error', ({ message }: { message: string }) => {
        setError(message);
        setTranscriptLoading(false);
        setPartialTranscriptLoading(false);
      });
      socket.on('connect', () => {
        socket.emit('stt:start', { mimeType: mimeType || 'audio/webm' });
        // Partial transcription every 1 second while recording
        partialIntervalRef.current = setInterval(() => {
          setPartialTranscriptLoading(true);
          socket.emit('stt:partial');
        }, 1000);
      });

      // MediaRecorder
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          const p = e.data.arrayBuffer().then((buf) => {
            socketRef.current?.emit('stt:chunk', buf);
          });
          pendingChunkSendsRef.current.push(p);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecorderState('stopped');

        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Wait for all pending stt:chunk sends, then signal backend to transcribe
        Promise.all(pendingChunkSendsRef.current).then(() => {
          socketRef.current?.emit('stt:stop');
          pendingChunkSendsRef.current = [];
        });
      };

      recorder.start(100); // collect chunks every 100ms
      setRecorderState('recording');

      // ── VAD: auto-stop after 2.5 s of silence ────────────────────────────
      const VAD_THRESHOLD = 0.01; // RMS below this = silence
      const VAD_SILENCE_MS = 2500; // ms of continuous silence before stop
      const vadBuffer = new Uint8Array(analyser.frequencyBinCount);

      const vadLoop = () => {
        analyser.getByteTimeDomainData(vadBuffer);
        let sum = 0;
        for (let i = 0; i < vadBuffer.length; i++) {
          const v = (vadBuffer[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / vadBuffer.length);

        if (rms < VAD_THRESHOLD) {
          if (silenceTimerRef.current === null) {
            silenceTimerRef.current = setTimeout(() => {
              stopPartialInterval();

              mediaRecorderRef.current?.stop();
              streamRef.current?.getTracks().forEach((t) => t.stop());
              streamRef.current = null;
              audioContextRef.current?.close();
              audioContextRef.current = null;
              analyserRef.current = null;
            }, VAD_SILENCE_MS);
          }
        } else {
          stopSilenceTimer();
        }

        animationFrameRef.current = requestAnimationFrame(vadLoop);
      };

      animationFrameRef.current = requestAnimationFrame(vadLoop);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied.';
      setError(msg);
    }
  }, [isSupported, mimeType]);

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    stopPartialInterval();
    stopSilenceTimer();
    stopAnimation();
    mediaRecorderRef.current?.stop(); // stt:stop is sent from recorder.onstop after last chunk
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
  }, [stopPartialInterval, stopSilenceTimer, stopAnimation]);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecorderState('paused');
      stopAnimation();
      stopPartialInterval();
      stopSilenceTimer();
    }
  }, [stopAnimation, stopPartialInterval, stopSilenceTimer]);

  // ── Resume ────────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecorderState('recording');

      partialIntervalRef.current = setInterval(() => {
        setPartialTranscriptLoading(true);
        socketRef.current?.emit('stt:partial');
      }, 1000);
    }
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopAnimation();
    stopPartialInterval();
    stopSilenceTimer();
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    pendingChunkSendsRef.current = [];
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    chunksRef.current = [];
    setRecorderState('idle');
    setAudioBlob(null);
    setAudioUrl(null);

    setError(null);
    setTranscript(null);
    setTranscriptLoading(false);
    setPartialTranscriptLoading(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [audioUrl, stopPartialInterval]);

  return {
    recorderState,
    audioBlob,
    audioUrl,

    canvasRef,
    start,
    stop,
    pause,
    resume,
    reset,
    isSupported,
    mimeType,
    error,
    transcript,
    transcriptLoading,
    partialTranscriptLoading,
  };
}
