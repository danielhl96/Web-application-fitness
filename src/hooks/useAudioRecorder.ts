import { useState, useRef, useEffect, useCallback } from 'react';
import { createSttSocket, SttEvent } from '../services/sttSocketService';
import type { SttSocket } from '../services/sttSocketService';
import { startVAD } from '../services/vadService';
import type { VADHandle } from '../services/vadService';

// Re-export for consumers that import SttEvent from this module
export { SttEvent } from '../services/sttSocketService';

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
  recorderState: RecorderState;
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  isSupported: boolean;
  mimeType: string;
  error: string | null;
  transcript: string | null;
  transcriptLoading: boolean;
  partialTranscriptLoading: boolean;
}

export default function useAudioRecorder(options?: {
  onTranscript?: (text: string) => void;
}): UseAudioRecorderReturn {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [partialTranscriptLoading, setPartialTranscriptLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const partialIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<SttSocket | null>(null);
  const vadHandleRef = useRef<VADHandle | null>(null);
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

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopPartialInterval();
      vadHandleRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
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
    if (recorderState === 'recording' || recorderState === 'paused') return;

    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const socket = createSttSocket(mimeType, {
        // ── server → client callbacks (update React state) ─────────────────
        onTranscript: (text) => {
          setTranscript(text);
          setTranscriptLoading(false);
          setPartialTranscriptLoading(false);
          onTranscriptRef.current?.(text);
        },
        onPartialTranscript: (text) => {
          setTranscript(text);
          setPartialTranscriptLoading(false);
        },
        onTranscribing: () => setTranscriptLoading(true),
        onError: (message) => {
          setError(message);
          setTranscriptLoading(false);
          setPartialTranscriptLoading(false);
        },

        // ── flow control: MediaRecorder starts only after server confirms session ──
        onStarted: () => {
          const recorderOptions: MediaRecorderOptions = mimeType ? { mimeType } : {};
          const recorder = new MediaRecorder(stream, recorderOptions);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e: BlobEvent) => {
            if (e.data?.size > 0) {
              chunksRef.current.push(e.data);
              const p = e.data.arrayBuffer().then((buf) => {
                socketRef.current?.emit(SttEvent.CHUNK, buf);
              });
              pendingChunkSendsRef.current.push(p);
            }
          };

          recorder.onstop = () => {
            setRecorderState('stopped');
            Promise.all(pendingChunkSendsRef.current).then(() => {
              socketRef.current?.emit(SttEvent.STOP);
              pendingChunkSendsRef.current = [];
            });
          };

          recorder.start(100);
          setRecorderState('recording');

          // Partial interval — 2 s: each stt:partial triggers a full Whisper call
          partialIntervalRef.current = setInterval(() => {
            setPartialTranscriptLoading(true);
            socketRef.current?.emit(SttEvent.PARTIAL);
          }, 2000);

          // VAD: auto-stop after silence
          vadHandleRef.current = startVAD(stream, {
            onSilence: () => {
              stopPartialInterval();
              vadHandleRef.current?.stop();
              vadHandleRef.current = null;
              mediaRecorderRef.current?.stop();
              streamRef.current?.getTracks().forEach((t) => t.stop());
              streamRef.current = null;
            },
          });
        },

        // ── error / disconnect ──────────────────────────────────────────────
        onConnectError: (err: Error) => {
          setError(`STT-Verbindung fehlgeschlagen: ${err.message}`);
          setTranscriptLoading(false);
          setPartialTranscriptLoading(false);
          stopPartialInterval();
          vadHandleRef.current?.stop();
          vadHandleRef.current = null;
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          socket.disconnect();
        },
        onDisconnect: (reason: string) => {
          if (reason === 'io client disconnect') return;
          setError(`STT-connection lost (${reason}). Please restart the recording.`);
          stopPartialInterval();
          vadHandleRef.current?.stop();
          vadHandleRef.current = null;
          mediaRecorderRef.current?.stop();
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        },
      });

      socketRef.current = socket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied.');
    }
  }, [isSupported, mimeType, recorderState, stopPartialInterval]);

  // ── Stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    stopPartialInterval();
    vadHandleRef.current?.stop();
    vadHandleRef.current = null;
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopPartialInterval]);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecorderState('paused');
      stopPartialInterval();
      vadHandleRef.current?.stop();
      vadHandleRef.current = null;
    }
  }, [stopPartialInterval]);

  // ── Resume ────────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecorderState('recording');
      partialIntervalRef.current = setInterval(() => {
        setPartialTranscriptLoading(true);
        socketRef.current?.emit(SttEvent.PARTIAL);
      }, 2000);
    }
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopPartialInterval();
    vadHandleRef.current?.stop();
    vadHandleRef.current = null;
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    socketRef.current?.disconnect();
    socketRef.current = null;
    pendingChunkSendsRef.current = [];
    chunksRef.current = [];
    setRecorderState('idle');
    setError(null);
    setTranscript(null);
    setTranscriptLoading(false);
    setPartialTranscriptLoading(false);
  }, [stopPartialInterval]);

  return {
    recorderState,
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
