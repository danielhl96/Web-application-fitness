"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ChangeWorkoutPlanNameDto () {
        return ChangeWorkoutPlanNameDto;
    },
    get CreateExerciseDto () {
        return CreateExerciseDto;
    },
    get CreateWorkoutPlanDto () {
        return CreateWorkoutPlanDto;
    },
    get DeleteWorkoutPlanDto () {
        return DeleteWorkoutPlanDto;
    },
    get EditWorkoutPlanDto () {
        return EditWorkoutPlanDto;
    },
    get ExerciseDto () {
        return ExerciseDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ExerciseDto = class ExerciseDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ExerciseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], ExerciseDto.prototype, "sets", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], ExerciseDto.prototype, "reps", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], ExerciseDto.prototype, "weights", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], ExerciseDto.prototype, "plan_id", void 0);
let CreateExerciseDto = class CreateExerciseDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], CreateExerciseDto.prototype, "workout_plan_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateExerciseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], CreateExerciseDto.prototype, "sets", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], CreateExerciseDto.prototype, "reps", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], CreateExerciseDto.prototype, "weights", void 0);
let CreateWorkoutPlanDto = class CreateWorkoutPlanDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateWorkoutPlanDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ExerciseDto),
    _ts_metadata("design:type", Array)
], CreateWorkoutPlanDto.prototype, "exercises", void 0);
let DeleteWorkoutPlanDto = class DeleteWorkoutPlanDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], DeleteWorkoutPlanDto.prototype, "planId", void 0);
let EditWorkoutPlanDto = class EditWorkoutPlanDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], EditWorkoutPlanDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], EditWorkoutPlanDto.prototype, "plan_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ExerciseDto),
    _ts_metadata("design:type", Array)
], EditWorkoutPlanDto.prototype, "exercises", void 0);
let ChangeWorkoutPlanNameDto = class ChangeWorkoutPlanNameDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], ChangeWorkoutPlanNameDto.prototype, "planId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangeWorkoutPlanNameDto.prototype, "newName", void 0);
