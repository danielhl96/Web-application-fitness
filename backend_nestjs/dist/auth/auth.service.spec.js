"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _authservice = require("./auth.service");
const _jwt = require("@nestjs/jwt");
const _common = require("@nestjs/common");
const _argon2 = /*#__PURE__*/ _interop_require_wildcard(require("argon2"));
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
// ── Mock external dependencies ────────────────────────────────────────────────
jest.mock('argon2');
jest.mock('../redis', ()=>({
        redisClient: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn()
        }
    }));
const { redisClient } = require('../redis');
// ── Prisma mock ───────────────────────────────────────────────────────────────
const prismaMock = {
    users: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
};
// ── Tests ─────────────────────────────────────────────────────────────────────
describe('AuthService', ()=>{
    let service;
    let jwtService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authservice.AuthService,
                {
                    provide: 'PRISMA_USER',
                    useValue: prismaMock
                },
                {
                    provide: _jwt.JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-jwt-token')
                    }
                }
            ]
        }).compile();
        service = module.get(_authservice.AuthService);
        jwtService = module.get(_jwt.JwtService);
        jest.clearAllMocks();
    });
    // ── validateUser ────────────────────────────────────────────────────────────
    describe('validateUser', ()=>{
        it('should return user (without password) when credentials are correct', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.de',
                password: 'hashed'
            };
            prismaMock.users.findUnique.mockResolvedValue(mockUser);
            _argon2.verify.mockResolvedValue(true);
            const result = await service.validateUser('test@test.de', 'password');
            expect(result).toEqual({
                id: 1,
                email: 'test@test.de'
            });
            expect(result).not.toHaveProperty('password');
        });
        it('should throw UnauthorizedException when user is not found', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue(null);
            await expect(service.validateUser('unknown@test.de', 'password')).rejects.toThrow(_common.UnauthorizedException);
        });
        it('should return null when password is wrong', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.de',
                password: 'hashed'
            };
            prismaMock.users.findUnique.mockResolvedValue(mockUser);
            _argon2.verify.mockResolvedValue(false);
            const result = await service.validateUser('test@test.de', 'wrongpassword');
            expect(result).toBeNull();
        });
    });
    // ── login ───────────────────────────────────────────────────────────────────
    describe('login', ()=>{
        it('should return an access_token', async ()=>{
            const result = await service.login({
                id: 1,
                email: 'test@test.de'
            });
            expect(result).toEqual({
                access_token: 'mock-jwt-token'
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                email: 'test@test.de',
                sub: 1
            });
        });
    });
    // ── refreshToken ────────────────────────────────────────────────────────────
    describe('refreshToken', ()=>{
        it('should return a new access_token for an existing user', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue({
                id: 1,
                email: 'test@test.de'
            });
            const result = await service.refreshToken({
                id: 1,
                email: 'test@test.de'
            });
            expect(result).toEqual({
                access_token: 'mock-jwt-token'
            });
        });
        it('should throw UnauthorizedException when user no longer exists', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue(null);
            await expect(service.refreshToken({
                id: 99,
                email: 'x@x.de'
            })).rejects.toThrow(_common.UnauthorizedException);
        });
    });
    // ── register ────────────────────────────────────────────────────────────────
    describe('register', ()=>{
        it('should hash the password and create a user', async ()=>{
            _argon2.hash.mockResolvedValue('hashed-password');
            prismaMock.users.create.mockResolvedValue({
                id: 1,
                email: 'new@test.de'
            });
            const result = await service.register({
                email: 'New@Test.DE',
                password: 'secret'
            });
            // email should be lowercased
            expect(prismaMock.users.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: 'new@test.de',
                    password: 'hashed-password'
                })
            });
            expect(result).toEqual({
                id: 1,
                email: 'new@test.de'
            });
        });
    });
    // ── passwordReset ───────────────────────────────────────────────────────────
    describe('passwordReset', ()=>{
        it('should reset the password when safetycode is valid', async ()=>{
            redisClient.get.mockResolvedValue('1');
            _argon2.hash.mockResolvedValue('new-hashed');
            prismaMock.users.update.mockResolvedValue({});
            redisClient.del.mockResolvedValue(1);
            await service.passwordReset('valid-code', 'newpassword', 'test@test.de');
            expect(prismaMock.users.update).toHaveBeenCalledWith({
                where: {
                    email: 'test@test.de'
                },
                data: {
                    password: 'new-hashed'
                }
            });
            expect(redisClient.del).toHaveBeenCalledWith('password-reset:valid-code');
        });
        it('should throw UnauthorizedException when safetycode is invalid', async ()=>{
            redisClient.get.mockResolvedValue(null);
            await expect(service.passwordReset('invalid-code', 'newpassword', 'test@test.de')).rejects.toThrow(_common.UnauthorizedException);
        });
    });
});
