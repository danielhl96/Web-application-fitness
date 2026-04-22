import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlansService } from './workout_plans.service';
import { NotFoundException } from '@nestjs/common';

// ── Prisma mock ───────────────────────────────────────────────────────────────

const prismaMock = {
  workout_plans: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  plan_exercise_templates: {
    deleteMany: jest.fn(),
  },
  exercises: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('WorkoutPlansService', () => {
  let service: WorkoutPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutPlansService, { provide: 'PRISMA_USER', useValue: prismaMock }],
    }).compile();

    service = module.get<WorkoutPlansService>(WorkoutPlansService);
    jest.clearAllMocks();
  });

  // ── getWorkoutPlans ─────────────────────────────────────────────────────────

  describe('getWorkoutPlans', () => {
    it('should return plans and deduplicate exercises by name (latest only)', async () => {
      const older = { id: 1, name: 'Bench Press', date: new Date('2024-01-01'), user_id: 1 };
      const newer = { id: 2, name: 'Bench Press', date: new Date('2024-06-01'), user_id: 1 };

      prismaMock.workout_plans.findMany.mockResolvedValue([
        {
          id: 10,
          name: 'Push',
          exercises: [older, newer],
          plan_exercise_templates: [],
        },
      ]);

      const result = await service.getWorkoutPlans(1);

      expect(result).toHaveLength(1);
      // only the newer entry should remain
      expect(result[0].exercises).toHaveLength(1);
      expect(result[0].exercises[0].id).toBe(2);
    });

    it('should return empty exercises array when plan has no exercises', async () => {
      prismaMock.workout_plans.findMany.mockResolvedValue([
        { id: 10, name: 'Empty Plan', exercises: [], plan_exercise_templates: [] },
      ]);

      const result = await service.getWorkoutPlans(1);
      expect(result[0].exercises).toHaveLength(0);
    });
  });

  // ── createWorkoutPlan ───────────────────────────────────────────────────────

  describe('createWorkoutPlan', () => {
    it('should call prisma.create with correct data', async () => {
      prismaMock.workout_plans.create.mockResolvedValue({ id: 1 });

      const result = await service.createWorkoutPlan(
        {
          name: 'Push Day',
          exercises: [{ name: 'Bench Press', sets: 3, reps: [8, 8, 8], weights: [80, 80, 80] }],
        },
        1
      );

      expect(prismaMock.workout_plans.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Push Day', user_id: 1 }),
        })
      );
      expect(result).toEqual({ message: 'Workout plan created successfully' });
    });
  });

  // ── changeWorkoutPlanName ───────────────────────────────────────────────────

  describe('changeWorkoutPlanName', () => {
    it('should update and return success message', async () => {
      prismaMock.workout_plans.update.mockResolvedValue({});

      const result = await service.changeWorkoutPlanName(1, 'New Name');

      expect(prismaMock.workout_plans.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New Name' },
      });
      expect(result).toEqual({ message: 'Workout plan name updated successfully' });
    });
  });

  // ── deleteWorkoutPlan ───────────────────────────────────────────────────────

  describe('deleteWorkoutPlan', () => {
    it('should delete templates, exercises and the plan itself', async () => {
      prismaMock.plan_exercise_templates.deleteMany.mockResolvedValue({});
      prismaMock.exercises.deleteMany.mockResolvedValue({});
      prismaMock.workout_plans.delete.mockResolvedValue({});

      const result = await service.deleteWorkoutPlan(5);

      expect(prismaMock.plan_exercise_templates.deleteMany).toHaveBeenCalledWith({
        where: { workout_plan_id: 5 },
      });
      expect(prismaMock.exercises.deleteMany).toHaveBeenCalledWith({
        where: { workout_plan_id: 5 },
      });
      expect(prismaMock.workout_plans.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result).toEqual({ message: 'Workout plan deleted successfully' });
    });
  });

  // ── createExercises ─────────────────────────────────────────────────────────

  describe('createExercises', () => {
    const dto = {
      workout_plan_id: 10,
      name: 'Squat',
      sets: 3,
      reps: [5, 5, 5],
      weights: [100, 100, 100],
    };

    it('should create a new exercise entry when none exists today', async () => {
      prismaMock.workout_plans.findUnique.mockResolvedValue({ id: 10 });
      prismaMock.exercises.findFirst.mockResolvedValue(null);
      prismaMock.exercises.create.mockResolvedValue({});

      const result = await service.createExercises(dto, 1);

      expect(prismaMock.exercises.create).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Exercises added to workout plan successfully' });
    });

    it('should update existing exercise when already logged today', async () => {
      prismaMock.workout_plans.findUnique.mockResolvedValue({ id: 10 });
      prismaMock.exercises.findFirst.mockResolvedValue({ id: 99 });
      prismaMock.exercises.update.mockResolvedValue({});

      const result = await service.createExercises(dto, 1);

      expect(prismaMock.exercises.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 99 } })
      );
      expect(result).toEqual({ message: 'Exercise updated successfully' });
    });

    it('should throw when workout plan does not exist', async () => {
      prismaMock.workout_plans.findUnique.mockResolvedValue(null);

      await expect(service.createExercises(dto, 1)).rejects.toThrow('Workout plan not found');
    });
  });

  // ── editWorkoutPlan ─────────────────────────────────────────────────────────

  describe('editWorkoutPlan', () => {
    it('should throw when plan is not found', async () => {
      prismaMock.workout_plans.findUnique.mockResolvedValue(null);

      await expect(service.editWorkoutPlan({ plan_id: 99, exercises: [] })).rejects.toThrow(
        'Workout plan not found'
      );
    });

    it('should update plan and return success message', async () => {
      prismaMock.workout_plans.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.workout_plans.update.mockResolvedValue({});

      const result = await service.editWorkoutPlan({
        plan_id: 1,
        name: 'Updated',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: [5, 5, 5, 5], weights: [120, 120, 120, 120] },
        ],
      });

      expect(prismaMock.workout_plans.update).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Workout plan updated successfully' });
    });
  });
});
