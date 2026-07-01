"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MealsService", {
    enumerable: true,
    get: function() {
        return MealsService;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
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
let MealsService = class MealsService {
    today() {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }
    async createMeal(userId, mealData) {
        await this.prismaUser.meals.create({
            data: {
                user_id: userId,
                name: mealData.name,
                mealtype: mealData.mealtype,
                calories: mealData.calories,
                carbs: mealData.carbs,
                protein: mealData.protein,
                fats: mealData.fats,
                date: mealData.date ? new Date(mealData.date) : this.today()
            }
        });
        return {
            message: 'Meal created successfully'
        };
    }
    async deleteMeal(userId, mealId) {
        await this.prismaUser.meals.deleteMany({
            where: {
                id: mealId,
                user_id: userId
            }
        });
        return {
            message: 'Meal deleted successfully'
        };
    }
    async editMeal(mealData, userId) {
        await this.prismaUser.meals.updateMany({
            where: {
                id: mealData.mealId,
                user_id: userId
            },
            data: {
                name: mealData.name,
                calories: mealData.calories,
                carbs: mealData.carbs,
                protein: mealData.protein,
                fats: mealData.fats
            }
        });
        return {
            message: 'Meal updated successfully'
        };
    }
    async calculateMeal(imageFile, prompt) {
        const result = await this.openaiService.analyzeFoodImage(prompt, imageFile);
        if (!result) {
            throw new Error('Could not analyze the meal. Please try again with a clearer image or more detailed prompt.');
        }
        console.log('Meal analysis result:', result);
        return {
            message: 'Meal calculated successfully',
            name: result.name,
            calories: result.calories,
            carbs: result.carbs,
            protein: result.protein,
            fats: result.fats
        };
    }
    async analyzeFoodText(text) {
        const result = await this.openaiService.analyzeFoodText(text);
        if (!result) {
            throw new Error('Could not analyze the meal. Please try again with a clearer description.');
        }
        console.log('Meal analysis result:', result);
        return {
            message: 'Meal analyzed successfully',
            name: result.name,
            calories: result.calories,
            carbs: result.carbs,
            protein: result.protein,
            fats: result.fats
        };
    }
    async createLunch(userId, mealData) {
        await this.prismaUser.meals.create({
            data: {
                user_id: userId,
                name: mealData.name,
                mealtype: 'lunch',
                calories: mealData.calories,
                carbs: mealData.carbs,
                protein: mealData.protein,
                fats: mealData.fats,
                date: this.today()
            }
        });
        return {
            message: 'Lunch created successfully'
        };
    }
    async getBreakfast(userId, date) {
        return this.prismaUser.meals.findMany({
            where: {
                user_id: userId,
                mealtype: 'breakfast',
                date: date ? new Date(date) : undefined
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
    async getLunch(userId, date) {
        return this.prismaUser.meals.findMany({
            where: {
                user_id: userId,
                mealtype: 'lunch',
                ...date && {
                    date: new Date(date)
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
    async getDinner(userId, date) {
        console.log('Getting dinner for user:', userId, 'on date:', date);
        return this.prismaUser.meals.findMany({
            where: {
                user_id: userId,
                mealtype: 'dinner',
                ...date && {
                    date: new Date(date)
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
    async getSnack(userId, date) {
        return this.prismaUser.meals.findMany({
            where: {
                user_id: userId,
                mealtype: 'snacks',
                ...date && {
                    date: new Date(date)
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
    constructor(prismaUser, openaiService){
        this.prismaUser = prismaUser;
        this.openaiService = openaiService;
    }
};
MealsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient,
        typeof _openaiservice.OpenaiService === "undefined" ? Object : _openaiservice.OpenaiService
    ])
], MealsService);
