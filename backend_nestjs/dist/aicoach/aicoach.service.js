"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AicoachService", {
    enumerable: true,
    get: function() {
        return AicoachService;
    }
});
const _common = require("@nestjs/common");
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
let AicoachService = class AicoachService {
    async getResponse(question, history) {
        const reply = await this.openaiService.aiCoach(question, history);
        return {
            message: reply
        };
    }
    constructor(openaiService){
        this.openaiService = openaiService;
    }
};
AicoachService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _openaiservice.OpenaiService === "undefined" ? Object : _openaiservice.OpenaiService
    ])
], AicoachService);
