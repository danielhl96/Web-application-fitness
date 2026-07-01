"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MealsController", {
    enumerable: true,
    get: function() {
        return MealsController;
    }
});
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _mealsservice = require("./meals.service");
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _meals_dto = require("./dto/meals_dto");
const _openaiservice = require("../openai/openai.service");
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
let MealsController = class MealsController {
    async createMeal(req, createMealDto) {
        return this.mealsService.createMeal(req.user.id, createMealDto);
    }
    async calculateMeal(image, prompt) {
        return this.mealsService.calculateMeal(image, prompt);
    }
    async analyzeFoodText(text) {
        return this.mealsService.analyzeFoodText(text);
    }
    async deleteMeal(req, mealId) {
        return this.mealsService.deleteMeal(req.user.id, Number(mealId));
    }
    async editMeal(req, mealId, body) {
        return this.mealsService.editMeal({
            ...body,
            mealId: Number(mealId)
        }, req.user.id);
    }
    async getMeals(req, type, date) {
        switch(type){
            case 'breakfast':
                return this.mealsService.getBreakfast(req.user.id, date);
            case 'lunch':
                return this.mealsService.getLunch(req.user.id, date);
            case 'dinner':
                return this.mealsService.getDinner(req.user.id, date);
            case 'snack':
                return this.mealsService.getSnack(req.user.id, date);
            default:
                throw new _common.NotFoundException('Invalid meal type');
        }
    }
    constructor(mealsService){
        this.mealsService = mealsService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _meals_dto.CreateMealDto === "undefined" ? Object : _meals_dto.CreateMealDto
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "createMeal", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('calculate_meal'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('image')),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_param(1, (0, _common.Body)('prompt')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _openaiservice.MulterFile === "undefined" ? Object : _openaiservice.MulterFile,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "calculateMeal", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('analyze_food_text'),
    _ts_param(0, (0, _common.Body)('text')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "analyzeFoodText", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Delete)(':mealId'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Param)('mealId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "deleteMeal", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Put)(':mealId'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Param)('mealId')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        typeof Omit === "undefined" ? Object : Omit
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "editMeal", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Query)('type')),
    _ts_param(2, (0, _common.Query)('date')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MealsController.prototype, "getMeals", null);
MealsController = _ts_decorate([
    (0, _common.Controller)('meals'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mealsservice.MealsService === "undefined" ? Object : _mealsservice.MealsService
    ])
], MealsController);
