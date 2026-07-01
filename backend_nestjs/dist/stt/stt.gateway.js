"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SttGateway", {
    enumerable: true,
    get: function() {
        return SttGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _common = require("@nestjs/common");
const _socketio = require("socket.io");
const _jsonwebtoken = /*#__PURE__*/ _interop_require_wildcard(require("jsonwebtoken"));
const _openaiservice = require("../openai/openai.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SttGateway = class SttGateway {
    // ── Auth on connect ────────────────────────────────────────────────────────
    handleConnection(client) {
        const token = client.handshake.auth?.token || this.extractCookieToken(client.handshake.headers?.cookie);
        if (!token) {
            this.logger.warn(`[STT] Rejected unauthenticated connection: ${client.id}`);
            client.emit('stt:error', {
                message: 'Unauthorized'
            });
            client.disconnect(true);
            return;
        }
        try {
            _jsonwebtoken.verify(token, process.env.JWT_SECRET || 'secret', {
                issuer: 'fitness-app',
                audience: 'fitness-users'
            });
            this.logger.log(`[STT] Client connected: ${client.id}`);
        } catch  {
            this.logger.warn(`[STT] Invalid token for client: ${client.id}`);
            client.emit('stt:error', {
                message: 'Unauthorized'
            });
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.sessions.delete(client.id);
        this.logger.log(`[STT] Client disconnected: ${client.id}`);
    }
    // ── Events ─────────────────────────────────────────────────────────────────
    /** Client signals start of a recording session */ handleStart(client, data) {
        this.sessions.set(client.id, {
            mimeType: data?.mimeType || 'audio/webm',
            chunks: []
        });
        this.logger.log(`[STT] Session started: ${client.id} (${data?.mimeType})`);
        client.emit('stt:started');
    }
    /** Client streams a binary audio chunk */ handleChunk(client, data) {
        const session = this.sessions.get(client.id);
        if (!session) return;
        session.chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
    }
    /** Client requests a partial transcription of chunks received so far */ async handlePartial(client) {
        const session = this.sessions.get(client.id);
        if (!session || session.chunks.length === 0) return;
        try {
            const audioBuffer = Buffer.concat(session.chunks);
            this.logger.log(`[STT] Partial transcription: ${audioBuffer.byteLength} bytes for ${client.id}`);
            const transcript = await this.openaiService.speechToText(audioBuffer, session.mimeType);
            client.emit('stt:partial_transcript', {
                transcript
            });
        } catch (err) {
            // Silently ignore partial errors — session continues
            this.logger.warn(`[STT] Partial error for ${client.id}: ${err}`);
        }
    }
    /** Client signals end of recording — triggers Whisper transcription */ async handleStop(client) {
        const session = this.sessions.get(client.id);
        if (!session || session.chunks.length === 0) {
            client.emit('stt:error', {
                message: 'No audio data received.'
            });
            return;
        }
        this.sessions.delete(client.id);
        client.emit('stt:transcribing');
        try {
            const audioBuffer = Buffer.concat(session.chunks);
            this.logger.log(`[STT] Transcribing ${audioBuffer.byteLength} bytes for client ${client.id}`);
            const transcript = await this.openaiService.speechToText(audioBuffer, session.mimeType);
            client.emit('stt:transcript', {
                transcript
            });
            this.logger.log(`[STT] Transcript delivered to client ${client.id}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Transcription failed.';
            this.logger.error(`[STT] Error: ${message}`);
            client.emit('stt:error', {
                message
            });
        }
    }
    // ── Helpers ────────────────────────────────────────────────────────────────
    extractCookieToken(cookieHeader) {
        if (!cookieHeader) return null;
        const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
        return match?.[1] ?? null;
    }
    constructor(openaiService){
        this.openaiService = openaiService;
        this.logger = new _common.Logger(SttGateway.name);
        /** Per-socket audio session state */ this.sessions = new Map();
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], SttGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('stt:start'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SttGateway.prototype, "handleStart", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('stt:chunk'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SttGateway.prototype, "handleChunk", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('stt:partial'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", Promise)
], SttGateway.prototype, "handlePartial", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('stt:stop'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", Promise)
], SttGateway.prototype, "handleStop", null);
SttGateway = _ts_decorate([
    (0, _websockets.WebSocketGateway)({
        namespace: 'stt',
        cors: {
            origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map((o)=>o.trim()),
            credentials: true
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _openaiservice.OpenaiService === "undefined" ? Object : _openaiservice.OpenaiService
    ])
], SttGateway);
