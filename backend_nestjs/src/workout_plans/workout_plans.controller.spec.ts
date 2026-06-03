import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { WorkoutPlansController } from './workout_plans.controller';
import { WorkoutPlansService } from './workout_plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockUser = { id: 1 };
const mockRequest = () => ({ user: mockUser });

const mockPlan = {
  id: 1,
  name: 'Push Day',
  user_id: 1,
  exercises: [],
};

const mockServiceMethods = {
  getWorkoutPlans: jest.fn(),
  createWorkoutPlan: jest.fn(),
  deleteWorkoutPlan: jest.fn(),
  editWorkoutPlan: jest.fn(),
  changeWorkoutPlanName: jest.fn(),
  createExercises: jest.fn(),
  deleteExercise: jest.fn(),
};

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('WorkoutPlansController', () => {
  let controller: WorkoutPlansController;
  let service: WorkoutPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutPlansController],
      providers: [
        { provide: WorkoutPlansService, useValue: mockServiceMethods },
        { provide: 'PRISMA_USER', useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkoutPlansController>(WorkoutPlansController);
    service = module.get<WorkoutPlansService>(WorkoutPlansService);
    jest.clearAllMocks();
  });

  // ── GET /workout_plans ─────────────────────────────────────────────────────

  describe('getWorkoutPlans', () => {
    it('should return workout plans for the user', async () => {
      mockServiceMethods.getWorkoutPlans.mockResolvedValue([mockPlan]);

      const result = await controller.getWorkoutPlans(mockRequest() as any);

      expect(service.getWorkoutPlans).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockPlan]);
    });

    it('should throw NotFoundException when no plans found', async () => {
      mockServiceMethods.getWorkoutPlans.mockResolvedValue(null);

      await expect(controller.getWorkoutPlans(mockRequest() as any)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  // ── POST /workout_plans ────────────────────────────────────────────────────

  describe('createWorkoutPlan', () => {
    it('should call service with body and user id', async () => {
      mockServiceMethods.createWorkoutPlan.mockResolvedValue(undefined);
      const body = { name: 'Push Day', exercises: [] };

      await controller.createWorkoutPlan(mockRequest() as any, body as any);

      expect(service.createWorkoutPlan).toHaveBeenCalledWith(body, mockUser.id);
    });
  });

  // ── DELETE /workout_plans/:planId ──────────────────────────────────────────

  describe('deleteWorkoutPlan', () => {
    it('should call service with numeric planId', async () => {
      mockServiceMethods.deleteWorkoutPlan.mockResolvedValue(undefined);

      await controller.deleteWorkoutPlan('5');

      expect(service.deleteWorkoutPlan).toHaveBeenCalledWith(5);
    });
  });

  // ── PUT /workout_plans/:planId ─────────────────────────────────────────────

  describe('editWorkoutPlan', () => {
    it('should merge planId from param and call service', async () => {
      mockServiceMethods.editWorkoutPlan.mockResolvedValue(mockPlan);
      const body = { name: 'Updated Push Day', exercises: [] };

      const result = await controller.editWorkoutPlan('1', body as any);

      expect(service.editWorkoutPlan).toHaveBeenCalledWith({ ...body, plan_id: 1 });
      expect(result).toEqual(mockPlan);
    });
  });

  // ── PATCH /workout_plans/:planId/name ──────────────────────────────────────

  describe('changeWorkoutPlanName', () => {
    it('should call service with planId and new name', async () => {
      mockServiceMethods.changeWorkoutPlanName.mockResolvedValue(undefined);

      await controller.changeWorkoutPlanName('3', { newName: 'Leg Day' } as any);

      expect(service.changeWorkoutPlanName).toHaveBeenCalledWith(3, 'Leg Day');
    });
  });

  // ── POST /workout_plans/:planId/exercises ──────────────────────────────────

  describe('createExercises', () => {
    it('should merge workout_plan_id from param and call service', async () => {
      mockServiceMethods.createExercises.mockResolvedValue(undefined);
      const body = { name: 'Bench Press', sets: 3, reps: [10, 10, 10], weights: [80, 80, 80] };

      await controller.createExercises('2', body as any, mockRequest() as any);

      expect(service.createExercises).toHaveBeenCalledWith(
        { ...body, workout_plan_id: 2 },
        mockUser.id
      );
    });
  });

  // ── DELETE /workout_plans/exercises/:exerciseId ────────────────────────────

  describe('deleteExercise', () => {
    it('should call service with numeric exerciseId', async () => {
      mockServiceMethods.deleteExercise.mockResolvedValue(undefined);

      await controller.deleteExercise('7');

      expect(service.deleteExercise).toHaveBeenCalledWith(7);
    });
  });
});
