import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

// ── Mock external dependencies ────────────────────────────────────────────────

jest.mock('argon2');
jest.mock('../redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

const { redisClient } = require('../redis');

// ── Prisma mock ───────────────────────────────────────────────────────────────

const prismaMock = {
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'PRISMA_USER',
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  // ── validateUser ────────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('should return user (without password) when credentials are correct', async () => {
      const mockUser = { id: 1, email: 'test@test.de', password: 'hashed' };
      prismaMock.users.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.de', 'password');

      expect(result).toEqual({ id: 1, email: 'test@test.de' });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);

      await expect(service.validateUser('unknown@test.de', 'password')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should return null when password is wrong', async () => {
      const mockUser = { id: 1, email: 'test@test.de', password: 'hashed' };
      prismaMock.users.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@test.de', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  // ── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return an access_token', async () => {
      const result = await service.login({ id: 1, email: 'test@test.de' });
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@test.de', sub: 1 });
    });
  });

  // ── refreshToken ────────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('should return a new access_token for an existing user', async () => {
      prismaMock.users.findUnique.mockResolvedValue({ id: 1, email: 'test@test.de' });

      const result = await service.refreshToken({ id: 1, email: 'test@test.de' });
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });

    it('should throw UnauthorizedException when user no longer exists', async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken({ id: 99, email: 'x@x.de' })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  // ── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should hash the password and create a user', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      prismaMock.users.create.mockResolvedValue({ id: 1, email: 'new@test.de' });

      const result = await service.register({ email: 'New@Test.DE', password: 'secret' });

      // email should be lowercased
      expect(prismaMock.users.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'new@test.de',
          password: 'hashed-password',
        }),
      });
      expect(result).toEqual({ id: 1, email: 'new@test.de' });
    });
  });

  // ── passwordReset ───────────────────────────────────────────────────────────

  describe('passwordReset', () => {
    it('should reset the password when safetycode is valid', async () => {
      redisClient.get.mockResolvedValue('1');
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed');
      prismaMock.users.update.mockResolvedValue({});
      redisClient.del.mockResolvedValue(1);

      await service.passwordReset('valid-code', 'newpassword', 'test@test.de');

      expect(prismaMock.users.update).toHaveBeenCalledWith({
        where: { email: 'test@test.de' },
        data: { password: 'new-hashed' },
      });
      expect(redisClient.del).toHaveBeenCalledWith('password-reset:valid-code');
    });

    it('should throw UnauthorizedException when safetycode is invalid', async () => {
      redisClient.get.mockResolvedValue(null);

      await expect(
        service.passwordReset('invalid-code', 'newpassword', 'test@test.de')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
