import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { WorkoutPlansController } from './workout_plans.controller';
import { WorkoutPlansService } from './workout_plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { prismaUser } from '../prisma/prisma.client';

// ── Fake JWT Guard – injects real user from env ───────────────────────────────

const MockJwtAuthGuard = {
  canActivate: (context: any) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: parseInt(process.env.REAL_USER_ID) };
    return true;
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('WorkoutPlans Integration Tests (real DB)', () => {
  let app: INestApplication;
  const createdPlanIds: number[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutPlansController],
      providers: [WorkoutPlansService, { provide: 'PRISMA_USER', useValue: prismaUser }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockJwtAuthGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    // Clean up all plans created during tests
    for (const planId of createdPlanIds) {
      await prismaUser.plan_exercise_templates.deleteMany({ where: { workout_plan_id: planId } });
      await prismaUser.exercises.deleteMany({ where: { workout_plan_id: planId } });
      await prismaUser.workout_plans.delete({ where: { id: planId } }).catch(() => {});
    }
    await app.close();
  });

  // ── POST /workout_plans ────────────────────────────────────────────────────

  describe('POST /workout_plans', () => {
    it('should create a workout plan with exercises', async () => {
      const res = await request(app.getHttpServer())
        .post('/workout_plans')
        .send({
          name: 'Integration Test Push Day',
          exercises: [
            { name: 'Bench Press', sets: 3, reps: [10, 10, 10], weights: [80, 80, 80] },
            { name: 'Overhead Press', sets: 3, reps: [8, 8, 8], weights: [50, 50, 50] },
          ],
        })
        .expect(201);

      // Fetch the created plan id for cleanup
      const plans = await prismaUser.workout_plans.findMany({
        where: { user_id: parseInt(process.env.REAL_USER_ID), name: 'Integration Test Push Day' },
        orderBy: { id: 'desc' },
        take: 1,
      });
      if (plans[0]) createdPlanIds.push(plans[0].id);
    });

    it('should create a workout plan without exercises', async () => {
      await request(app.getHttpServer())
        .post('/workout_plans')
        .send({ name: 'Integration Test Empty Plan', exercises: [] })
        .expect(201);

      const plans = await prismaUser.workout_plans.findMany({
        where: {
          user_id: parseInt(process.env.REAL_USER_ID),
          name: 'Integration Test Empty Plan',
        },
        orderBy: { id: 'desc' },
        take: 1,
      });
      if (plans[0]) createdPlanIds.push(plans[0].id);
    });

    it('should return 400 when name is missing', async () => {
      await request(app.getHttpServer()).post('/workout_plans').send({ exercises: [] }).expect(400);
    });

    it('should return 400 when exercises field is missing', async () => {
      await request(app.getHttpServer())
        .post('/workout_plans')
        .send({ name: 'No Exercises Field' })
        .expect(400);
    });
  });

  // ── GET /workout_plans ─────────────────────────────────────────────────────

  describe('GET /workout_plans', () => {
    it('should return an array of workout plans', async () => {
      const res = await request(app.getHttpServer()).get('/workout_plans').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returned plans should contain plan_exercise_templates and exercises', async () => {
      const res = await request(app.getHttpServer()).get('/workout_plans').expect(200);

      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('plan_exercise_templates');
        expect(res.body[0]).toHaveProperty('exercises');
      }
    });
  });

  // ── PATCH /workout_plans/:planId/name ──────────────────────────────────────

  describe('PATCH /workout_plans/:planId/name', () => {
    let planId: number;

    beforeAll(async () => {
      const plan = await prismaUser.workout_plans.create({
        data: { name: 'Rename Me', user_id: parseInt(process.env.REAL_USER_ID) },
      });
      planId = plan.id;
      createdPlanIds.push(plan.id);
    });

    it('should rename a workout plan', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/workout_plans/${planId}/name`)
        .send({ newName: 'Renamed Plan' })
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Workout plan name updated successfully');

      const updated = await prismaUser.workout_plans.findUnique({ where: { id: planId } });
      expect(updated.name).toBe('Renamed Plan');
    });
  });

  // ── PUT /workout_plans/:planId ─────────────────────────────────────────────

  describe('PUT /workout_plans/:planId', () => {
    let planId: number;

    beforeAll(async () => {
      const plan = await prismaUser.workout_plans.create({
        data: {
          name: 'Edit Me',
          user_id: parseInt(process.env.REAL_USER_ID),
          plan_exercise_templates: {
            create: {
              name: 'Squat',
              sets: 3,
              reps_template: [10, 10, 10],
              weights_template: [100, 100, 100],
              date: new Date(),
            },
          },
        },
      });
      planId = plan.id;
      createdPlanIds.push(plan.id);
    });

    it('should update exercises of a workout plan', async () => {
      const res = await request(app.getHttpServer())
        .put(`/workout_plans/${planId}`)
        .send({
          name: 'Edited Plan',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: [5, 5, 5, 5], weights: [120, 120, 120, 120] },
          ],
        })
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Workout plan updated successfully');
    });
  });

  // ── POST /workout_plans/:planId/exercises ──────────────────────────────────

  describe('POST /workout_plans/:planId/exercises', () => {
    let planId: number;

    beforeAll(async () => {
      const plan = await prismaUser.workout_plans.create({
        data: { name: 'Add Exercises Plan', user_id: parseInt(process.env.REAL_USER_ID) },
      });
      planId = plan.id;
      createdPlanIds.push(plan.id);
    });

    it('should add an exercise to a workout plan', async () => {
      await request(app.getHttpServer())
        .post(`/workout_plans/${planId}/exercises`)
        .send({ name: 'Pull Up', sets: 3, reps: [8, 8, 8], weights: [0, 0, 0] })
        .expect(201);
    });

    it('should update the exercise if it already exists for today', async () => {
      // Second call with same name on same day → should update, not create
      await request(app.getHttpServer())
        .post(`/workout_plans/${planId}/exercises`)
        .send({ name: 'Pull Up', sets: 4, reps: [10, 10, 10, 10], weights: [5, 5, 5, 5] })
        .expect(201);
    });
  });

  // ── DELETE /workout_plans/exercises/:exerciseId ────────────────────────────

  describe('DELETE /workout_plans/exercises/:exerciseId', () => {
    let exerciseId: number;
    let planId: number;

    beforeAll(async () => {
      const plan = await prismaUser.workout_plans.create({
        data: { name: 'Delete Exercise Plan', user_id: parseInt(process.env.REAL_USER_ID) },
      });
      planId = plan.id;
      createdPlanIds.push(plan.id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exercise = await prismaUser.exercises.create({
        data: {
          name: 'Exercise to Delete',
          sets: 2,
          reps: [10, 10],
          weights: [50, 50],
          workout_plan_id: planId,
          user_id: parseInt(process.env.REAL_USER_ID),
          date: today,
        },
      });
      exerciseId = exercise.id;
    });

    it('should delete an exercise', async () => {
      await request(app.getHttpServer())
        .delete(`/workout_plans/exercises/${exerciseId}`)
        .expect(200);
    });
  });

  // ── DELETE /workout_plans/:planId ──────────────────────────────────────────

  describe('DELETE /workout_plans/:planId', () => {
    let planId: number;

    beforeAll(async () => {
      const plan = await prismaUser.workout_plans.create({
        data: { name: 'Delete Me Plan', user_id: parseInt(process.env.REAL_USER_ID) },
      });
      planId = plan.id;
      // Do NOT add to createdPlanIds – this test deletes it itself
    });

    it('should delete a workout plan and return 204', async () => {
      await request(app.getHttpServer()).delete(`/workout_plans/${planId}`).expect(204);
    });
  });
});
