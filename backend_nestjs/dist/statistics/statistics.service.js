"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StatisticsService", {
    enumerable: true,
    get: function() {
        return StatisticsService;
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
let StatisticsService = class StatisticsService {
    async getUserStatistics(userId) {
        const list = {};
        const exercises = await this.prisma.exercises.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                date: 'asc'
            }
        });
        if (!exercises || exercises.length === 0) throw new _common.NotFoundException('No exercises found for this user');
        for (const exercise of exercises){
            if (!(exercise.name in list)) {
                list[exercise.name] = [];
            }
            list[exercise.name].push({
                name: exercise.name,
                date: exercise.date,
                sets: exercise.sets,
                reps: exercise.reps,
                weights: exercise.weights,
                id: exercise.id
            });
        }
        return list;
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
StatisticsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], StatisticsService);
