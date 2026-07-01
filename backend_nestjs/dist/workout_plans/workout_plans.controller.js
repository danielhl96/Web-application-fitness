"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkoutPlansController", {
    enumerable: true,
    get: function() {
        return WorkoutPlansController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _client = require("@prisma/client");
const _workout_plansservice = require("./workout_plans.service");
const _workout_plans_dto = require("./dto/workout_plans_dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let WorkoutPlansController = class WorkoutPlansController {
    async getWorkoutPlans(req) {
        const workout_plans = await this.workoutPlansService.getWorkoutPlans(req.user.id);
        if (!workout_plans) throw new _common.NotFoundException('No workout plans found for this user');
        return workout_plans;
    }
    async editWorkoutPlan(planId, body) {
        console.log('Received request to edit workout plan with planId:', planId, 'body:', body);
        return this.workoutPlansService.editWorkoutPlan({
            ...body,
            plan_id: Number(planId)
        });
    }
    async changeWorkoutPlanName(planId, body) {
        return this.workoutPlansService.changeWorkoutPlanName(Number(planId), body.newName);
    }
    async createWorkoutPlan(req, body) {
        await this.workoutPlansService.createWorkoutPlan(body, req.user.id);
    }
    async deleteWorkoutPlan(planId) {
        await this.workoutPlansService.deleteWorkoutPlan(Number(planId));
    }
    async createExercises(planId, body, req) {
        await this.workoutPlansService.createExercises({
            ...body,
            workout_plan_id: Number(planId)
        }, req.user.id);
    }
    async deleteExercise(exerciseId) {
        await this.workoutPlansService.deleteExercise(Number(exerciseId));
    }
    constructor(workoutPlansService, prisma){
        this.workoutPlansService = workoutPlansService;
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "getWorkoutPlans", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Put)(':planId'),
    _ts_param(0, (0, _common.Param)('planId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Omit === "undefined" ? Object : Omit
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "editWorkoutPlan", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Patch)(':planId/name'),
    _ts_param(0, (0, _common.Param)('planId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Omit === "undefined" ? Object : Omit
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "changeWorkoutPlanName", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _workout_plans_dto.CreateWorkoutPlanDto === "undefined" ? Object : _workout_plans_dto.CreateWorkoutPlanDto
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "createWorkoutPlan", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.HttpCode)(204),
    (0, _common.Delete)(':planId'),
    _ts_param(0, (0, _common.Param)('planId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "deleteWorkoutPlan", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(':planId/exercises'),
    _ts_param(0, (0, _common.Param)('planId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Omit === "undefined" ? Object : Omit,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "createExercises", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Delete)('exercises/:exerciseId'),
    _ts_param(0, (0, _common.Param)('exerciseId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkoutPlansController.prototype, "deleteExercise", null);
WorkoutPlansController = _ts_decorate([
    (0, _common.Controller)('workout_plans'),
    _ts_param(1, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workout_plansservice.WorkoutPlansService === "undefined" ? Object : _workout_plansservice.WorkoutPlansService,
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], WorkoutPlansController);
