"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _usersmodule = require("./users/users.module");
const _authmodule = require("./auth/auth.module");
const _prismamodule = require("./prisma/prisma.module");
const _workout_plansmodule = require("./workout_plans/workout_plans.module");
const _statisticsmodule = require("./statistics/statistics.module");
const _mealsmodule = require("./meals/meals.module");
const _aicoachmodule = require("./aicoach/aicoach.module");
const _sttmodule = require("./stt/stt.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _workout_plansmodule.WorkoutPlansModule,
            _statisticsmodule.StatisticsModule,
            _mealsmodule.MealsModule,
            _aicoachmodule.AicoachModule,
            _sttmodule.SttModule
        ],
        providers: []
    })
], AppModule);
