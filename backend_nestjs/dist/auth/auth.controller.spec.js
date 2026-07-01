"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _jwtauthguard = require("./jwt-auth.guard");
const _common = require("@nestjs/common");
// ── Redis Mock ────────────────────────────────────────────────────────────────
jest.mock('../redis', ()=>({
        redisClient: {
            set: jest.fn()
        }
    }));
// ── Helpers ───────────────────────────────────────────────────────────────────
const mockResponse = ()=>{
    const res = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};
const mockRequest = (cookieJwt)=>({
        cookies: {
            jwt: cookieJwt
        },
        user: {
            id: 1,
            email: 'test@test.de'
        }
    });
// ── Tests ─────────────────────────────────────────────────────────────────────
describe('AuthController', ()=>{
    let controller;
    let authService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _authcontroller.AuthController
            ],
            providers: [
                {
                    provide: _authservice.AuthService,
                    useValue: {
                        register: jest.fn(),
                        validateUser: jest.fn(),
                        login: jest.fn().mockResolvedValue({
                            access_token: 'mock-token'
                        }),
                        passwordForget: jest.fn().mockResolvedValue(undefined),
                        passwordReset: jest.fn().mockResolvedValue(undefined),
                        refreshToken: jest.fn().mockResolvedValue({
                            access_token: 'new-mock-token'
                        })
                    }
                }
            ]
        }).overrideGuard(_jwtauthguard.JwtAuthGuard).useValue({
            canActivate: ()=>true
        }).compile();
        controller = module.get(_authcontroller.AuthController);
        authService = module.get(_authservice.AuthService);
    });
    // ── register ───────────────────────────────────────────────────────────────
    describe('register', ()=>{
        it('sollte Erfolgsmeldung zurückgeben wenn Registrierung erfolgreich', async ()=>{
            authService.register.mockResolvedValue({
                id: 1
            });
            const result = await controller.register({
                email: 'test@test.de',
                password: 'Test123!'
            });
            expect(result).toEqual({
                message: 'Registered successfully'
            });
            expect(authService.register).toHaveBeenCalledWith({
                email: 'test@test.de',
                password: 'Test123!'
            });
        });
        it('sollte BadRequestException werfen wenn Register fehlschlägt', async ()=>{
            authService.register.mockResolvedValue(null);
            await expect(controller.register({
                email: 'test@test.de',
                password: 'Test123!'
            })).rejects.toThrow(_common.BadRequestException);
        });
    });
    // ── login ──────────────────────────────────────────────────────────────────
    describe('login', ()=>{
        it('sollte JWT-Cookie setzen und Erfolgsmeldung zurückgeben', async ()=>{
            authService.validateUser.mockResolvedValue({
                id: 1,
                email: 'test@test.de'
            });
            const res = mockResponse();
            const result = await controller.login({
                email: 'test@test.de',
                password: 'Test123!'
            }, res);
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock-token', expect.any(Object));
            expect(result).toEqual({
                message: 'Logged in successfully'
            });
        });
        it('sollte UnauthorizedException werfen bei falschen Credentials', async ()=>{
            authService.validateUser.mockResolvedValue(null);
            const res = mockResponse();
            await expect(controller.login({
                email: 'wrong@test.de',
                password: 'wrong'
            }, res)).rejects.toThrow(_common.UnauthorizedException);
        });
    });
    // ── passwordForget ─────────────────────────────────────────────────────────
    describe('passwordForget', ()=>{
        it('sollte Erfolgsmeldung zurückgeben', async ()=>{
            const result = await controller.passwordForget({
                email: 'test@test.de'
            });
            expect(authService.passwordForget).toHaveBeenCalledWith('test@test.de');
            expect(result).toEqual({
                message: 'Password reset email sent'
            });
        });
    });
    // ── passwordReset ──────────────────────────────────────────────────────────
    describe('passwordReset', ()=>{
        it('sollte Passwort zurücksetzen und Erfolgsmeldung zurückgeben', async ()=>{
            const result = await controller.passwordReset({
                safetycode: 'abc123',
                newPassword: 'NewPass123!',
                email: 'test@test.de'
            });
            expect(authService.passwordReset).toHaveBeenCalledWith('abc123', 'NewPass123!', 'test@test.de');
            expect(result).toEqual({
                message: 'Password reset successfully'
            });
        });
    });
    // ── checkAuth ──────────────────────────────────────────────────────────────
    describe('checkAuth', ()=>{
        it('sollte authenticated true und User zurückgeben', ()=>{
            const req = mockRequest();
            const result = controller.checkAuth(req);
            expect(result).toEqual({
                authenticated: true,
                user: req.user
            });
        });
    });
    // ── refreshToken ───────────────────────────────────────────────────────────
    describe('refreshToken', ()=>{
        it('sollte neues JWT-Cookie setzen und Erfolgsmeldung zurückgeben', async ()=>{
            const res = mockResponse();
            const req = mockRequest();
            const result = await controller.refreshToken(req, res);
            expect(authService.refreshToken).toHaveBeenCalledWith(req.user);
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'new-mock-token', expect.any(Object));
            expect(result).toEqual({
                message: 'Token refreshed successfully'
            });
        });
    });
    // ── logout ─────────────────────────────────────────────────────────────────
    describe('logout', ()=>{
        it('sollte Cookie löschen und Erfolgsmeldung zurückgeben', async ()=>{
            const res = mockResponse();
            // Fake JWT mit gültigem Payload (exp in der Zukunft)
            const payload = {
                exp: Math.floor(Date.now() / 1000) + 3600
            };
            const fakeToken = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.sig`;
            const req = mockRequest(fakeToken);
            const result = await controller.logout(res, req);
            expect(res.clearCookie).toHaveBeenCalledWith('jwt');
            expect(result).toEqual({
                message: 'Logged out'
            });
        });
        it('sollte auch ohne Cookie funktionieren', async ()=>{
            const res = mockResponse();
            const req = {
                cookies: {}
            };
            const result = await controller.logout(res, req);
            expect(res.clearCookie).toHaveBeenCalledWith('jwt');
            expect(result).toEqual({
                message: 'Logged out'
            });
        });
    });
});
