"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _common = require("@nestjs/common");
const _workout_planscontroller = require("./workout_plans.controller");
const _workout_plansservice = require("./workout_plans.service");
const _jwtauthguard = require("../auth/jwt-auth.guard");
// ── Mocks ──────────────────────────────────────────────────────────────────────
const mockUser = {
    id: 1
};
const mockRequest = ()=>({
        user: mockUser
    });
const mockPlan = {
    id: 1,
    name: 'Push Day',
    user_id: 1,
    exercises: []
};
const mockServiceMethods = {
    getWorkoutPlans: jest.fn(),
    createWorkoutPlan: jest.fn(),
    deleteWorkoutPlan: jest.fn(),
    editWorkoutPlan: jest.fn(),
    changeWorkoutPlanName: jest.fn(),
    createExercises: jest.fn(),
    deleteExercise: jest.fn()
};
// ── Tests ──────────────────────────────────────────────────────────────────────
describe('WorkoutPlansController', ()=>{
    let controller;
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _workout_planscontroller.WorkoutPlansController
            ],
            providers: [
                {
                    provide: _workout_plansservice.WorkoutPlansService,
                    useValue: mockServiceMethods
                },
                {
                    provide: 'PRISMA_USER',
                    useValue: {}
                }
            ]
        }).overrideGuard(_jwtauthguard.JwtAuthGuard).useValue({
            canActivate: ()=>true
        }).compile();
        controller = module.get(_workout_planscontroller.WorkoutPlansController);
        service = module.get(_workout_plansservice.WorkoutPlansService);
        jest.clearAllMocks();
    });
    // ── GET /workout_plans ─────────────────────────────────────────────────────
    describe('getWorkoutPlans', ()=>{
        it('should return workout plans for the user', async ()=>{
            mockServiceMethods.getWorkoutPlans.mockResolvedValue([
                mockPlan
            ]);
            const result = await controller.getWorkoutPlans(mockRequest());
            expect(service.getWorkoutPlans).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual([
                mockPlan
            ]);
        });
        it('should throw NotFoundException when no plans found', async ()=>{
            mockServiceMethods.getWorkoutPlans.mockResolvedValue(null);
            await expect(controller.getWorkoutPlans(mockRequest())).rejects.toThrow(_common.NotFoundException);
        });
    });
    // ── POST /workout_plans ────────────────────────────────────────────────────
    describe('createWorkoutPlan', ()=>{
        it('should call service with body and user id', async ()=>{
            mockServiceMethods.createWorkoutPlan.mockResolvedValue(undefined);
            const body = {
                name: 'Push Day',
                exercises: []
            };
            await controller.createWorkoutPlan(mockRequest(), body);
            expect(service.createWorkoutPlan).toHaveBeenCalledWith(body, mockUser.id);
        });
    });
    // ── DELETE /workout_plans/:planId ──────────────────────────────────────────
    describe('deleteWorkoutPlan', ()=>{
        it('should call service with numeric planId', async ()=>{
            mockServiceMethods.deleteWorkoutPlan.mockResolvedValue(undefined);
            await controller.deleteWorkoutPlan('5');
            expect(service.deleteWorkoutPlan).toHaveBeenCalledWith(5);
        });
    });
    // ── PUT /workout_plans/:planId ─────────────────────────────────────────────
    describe('editWorkoutPlan', ()=>{
        it('should merge planId from param and call service', async ()=>{
            mockServiceMethods.editWorkoutPlan.mockResolvedValue(mockPlan);
            const body = {
                name: 'Updated Push Day',
                exercises: []
            };
            const result = await controller.editWorkoutPlan('1', body);
            expect(service.editWorkoutPlan).toHaveBeenCalledWith({
                ...body,
                plan_id: 1
            });
            expect(result).toEqual(mockPlan);
        });
    });
    // ── PATCH /workout_plans/:planId/name ──────────────────────────────────────
    describe('changeWorkoutPlanName', ()=>{
        it('should call service with planId and new name', async ()=>{
            mockServiceMethods.changeWorkoutPlanName.mockResolvedValue(undefined);
            await controller.changeWorkoutPlanName('3', {
                newName: 'Leg Day'
            });
            expect(service.changeWorkoutPlanName).toHaveBeenCalledWith(3, 'Leg Day');
        });
    });
    // ── POST /workout_plans/:planId/exercises ──────────────────────────────────
    describe('createExercises', ()=>{
        it('should merge workout_plan_id from param and call service', async ()=>{
            mockServiceMethods.createExercises.mockResolvedValue(undefined);
            const body = {
                name: 'Bench Press',
                sets: 3,
                reps: [
                    10,
                    10,
                    10
                ],
                weights: [
                    80,
                    80,
                    80
                ]
            };
            await controller.createExercises('2', body, mockRequest());
            expect(service.createExercises).toHaveBeenCalledWith({
                ...body,
                workout_plan_id: 2
            }, mockUser.id);
        });
    });
    // ── DELETE /workout_plans/exercises/:exerciseId ────────────────────────────
    describe('deleteExercise', ()=>{
        it('should call service with numeric exerciseId', async ()=>{
            mockServiceMethods.deleteExercise.mockResolvedValue(undefined);
            await controller.deleteExercise('7');
            expect(service.deleteExercise).toHaveBeenCalledWith(7);
        });
    });
});
