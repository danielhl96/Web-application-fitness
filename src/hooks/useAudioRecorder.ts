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
  /** Duration in seconds while recording / total duration after stop */
  duration: number;
  /** Waveform amplitude data (0–255) for the current frame — update via animationRef */
  waveformData: Uint8Array;
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
}

export default function useAudioRecorder(): UseAudioRecorderReturn {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(0));
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const mimeType = getSupportedMimeType();
  const isSupported =
    typeof MediaRecorder !== 'undefined' && !!navigator?.mediaDevices?.getUserMedia;

  // ── Waveform drawing loop ─────────────────────────────────────────────────
  const drawWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;

    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    setWaveformData(new Uint8Array(dataArray));

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0)';
        ctx.fillRect(0, 0, width, height);

        // Wave line
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3b82f6';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#3b82f6';
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    }

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const stopDurationCounter = useCallback(() => {
    if (durationIntervalRef.current !== null) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAnimation();
      stopDurationCounter();
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
        setTranscriptLoading(false);
      });
      socket.on('stt:transcribing', () => setTranscriptLoading(true));
      socket.on('stt:error', ({ message }: { message: string }) => {
        setError(message);
        setTranscriptLoading(false);
      });
      socket.on('connect', () => {
        socket.emit('stt:start', { mimeType: mimeType || 'audio/webm' });
      });

      // MediaRecorder
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          // Stream chunk to backend via WebSocket
          e.data.arrayBuffer().then((buf) => {
            socketRef.current?.emit('stt:chunk', buf);
          });
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
        stopAnimation();
        stopDurationCounter();

        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      recorder.start(100); // collect chunks every 100ms
      setRecorderState('recording');
      setDuration(0);

      // Duration counter
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start waveform loop
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied.';
      setError(msg);
    }
  }, [isSupported, mimeType, drawWaveform, stopAnimation, stopDurationCounter]);

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    // Signal backend to start transcription
    socketRef.current?.emit('stt:stop');
  }, []);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecorderState('paused');
      stopAnimation();
      stopDurationCounter();
    }
  }, [stopAnimation, stopDurationCounter]);

  // ── Resume ────────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecorderState('recording');
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  }, [drawWaveform]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopAnimation();
    stopDurationCounter();
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    socketRef.current?.disconnect();
    socketRef.current = null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    setRecorderState('idle');
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setWaveformData(new Uint8Array(0));
    setError(null);
    setTranscript(null);
    setTranscriptLoading(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [audioUrl, stopAnimation, stopDurationCounter]);

  return {
    recorderState,
    audioBlob,
    audioUrl,
    duration,
    waveformData,
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
  };
}
