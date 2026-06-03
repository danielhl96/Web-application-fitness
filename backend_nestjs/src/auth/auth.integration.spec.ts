import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { prismaUser } from '../prisma/prisma.client';

// ── Redis Mock – no real Redis needed ────────────────────────────────────────

jest.mock('../redis', () => ({
  redisClient: {
    set: jest.fn(),
    get: jest.fn(),
  },
}));

// ── Fake JWT Guard for protected routes ─────────────────────────────────────

const MockJwtAuthGuard = {
  canActivate: (context: any) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: parseInt(process.env.REAL_USER_ID), email: process.env.TEST_USER_EMAIL };
    return true;
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Auth Integration – real DB', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, { provide: 'PRISMA_USER', useValue: prismaUser }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockJwtAuthGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prismaUser.$disconnect();
  });

  // ── POST /auth/login ───────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('should set JWT cookie with correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD })
        .expect(201);

      expect(res.body).toEqual({ message: 'Logged in successfully' });
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: process.env.TEST_USER_EMAIL, password: 'FalschesPasswort999!' })
        .expect(401);
    });

    it('should return 401 with non-existing email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nichtexistent@test.de', password: 'IrgendinPasswort1!' })
        .expect(401);
    });
  });

  // ── GET /auth/check_auth ───────────────────────────────────────────────────

  describe('GET /auth/check_auth', () => {
    it('should return authenticated true and user', async () => {
      const res = await request(app.getHttpServer()).get('/auth/check_auth').expect(200);

      expect(res.body).toEqual({
        authenticated: true,
        user: {
          id: parseInt(process.env.REAL_USER_ID),
          email: process.env.TEST_USER_EMAIL,
        },
      });
    });
  });

  // ── POST /auth/refresh_token ───────────────────────────────────────────────

  describe('POST /auth/refresh_token', () => {
    it('should set a new JWT cookie', async () => {
      const res = await request(app.getHttpServer()).post('/auth/refresh_token').expect(201);

      expect(res.body).toEqual({ message: 'Token refreshed successfully' });
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  // ── POST /auth/logout ──────────────────────────────────────────────────────

  describe('POST /auth/logout', () => {
    it('should clear cookie and return success message', async () => {
      const res = await request(app.getHttpServer()).post('/auth/logout').expect(201);

      expect(res.body).toEqual({ message: 'Logged out' });
    });
  });

  // ── POST /auth/register ────────────────────────────────────────────────────
  // Note: Creates a real user – will be deleted after the test

  describe('POST /auth/register', () => {
    const testEmail = `integration_test_${Date.now()}@example.com`;

    afterAll(async () => {
      await prismaUser.users.deleteMany({ where: { email: testEmail } });
    });

    it('should register a new user and return success message', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, password: 'TestPass123!' })
        .expect(201);

      expect(res.body).toEqual({ message: 'Registered successfully' });

      const userInDb = await prismaUser.users.findUnique({ where: { email: testEmail } });
      expect(userInDb).not.toBeNull();
      expect(userInDb.email).toBe(testEmail);
    });

    it('should return 400 with invalid body', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'kein-email-format' })
        .expect(400);
    });
  });
});
