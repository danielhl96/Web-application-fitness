"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _client = require("@prisma/client");
const _argon2 = /*#__PURE__*/ _interop_require_wildcard(require("argon2"));
const _nodemailer = /*#__PURE__*/ _interop_require_wildcard(require("nodemailer"));
const _uuid = require("uuid");
const _redis = require("../redis");
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
let AuthService = class AuthService {
    async validateUser(email, password) {
        const user = await this.prisma.users.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });
        if (!user) throw new _common.UnauthorizedException('User not found');
        if (user && await _argon2.verify(user.password, password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id
        };
        console.log('Generating JWT for user:', payload);
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
    async refreshToken(user) {
        const userFromDb = await this.prisma.users.findUnique({
            where: {
                id: user.id
            }
        });
        if (!userFromDb) {
            throw new _common.UnauthorizedException('User not found');
        }
        const payload = {
            email: userFromDb.email,
            sub: userFromDb.id
        };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
    async sendEmail(to, subject, text) {
        // Create a transporter using SMTP
        const transporter = _nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        try {
            const info = await transporter.sendMail({
                from: `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`,
                to,
                subject,
                text
            });
            console.log('Message sent: %s', info.messageId);
            // Preview URL is only available when using an Ethereal test account
            console.log('Preview URL: %s', _nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.error('Error while sending mail:', err);
        }
    }
    async passwordReset(safetycode, newPassword, email) {
        const userId = await _redis.redisClient.get(`password-reset:${safetycode}`);
        if (!userId) {
            throw new _common.UnauthorizedException('Invalid or expired safety code');
        }
        const hashedPassword = await _argon2.hash(newPassword);
        await this.prisma.users.update({
            where: {
                email: email.toLowerCase()
            },
            data: {
                password: hashedPassword
            }
        });
        await _redis.redisClient.del(`password-reset:${safetycode}`);
    }
    async passwordForget(email) {
        const userFromDb = await this.prisma.users.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });
        if (!userFromDb) {
            throw new _common.UnauthorizedException();
        }
        const safetycode = (0, _uuid.v4)();
        await _redis.redisClient.set(`password-reset:${safetycode}`, userFromDb.id.toString(), {
            EX: 3600
        });
        await this.sendEmail(userFromDb.email, 'Password Reset', 'Your safetycode for resetting: ' + safetycode.toString());
    }
    async register(data) {
        const existingUser = await this.prisma.users.findUnique({
            where: {
                email: data.email.toLowerCase()
            }
        });
        if (existingUser) {
            throw new _common.UnauthorizedException('Email already in use');
        }
        const hashedPassword = await _argon2.hash(data.password);
        const user = await this.prisma.users.create({
            data: {
                ...data,
                email: data.email.toLowerCase(),
                password: hashedPassword
            }
        });
        return user;
    }
    constructor(prisma, jwtService){
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], AuthService);
