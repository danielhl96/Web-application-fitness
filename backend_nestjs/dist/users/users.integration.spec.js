"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("dotenv/config");
const _testing = require("@nestjs/testing");
const _common = require("@nestjs/common");
const _userscontroller = require("./users.controller");
const _usersservice = require("./users.service");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _prismaclient = require("../prisma/prisma.client");
const request = require("supertest");
// ── Fake JWT Guard – simuliert einen eingeloggten User ────────────────────────
// WICHTIG: REAL_USER_ID muss eine existierende User-ID aus der DB sein
const MockJwtAuthGuard = {
    canActivate: (context)=>{
        const req = context.switchToHttp().getRequest();
        req.user = {
            id: parseInt(process.env.REAL_USER_ID)
        }; // Simuliert einen eingeloggten User mit der ID aus .env
        return true;
    }
};
// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Users Integration – echte DB (REAL_USER_ID=' + process.env.REAL_USER_ID + ')', ()=>{
    let app;
    beforeAll(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _userscontroller.UsersController
            ],
            providers: [
                _usersservice.UsersService,
                {
                    provide: 'PRISMA_USER',
                    useValue: _prismaclient.prismaUser
                }
            ]
        }).overrideGuard(_jwtauthguard.JwtAuthGuard).useValue(MockJwtAuthGuard).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new _common.ValidationPipe());
        await app.init();
    });
    afterAll(async ()=>{
        await app.close();
        await _prismaclient.prismaUser.$disconnect();
    });
    // ── GET /users/profile ─────────────────────────────────────────────────────
    describe('GET /users/profile', ()=>{
        it('sollte das Profil des Users zurückgeben', async ()=>{
            const res = await request(app.getHttpServer()).get('/users/profile').expect(200);
            expect(res.body).toHaveProperty('id', parseInt(process.env.REAL_USER_ID));
            expect(res.body).toHaveProperty('email');
        });
    });
    // ── GET /users/history ─────────────────────────────────────────────────────
    describe('GET /users/history', ()=>{
        it('sollte die History-Einträge zurückgeben (Array)', async ()=>{
            const res = await request(app.getHttpServer()).get('/users/history').expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
    // ── PATCH /users/profile/email ─────────────────────────────────────────────
    describe('PATCH /users/profile/email', ()=>{
        it('sollte die Email aktualisieren und Erfolgsmeldung zurückgeben', async ()=>{
            const newEmail = `test${Date.now()}@example.com`;
            const res = await request(app.getHttpServer()).patch('/users/profile/email').send({
                email: newEmail,
                password: process.env.TEST_USER_PASSWORD
            }).expect(200);
            expect(res.body).toEqual({
                message: 'Email updated successfully'
            });
            // Überprüfen, ob die Email tatsächlich in der DB aktualisiert wurde
            const userInDb = await _prismaclient.prismaUser.users.findUnique({
                where: {
                    id: parseInt(process.env.REAL_USER_ID)
                }
            });
            expect(userInDb.email).toBe(newEmail);
        });
    });
    // ___Patch redo to reset email to original value after test___
    afterAll(async ()=>{
        await _prismaclient.prismaUser.users.update({
            where: {
                id: parseInt(process.env.REAL_USER_ID)
            },
            data: {
                email: process.env.TEST_USER_EMAIL
            }
        });
    });
    // ── PATCH /users/profile/email
    describe('PATCH /users/profile/email - invalid email', ()=>{
        it('sollte 400 zurückgeben bei ungültiger Email', async ()=>{
            await request(app.getHttpServer()).patch('/users/profile/email').send({
                email: 'invalid-email-format'
            }).expect(400);
        });
    });
    // ── PUT /users/password ────────────────────────────────────────────────────
    describe('PUT /users/password', ()=>{
        it('sollte 401 zurückgeben wenn altes Passwort falsch ist', async ()=>{
            await request(app.getHttpServer()).put('/users/password').send({
                oldPassword: 'definitiv_falsches_passwort_xyz!',
                newPassword: 'NeuesPasswort123!'
            }).expect(401);
        });
    });
});
