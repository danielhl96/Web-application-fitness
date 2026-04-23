import { io, Socket } from 'socket.io-client';

// ── STT WebSocket event contracts ─────────────────────────────────────────────

interface SttServerToClientEvents {
  'stt:started': () => void;
  'stt:transcribing': () => void;
  'stt:transcript': (payload: { transcript: string }) => void;
  'stt:partial_transcript': (payload: { transcript: string }) => void;
  'stt:error': (payload: { message: string }) => void;
}

interface SttClientToServerEvents {
  'stt:start': (payload: { mimeType: string }) => void;
  'stt:chunk': (chunk: ArrayBuffer) => void;
  'stt:partial': () => void;
  'stt:stop': () => void;
}

export type SttSocket = Socket<SttServerToClientEvents, SttClientToServerEvents>;

/** All WebSocket event name constants for the /stt namespace */
export const SttEvent = {
  START: 'stt:start',
  CHUNK: 'stt:chunk',
  PARTIAL: 'stt:partial',
  STOP: 'stt:stop',
  STARTED: 'stt:started',
  TRANSCRIBING: 'stt:transcribing',
  TRANSCRIPT: 'stt:transcript',
  PARTIAL_TRANSCRIPT: 'stt:partial_transcript',
  ERROR: 'stt:error',
} as const satisfies Record<string, keyof SttServerToClientEvents | keyof SttClientToServerEvents>;

// DIP: URL comes from env, not hardcoded in the hook
const WS_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ||
  'http://localhost:3000';

export interface SttSocketCallbacks {
  /** Server confirmed session — safe to start MediaRecorder */
  onStarted: () => void;
  onTranscript: (text: string) => void;
  onPartialTranscript: (text: string) => void;
  onTranscribing: () => void;
  onError: (message: string) => void;
  onConnectError: (err: Error) => void;
  onDisconnect: (reason: string) => void;
}

/**
 * Creates a typed /stt Socket.IO socket and registers all server-event handlers.
 * Returns the connected socket — the caller is responsible for calling socket.disconnect().
 */
export function createSttSocket(mimeType: string, callbacks: SttSocketCallbacks): SttSocket {
  const socket: SttSocket = io(`${WS_URL}/stt`, {
    withCredentials: true,
    transports: ['websocket'],
    // No auto-reconnect: a broken STT stream cannot be resumed mid-session.
    reconnection: false,
  });

  socket.on('connect', () => {
    socket.emit(SttEvent.START, { mimeType: mimeType || 'audio/webm' });
  });

  // socket.once: guards against duplicate MediaRecorder creation
  socket.once(SttEvent.STARTED, callbacks.onStarted);
  socket.on(SttEvent.TRANSCRIPT, ({ transcript }) => callbacks.onTranscript(transcript));
  socket.on(SttEvent.PARTIAL_TRANSCRIPT, ({ transcript }) =>
    callbacks.onPartialTranscript(transcript)
  );
  socket.on(SttEvent.TRANSCRIBING, callbacks.onTranscribing);
  socket.on(SttEvent.ERROR, ({ message }) => callbacks.onError(message));
  socket.on('connect_error', callbacks.onConnectError);
  socket.on('disconnect', callbacks.onDisconnect);

  return socket;
}
