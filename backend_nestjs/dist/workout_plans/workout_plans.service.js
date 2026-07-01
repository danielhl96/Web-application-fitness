"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkoutPlansService", {
    enumerable: true,
    get: function() {
        return WorkoutPlansService;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
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
let WorkoutPlansService = class WorkoutPlansService {
    async changeWorkoutPlanName(planId, newName) {
        await this.prisma.workout_plans.update({
            where: {
                id: planId
            },
            data: {
                name: newName
            }
        });
        return {
            message: 'Workout plan name updated successfully'
        };
    }
    async editWorkoutPlan(data) {
        console.log('Editing workout plan with id:', data.plan_id, 'and data:', data);
        const plan = await this.prisma.workout_plans.findUnique({
            where: {
                id: data.plan_id
            }
        });
        if (!plan) {
            throw new Error('Workout plan not found');
        }
        await this.prisma.workout_plans.update({
            where: {
                id: data.plan_id
            },
            data: {
                ...data.name && {
                    name: data.name
                },
                plan_exercise_templates: {
                    deleteMany: {
                        workout_plan_id: data.plan_id
                    },
                    createMany: {
                        data: data.exercises.map((exercise)=>({
                                name: exercise.name,
                                sets: exercise.sets,
                                reps_template: exercise.reps,
                                weights_template: exercise.weights,
                                date: new Date()
                            }))
                    }
                }
            }
        });
        return {
            message: 'Workout plan updated successfully'
        };
    }
    async getWorkoutPlans(userId) {
        const plans = await this.prisma.workout_plans.findMany({
            where: {
                user_id: userId
            },
            include: {
                exercises: {
                    orderBy: {
                        date: 'desc'
                    },
                    where: {
                        user_id: userId
                    }
                },
                plan_exercise_templates: {
                    select: {
                        id: true,
                        name: true,
                        sets: true,
                        reps_template: true,
                        weights_template: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        return plans.map((plan)=>{
            // For each exercise name, keep only the most recently logged entry
            const latestByName = new Map();
            for (const exercise of plan.exercises){
                const existing = latestByName.get(exercise.name);
                if (!existing || exercise.date > existing.date) {
                    latestByName.set(exercise.name, exercise);
                }
            }
            return {
                ...plan,
                exercises: Array.from(latestByName.values())
            };
        });
    }
    async createWorkoutPlan(body, userId) {
        const { name, exercises } = body;
        await this.prisma.workout_plans.findFirst({
            where: {
                user_id: userId,
                name: name
            }
        }).then((existingPlan)=>{
            if (existingPlan) {
                throw new _common.ConflictException('Workout plan with this name already exists for this user');
            }
        });
        await this.prisma.workout_plans.create({
            data: {
                name,
                user_id: userId,
                plan_exercise_templates: {
                    createMany: {
                        data: exercises.map((exercise)=>({
                                name: exercise.name,
                                sets: exercise.sets,
                                reps_template: exercise.reps,
                                weights_template: exercise.weights,
                                date: new Date()
                            }))
                    }
                }
            }
        });
        return {
            message: 'Workout plan created successfully'
        };
    }
    async deleteWorkoutPlan(planId) {
        await this.prisma.plan_exercise_templates.deleteMany({
            where: {
                workout_plan_id: planId
            }
        });
        await this.prisma.exercises.deleteMany({
            where: {
                workout_plan_id: planId
            }
        });
        await this.prisma.workout_plans.delete({
            where: {
                id: planId
            }
        });
        return {
            message: 'Workout plan deleted successfully'
        };
    }
    async createExercises(data, userId) {
        const plan = await this.prisma.workout_plans.findUnique({
            where: {
                id: data.workout_plan_id
            }
        });
        if (!plan) {
            throw new Error('Workout plan not found');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exercise = await this.prisma.exercises.findFirst({
            where: {
                workout_plan_id: data.workout_plan_id,
                name: data.name,
                date: today
            }
        });
        if (exercise) {
            await this.prisma.exercises.update({
                where: {
                    id: exercise.id
                },
                data: {
                    sets: data.sets,
                    reps: data.reps,
                    weights: data.weights
                }
            });
            return {
                message: 'Exercise updated successfully'
            };
        }
        await this.prisma.exercises.create({
            data: {
                name: data.name,
                sets: data.sets,
                reps: data.reps,
                weights: data.weights,
                workout_plan_id: data.workout_plan_id,
                user_id: userId,
                date: today
            }
        });
        return {
            message: 'Exercises added to workout plan successfully'
        };
    }
    async deleteExercise(exerciseId) {
        await this.prisma.exercises.delete({
            where: {
                id: exerciseId
            }
        });
        return {
            message: 'Exercise deleted successfully'
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
WorkoutPlansService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], WorkoutPlansService);
