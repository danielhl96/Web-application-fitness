import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { speechToText } from '../openai';

interface SessionMeta {
  mimeType: string;
  chunks: Buffer[];
}

@WebSocketGateway({
  namespace: 'stt',
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
      .split(',')
      .map((o) => o.trim()),
    credentials: true,
  },
})
export class SttGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SttGateway.name);
  /** Per-socket audio session state */
  private sessions = new Map<string, SessionMeta>();

  // ── Auth on connect ────────────────────────────────────────────────────────
  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth as Record<string, string>)?.token ||
      this.extractCookieToken(client.handshake.headers?.cookie);

    if (!token) {
      this.logger.warn(`[STT] Rejected unauthenticated connection: ${client.id}`);
      client.emit('stt:error', { message: 'Unauthorized' });
      client.disconnect(true);
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'secret', {
        issuer: 'fitness-app',
        audience: 'fitness-users',
      });
      this.logger.log(`[STT] Client connected: ${client.id}`);
    } catch {
      this.logger.warn(`[STT] Invalid token for client: ${client.id}`);
      client.emit('stt:error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.sessions.delete(client.id);
    this.logger.log(`[STT] Client disconnected: ${client.id}`);
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  /** Client signals start of a recording session */
  @SubscribeMessage('stt:start')
  handleStart(@ConnectedSocket() client: Socket, @MessageBody() data: { mimeType?: string }) {
    this.sessions.set(client.id, {
      mimeType: data?.mimeType || 'audio/webm',
      chunks: [],
    });
    this.logger.log(`[STT] Session started: ${client.id} (${data?.mimeType})`);
    client.emit('stt:started');
  }

  /** Client streams a binary audio chunk */
  @SubscribeMessage('stt:chunk')
  handleChunk(@ConnectedSocket() client: Socket, @MessageBody() data: ArrayBuffer | Buffer) {
    const session = this.sessions.get(client.id);
    if (!session) return;
    session.chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
  }

  /** Client requests a partial transcription of chunks received so far */
  @SubscribeMessage('stt:partial')
  async handlePartial(@ConnectedSocket() client: Socket) {
    const session = this.sessions.get(client.id);
    if (!session || session.chunks.length === 0) return;

    try {
      const audioBuffer = Buffer.concat(session.chunks);
      this.logger.log(
        `[STT] Partial transcription: ${audioBuffer.byteLength} bytes for ${client.id}`
      );
      const transcript = await speechToText(audioBuffer, session.mimeType);
      client.emit('stt:partial_transcript', { transcript });
    } catch (err) {
      // Silently ignore partial errors — session continues
      this.logger.warn(`[STT] Partial error for ${client.id}: ${err}`);
    }
  }

  /** Client signals end of recording — triggers Whisper transcription */
  @SubscribeMessage('stt:stop')
  async handleStop(@ConnectedSocket() client: Socket) {
    const session = this.sessions.get(client.id);
    if (!session || session.chunks.length === 0) {
      client.emit('stt:error', { message: 'No audio data received.' });
      return;
    }

    this.sessions.delete(client.id);
    client.emit('stt:transcribing');

    try {
      const audioBuffer = Buffer.concat(session.chunks);
      this.logger.log(`[STT] Transcribing ${audioBuffer.byteLength} bytes for client ${client.id}`);
      const transcript = await speechToText(audioBuffer, session.mimeType);
      client.emit('stt:transcript', { transcript });
      this.logger.log(`[STT] Transcript delivered to client ${client.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transcription failed.';
      this.logger.error(`[STT] Error: ${message}`);
      client.emit('stt:error', { message });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private extractCookieToken(cookieHeader?: string): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
    return match?.[1] ?? null;
  }
}
