import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { prismaUser } from '../prisma/prisma.client';

import { OpenaiService } from '../openai/openai.service';

// ── OpenAI Mock – no real API key needed ─────────────────────────────────────

const openaiMock = {
  analyzeFoodImage: jest.fn().mockResolvedValue({
    name: 'Test Food',
    calories: 300,
    carbs: 40,
    protein: 20,
    fats: 10,
  }),
  analyzeFoodText: jest.fn().mockResolvedValue({
    name: 'Apple',
    calories: 80,
    carbs: 20,
    protein: 0,
    fats: 0,
  }),
};

// ── Fake JWT Guard – injects real user from env ───────────────────────────────

const MockJwtAuthGuard = {
  canActivate: (context: any) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: parseInt(process.env.REAL_USER_ID) };
    return true;
  },
};

// ── Helper ────────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Meals Integration Tests (real DB)', () => {
  let app: INestApplication;
  const createdMealIds: number[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsController],
      providers: [
        MealsService,
        { provide: 'PRISMA_USER', useValue: prismaUser },
        { provide: OpenaiService, useValue: openaiMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockJwtAuthGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    // Delete meals created via HTTP POST (identified by name prefix)
    await prismaUser.meals.deleteMany({
      where: {
        user_id: parseInt(process.env.REAL_USER_ID),
        name: { startsWith: 'Integration Test' },
      },
    });

    // Delete meals created directly via Prisma
    if (createdMealIds.length > 0) {
      await prismaUser.meals.deleteMany({
        where: { id: { in: createdMealIds } },
      });
    }
    await app.close();
  });

  // ── POST /meals ────────────────────────────────────────────────────────────

  describe('POST /meals', () => {
    it('should create a breakfast meal', async () => {
      const res = await request(app.getHttpServer())
        .post('/meals')
        .send({
          name: 'Integration Test Oatmeal',
          calories: 300,
          carbs: 50,
          protein: 10,
          fats: 5,
          mealtype: 'breakfast',
          date: TODAY,
        })
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Meal created successfully');
    });

    it('should create a lunch meal', async () => {
      const res = await request(app.getHttpServer())
        .post('/meals')
        .send({
          name: 'Integration Test Pasta',
          calories: 500,
          carbs: 80,
          protein: 20,
          fats: 10,
          mealtype: 'lunch',
          date: TODAY,
        })
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Meal created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/meals')
        .send({ name: 'Incomplete Meal' }) // missing calories, carbs, protein, fats, mealtype
        .expect(400);
    });

    it('should return 400 when mealtype is missing', async () => {
      await request(app.getHttpServer())
        .post('/meals')
        .send({ name: 'No Type', calories: 300, carbs: 50, protein: 10, fats: 5 })
        .expect(400);
    });
  });

  // ── GET /meals?type ────────────────────────────────────────────────────────

  describe('GET /meals', () => {
    // Create a meal before GET tests and track its id for cleanup
    let breakfastMealId: number;

    beforeAll(async () => {
      const meal = await prismaUser.meals.create({
        data: {
          user_id: parseInt(process.env.REAL_USER_ID),
          name: 'Integration Test Breakfast',
          calories: 200,
          carbs: 30,
          protein: 8,
          fats: 4,
          mealtype: 'breakfast',
          date: new Date(TODAY),
        },
      });
      breakfastMealId = meal.id;
      createdMealIds.push(meal.id);
    });

    it('should return breakfast meals for today', async () => {
      const res = await request(app.getHttpServer())
        .get(`/meals?type=breakfast&date=${TODAY}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((m: any) => m.id === breakfastMealId)).toBe(true);
    });

    it('should return lunch meals (empty array if none)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/meals?type=lunch&date=2000-01-01`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return dinner meals', async () => {
      const res = await request(app.getHttpServer())
        .get(`/meals?type=dinner&date=${TODAY}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return snack meals', async () => {
      const res = await request(app.getHttpServer())
        .get(`/meals?type=snack&date=${TODAY}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 404 for invalid meal type', async () => {
      await request(app.getHttpServer()).get('/meals?type=invalid').expect(404);
    });
  });

  // ── PUT /meals/:mealId ─────────────────────────────────────────────────────

  describe('PUT /meals/:mealId', () => {
    let mealId: number;

    beforeAll(async () => {
      const meal = await prismaUser.meals.create({
        data: {
          user_id: parseInt(process.env.REAL_USER_ID),
          name: 'Meal to Edit',
          calories: 100,
          carbs: 10,
          protein: 5,
          fats: 2,
          mealtype: 'snacks',
          date: new Date(TODAY),
        },
      });
      mealId = meal.id;
      createdMealIds.push(meal.id);
    });

    it('should update a meal', async () => {
      const res = await request(app.getHttpServer())
        .put(`/meals/${mealId}`)
        .send({ name: 'Updated Meal', calories: 150, carbs: 15, protein: 7, fats: 3 })
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Meal updated successfully');
    });
  });

  // ── DELETE /meals/:mealId ──────────────────────────────────────────────────

  describe('DELETE /meals/:mealId', () => {
    let mealId: number;

    beforeAll(async () => {
      const meal = await prismaUser.meals.create({
        data: {
          user_id: parseInt(process.env.REAL_USER_ID),
          name: 'Meal to Delete',
          calories: 100,
          carbs: 10,
          protein: 5,
          fats: 2,
          mealtype: 'dinner',
          date: new Date(TODAY),
        },
      });
      mealId = meal.id;
      // Do NOT add to createdMealIds – DELETE test removes it itself
    });

    it('should delete a meal', async () => {
      const res = await request(app.getHttpServer()).delete(`/meals/${mealId}`).expect(200);

      expect(res.body).toHaveProperty('message', 'Meal deleted successfully');
    });

    it('should return empty result when deleting non-existent meal', async () => {
      const res = await request(app.getHttpServer()).delete('/meals/999999').expect(200);

      // deleteMany returns success even if nothing was found (no record belongs to this user)
      expect(res.body).toHaveProperty('message', 'Meal deleted successfully');
    });
  });

  // ── POST /meals/analyze_food_text ──────────────────────────────────────────

  describe('POST /meals/analyze_food_text', () => {
    it('should analyze food text and return nutrition data', async () => {
      const res = await request(app.getHttpServer())
        .post('/meals/analyze_food_text')
        .send({ text: '1 apple' })
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Meal analyzed successfully');
      expect(res.body).toHaveProperty('calories');
    });
  });
});
