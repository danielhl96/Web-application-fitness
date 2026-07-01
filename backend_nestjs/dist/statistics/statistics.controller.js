"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StatisticsController", {
    enumerable: true,
    get: function() {
        return StatisticsController;
    }
});
const _statisticsservice = require("./statistics.service");
const _client = require("@prisma/client");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _common = require("@nestjs/common");
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
let StatisticsController = class StatisticsController {
    async getUserStatistics(req) {
        return this.statisticsService.getUserStatistics(req.user.id);
    }
    constructor(statisticsService, prisma){
        this.statisticsService = statisticsService;
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('exercises'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], StatisticsController.prototype, "getUserStatistics", null);
StatisticsController = _ts_decorate([
    (0, _common.Controller)('statistics'),
    _ts_param(1, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _statisticsservice.StatisticsService === "undefined" ? Object : _statisticsservice.StatisticsService,
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], StatisticsController);
