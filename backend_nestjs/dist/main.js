"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _expressratelimit = /*#__PURE__*/ _interop_require_default(require("express-rate-limit"));
const _platformsocketio = require("@nestjs/platform-socket.io");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Enable CORS
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map((o)=>o.trim());
    app.enableCors({
        origin: (origin, callback)=>{
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: ${origin}`));
            }
        },
        credentials: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept'
        ]
    });
    // Security headers
    app.use((0, _helmet.default)());
    // Compression
    app.use((0, _compression.default)());
    // Use cookie parser
    app.use((0, _cookieparser.default)());
    // WebSocket adapter (socket.io)
    app.useWebSocketAdapter(new _platformsocketio.IoAdapter(app));
    // Rate limiting
    app.use((0, _expressratelimit.default)({
        windowMs: 15 * 60 * 1000,
        max: 1000
    }));
    // Global validation pipe
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port ${port}`);
}
bootstrap();
