import { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import hark, { Harker } from 'hark';

// ── STT WebSocket event contracts ─────────────────────────────────────────────

/** Events emitted **from the server** to the client */
interface SttServerToClientEvents {
  /** Session was successfully started */
  'stt:started': () => void;
  /** Server is running Whisper on the full recording */
  'stt:transcribing': () => void;
  /** Final transcript after full recording */
  'stt:transcript': (payload: { transcript: string }) => void;
  /** Partial (live) transcript while recording */
  'stt:partial_transcript': (payload: { transcript: string }) => void;
  /** Error from the STT pipeline */
  'stt:error': (payload: { message: string }) => void;
}

/** Events emitted **from the client** to the server */
interface SttClientToServerEvents {
  /** Signal the start of a new recording session */
  'stt:start': (payload: { mimeType: string }) => void;
  /** Send a raw audio chunk (ArrayBuffer) */
  'stt:chunk': (chunk: ArrayBuffer) => void;
  /** Request a partial (live) transcription of buffered chunks */
  'stt:partial': () => void;
  /** Signal that recording is finished — triggers final Whisper call */
  'stt:stop': () => void;
}

/** Typed socket for the /stt namespace */
type SttSocket = Socket<SttServerToClientEvents, SttClientToServerEvents>;

/** All WebSocket event name constants for the /stt namespace */
export const SttEvent = {
  // ── client → server ──────────────────────────────────────────────────────
  /** Signal the start of a recording session */
  START: 'stt:start',
  /** Send a raw audio chunk */
  CHUNK: 'stt:chunk',
  /** Request a live partial transcription */
  PARTIAL: 'stt:partial',
  /** Signal end of recording — triggers final Whisper call */
  STOP: 'stt:stop',
  // ── server → client ──────────────────────────────────────────────────────
  /** Session acknowledged by server */
  STARTED: 'stt:started',
  /** Server began the full Whisper call */
  TRANSCRIBING: 'stt:transcribing',
  /** Final transcript delivered */
  TRANSCRIPT: 'stt:transcript',
  /** Live partial transcript delivered */
  PARTIAL_TRANSCRIPT: 'stt:partial_transcript',
  /** Error from the STT pipeline */
  ERROR: 'stt:error',
} as const satisfies Record<string, keyof SttServerToClientEvents | keyof SttClientToServerEvents>;

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

  const partialIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<SttSocket | null>(null);
  const harkRef = useRef<Harker | null>(null);
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

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopPartialInterval();
      stopSilenceTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
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

    if (recorderState === 'recording' || recorderState === 'paused') {
      return;
    }

    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect WebSocket for STT
      const WS_URL =
        (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ||
        'http://localhost:3000';
      const socket: SttSocket = io(`${WS_URL}/stt`, {
        withCredentials: true,
        transports: ['websocket'],
        // Keine automatische Neuverbindung — ein unterbrochener STT-Stream
        // kann nicht wiederhergestellt werden; der Nutzer muss die Aufnahme
        // manuell neu starten, damit stt:start + alle Chunks korrekt gesendet werden.
        reconnection: false,
      });
      socketRef.current = socket;

      // 'connect' fires once the WebSocket handshake is complete — only then is it
      // safe to emit. We send stt:start here so the server can create the session.
      socket.on('connect', () => {
        socket.emit(SttEvent.START, { mimeType: mimeType || 'audio/webm' });
      });

      socket.on(SttEvent.TRANSCRIPT, ({ transcript: text }: { transcript: string }) => {
        setTranscript(text);
        setTranscriptLoading(false);
        setPartialTranscriptLoading(false);
        onTranscriptRef.current?.(text);
      });
      socket.on(SttEvent.PARTIAL_TRANSCRIPT, ({ transcript: text }: { transcript: string }) => {
        setTranscript(text);
        setPartialTranscriptLoading(false);
      });
      socket.on(SttEvent.TRANSCRIBING, () => setTranscriptLoading(true));
      socket.on(SttEvent.ERROR, ({ message }: { message: string }) => {
        setError(message);
        setTranscriptLoading(false);
        setPartialTranscriptLoading(false);
      });
      // socket.once: fires exactly once — guards against duplicate MediaRecorder creation
      // if the server were to emit stt:started more than once.
      socket.once(SttEvent.STARTED, () => {
        // ── Flow Control: Recorder startet erst wenn Server-Session bestätigt ──
        // Garantiert: stt:start wurde verarbeitet, alle folgenden Chunks haben
        // eine gültige Session auf dem Server.
        const recorderOptions: MediaRecorderOptions = mimeType ? { mimeType } : {};
        const recorder = new MediaRecorder(stream, recorderOptions);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
            const p = e.data.arrayBuffer().then((buf) => {
              socketRef.current?.emit(SttEvent.CHUNK, buf);
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

          // Wait for all pending stt:chunk sends, then signal backend to transcribe
          Promise.all(pendingChunkSendsRef.current).then(() => {
            socketRef.current?.emit(SttEvent.STOP);
            pendingChunkSendsRef.current = [];
          });
        };

        recorder.start(100); // collect chunks every 100ms
        setRecorderState('recording');

        // Partial transcription starts here — after recorder is running — so that
        // stt:partial is only sent when chunks actually exist on the server.
        // 2 s interval: each stt:partial triggers a full Whisper inference call,
        // so firing too often (e.g. every 1 s) wastes API quota and risks
        // race conditions between overlapping partial responses.
        const PARTIAL_INTERVAL_MS = 2000;
        partialIntervalRef.current = setInterval(() => {
          setPartialTranscriptLoading(true);
          socketRef.current?.emit(SttEvent.PARTIAL);
        }, PARTIAL_INTERVAL_MS);

        // ── VAD: auto-stop after silence via hark ──────────────────────────
        // Tune these two constants to balance responsiveness vs. cutting off mid-sentence:
        // Threshold guide: background noise ≈ -60..-45 dB | speech ≈ -25..-10 dB
        // -35 dB sits well above typical mic noise but safely below normal speech.
        const VAD_THRESHOLD_DB = -35; // dB — below this hark considers it silence
        const VAD_SILENCE_DEBOUNCE_MS = 2000; // ms of continuous silence before stopping
        const speechEvents = hark(stream, {
          interval: 100,
          threshold: VAD_THRESHOLD_DB,
          history: 25,
        });
        harkRef.current = speechEvents;

        speechEvents.on('stopped_speaking', () => {
          // Debounce: only stop after VAD_SILENCE_DEBOUNCE_MS of continuous silence
          if (silenceTimerRef.current !== null) return;
          silenceTimerRef.current = setTimeout(() => {
            silenceTimerRef.current = null;
            stopPartialInterval();
            harkRef.current?.stop();
            harkRef.current = null;
            mediaRecorderRef.current?.stop();
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }, VAD_SILENCE_DEBOUNCE_MS);
        });

        speechEvents.on('speaking', () => {
          // User started speaking again — cancel pending silence timer
          stopSilenceTimer();
        });
      });

      /** Fired when the transport-level connection fails before the first connect */
      socket.on('connect_error', (err: Error) => {
        setError(`STT-Verbindung fehlgeschlagen: ${err.message}`);
        setTranscriptLoading(false);
        setPartialTranscriptLoading(false);
        stopPartialInterval();
        stopSilenceTimer();
        harkRef.current?.stop();
        harkRef.current = null;
        // Clean up media resources so the mic indicator disappears
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        socket.disconnect();
      });

      /** Fired when an established connection is lost — attempt one reconnect,
       *  then give up to avoid an infinite reconnect loop */
      socket.on('disconnect', (reason: string) => {
        // 'io client disconnect' means we called socket.disconnect() ourselves — ignore
        if (reason === 'io client disconnect') return;
        setError(`STT-connection lost (${reason}). Please restart the recording.`);
        stopPartialInterval();
        stopSilenceTimer();
        harkRef.current?.stop();
        harkRef.current = null;
        mediaRecorderRef.current?.stop();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      });

      // MediaRecorder + VAD are initialized inside stt:started to enforce flow control
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied.';
      setError(msg);
    }
  }, [isSupported, mimeType]);

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    stopPartialInterval();
    stopSilenceTimer();
    harkRef.current?.stop();
    harkRef.current = null;
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopPartialInterval, stopSilenceTimer]);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecorderState('paused');
      stopPartialInterval();
      stopSilenceTimer();
    }
  }, [stopPartialInterval, stopSilenceTimer]);

  // ── Resume ────────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecorderState('recording');

      partialIntervalRef.current = setInterval(() => {
        setPartialTranscriptLoading(true);
        socketRef.current?.emit(SttEvent.PARTIAL);
      }, 1000);
    }
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopPartialInterval();
    stopSilenceTimer();
    harkRef.current?.stop();
    harkRef.current = null;
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
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
  }, [audioUrl, stopPartialInterval]);

  return {
    recorderState,
    audioBlob,
    audioUrl,
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
