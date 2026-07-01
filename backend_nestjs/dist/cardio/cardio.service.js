"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardioService", {
    enumerable: true,
    get: function() {
        return CardioService;
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
let CardioService = class CardioService {
    async createCardioWorkout(userId, workoutData) {
        const paceMinPerKm = workoutData.durationMin / workoutData.distanceKm;
        await this.prismaUser.cardio.create({
            data: {
                user_id: userId,
                duration_min: workoutData.durationMin,
                distance_km: workoutData.distanceKm,
                avg_bpm: workoutData.avgBpm,
                max_bpm: workoutData.maxBpm,
                pace_min_per_km: paceMinPerKm,
                power_w: workoutData.powerW,
                cadence_spm: workoutData.cadenceSpm,
                calories: workoutData.calories,
                notes: workoutData.notes,
                date: workoutData.date ? new Date(workoutData.date) : this.today()
            }
        });
        return {
            message: 'Cardio workout created successfully'
        };
    }
    today() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    constructor(prismaUser){
        this.prismaUser = prismaUser;
    }
};
CardioService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], CardioService);
