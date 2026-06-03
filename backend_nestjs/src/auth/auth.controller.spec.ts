import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// ── Redis Mock ────────────────────────────────────────────────────────────────

jest.mock('../redis', () => ({
  redisClient: {
    set: jest.fn(),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (cookieJwt?: string) => ({
  cookies: { jwt: cookieJwt },
  user: { id: 1, email: 'test@test.de' },
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn().mockResolvedValue({ access_token: 'mock-token' }),
            passwordForget: jest.fn().mockResolvedValue(undefined),
            passwordReset: jest.fn().mockResolvedValue(undefined),
            refreshToken: jest.fn().mockResolvedValue({ access_token: 'new-mock-token' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // ── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('sollte Erfolgsmeldung zurückgeben wenn Registrierung erfolgreich', async () => {
      (authService.register as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await controller.register({ email: 'test@test.de', password: 'Test123!' });

      expect(result).toEqual({ message: 'Registered successfully' });
      expect(authService.register).toHaveBeenCalledWith({
        email: 'test@test.de',
        password: 'Test123!',
      });
    });

    it('sollte BadRequestException werfen wenn Register fehlschlägt', async () => {
      (authService.register as jest.Mock).mockResolvedValue(null);

      await expect(
        controller.register({ email: 'test@test.de', password: 'Test123!' })
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('sollte JWT-Cookie setzen und Erfolgsmeldung zurückgeben', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.de' });
      const res = mockResponse();

      const result = await controller.login({ email: 'test@test.de', password: 'Test123!' }, res);

      expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock-token', expect.any(Object));
      expect(result).toEqual({ message: 'Logged in successfully' });
    });

    it('sollte UnauthorizedException werfen bei falschen Credentials', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(null);
      const res = mockResponse();

      await expect(
        controller.login({ email: 'wrong@test.de', password: 'wrong' }, res)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ── passwordForget ─────────────────────────────────────────────────────────

  describe('passwordForget', () => {
    it('sollte Erfolgsmeldung zurückgeben', async () => {
      const result = await controller.passwordForget({ email: 'test@test.de' });

      expect(authService.passwordForget).toHaveBeenCalledWith('test@test.de');
      expect(result).toEqual({ message: 'Password reset email sent' });
    });
  });

  // ── passwordReset ──────────────────────────────────────────────────────────

  describe('passwordReset', () => {
    it('sollte Passwort zurücksetzen und Erfolgsmeldung zurückgeben', async () => {
      const result = await controller.passwordReset({
        safetycode: 'abc123',
        newPassword: 'NewPass123!',
        email: 'test@test.de',
      });

      expect(authService.passwordReset).toHaveBeenCalledWith(
        'abc123',
        'NewPass123!',
        'test@test.de'
      );
      expect(result).toEqual({ message: 'Password reset successfully' });
    });
  });

  // ── checkAuth ──────────────────────────────────────────────────────────────

  describe('checkAuth', () => {
    it('sollte authenticated true und User zurückgeben', () => {
      const req = mockRequest();

      const result = controller.checkAuth(req as any);

      expect(result).toEqual({ authenticated: true, user: req.user });
    });
  });

  // ── refreshToken ───────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('sollte neues JWT-Cookie setzen und Erfolgsmeldung zurückgeben', async () => {
      const res = mockResponse();
      const req = mockRequest();

      const result = await controller.refreshToken(req as any, res);

      expect(authService.refreshToken).toHaveBeenCalledWith(req.user);
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'new-mock-token', expect.any(Object));
      expect(result).toEqual({ message: 'Token refreshed successfully' });
    });
  });

  // ── logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('sollte Cookie löschen und Erfolgsmeldung zurückgeben', async () => {
      const res = mockResponse();
      // Fake JWT mit gültigem Payload (exp in der Zukunft)
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const fakeToken = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.sig`;
      const req = mockRequest(fakeToken);

      const result = await controller.logout(res, req as any);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt');
      expect(result).toEqual({ message: 'Logged out' });
    });

    it('sollte auch ohne Cookie funktionieren', async () => {
      const res = mockResponse();
      const req = { cookies: {} };

      const result = await controller.logout(res, req as any);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
