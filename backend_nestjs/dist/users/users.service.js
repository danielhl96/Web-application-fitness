"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
const _argon2 = /*#__PURE__*/ _interop_require_wildcard(require("argon2"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
let UsersService = class UsersService {
    async getHistory(id) {
        return this.prisma.history_body_metrics.findMany({
            where: {
                user_id: id
            }
        });
    }
    async findOne(id) {
        const user = await this.prisma.users.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                email: true,
                height: true,
                weight: true,
                age: true,
                gender: true,
                waist: true,
                hip: true,
                bfp: true,
                activity_level: true,
                goal: true,
                bmi: true,
                calories: true
            }
        });
        if (!user) throw new _common.NotFoundException('User not found');
        return user;
    }
    async update(id, data) {
        return this.prisma.users.update({
            where: {
                id
            },
            data
        });
    }
    async changeEmail(id, email, password) {
        const userFromDb = await this.prisma.users.findUnique({
            where: {
                id
            },
            select: {
                password: true
            }
        });
        if (!userFromDb) throw new _common.NotFoundException('User not found');
        if (!await _argon2.verify(userFromDb.password, password)) {
            throw new _common.UnauthorizedException('Password is incorrect');
        }
        await this.prisma.users.update({
            where: {
                id
            },
            data: {
                email
            }
        });
        return {
            message: 'Email updated successfully'
        };
    }
    async changePassword(id, oldPassword, newPassword) {
        const passwordFromDb = await this.prisma.users.findUnique({
            where: {
                id
            },
            select: {
                password: true
            }
        });
        if (!passwordFromDb) {
            throw new _common.NotFoundException('User not found');
        }
        if (!await _argon2.verify(passwordFromDb.password, oldPassword)) {
            throw new _common.UnauthorizedException('Old password is incorrect');
        }
        const hashedPassword = await _argon2.hash(newPassword);
        await this.prisma.users.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        });
        return {
            message: 'Password updated successfully'
        };
    }
    async updateHistory(id, data) {
        const weight = data.weight;
        const hip = data.hip;
        const waist = data.waist;
        const bpf = data.bpf;
        const history_data = {
            weight,
            hip,
            waist,
            bpf
        };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.prisma.history_body_metrics.findFirst({
            where: {
                user_id: id,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        }).then((existingEntry)=>{
            if (existingEntry) {
                // Update the existing entry
                return this.prisma.history_body_metrics.update({
                    where: {
                        id: existingEntry.id
                    },
                    data: {
                        ...history_data,
                        date: today
                    }
                });
            } else {
                // Create a new entry
                return this.prisma.history_body_metrics.create({
                    data: {
                        ...history_data,
                        user_id: id,
                        date: today
                    }
                });
            }
        });
    }
    async remove(id) {
        const user = await this.prisma.users.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        await this.prisma.users.delete({
            where: {
                id
            }
        });
        return {
            message: 'User deleted successfully'
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('PRISMA_USER')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _client.PrismaClient === "undefined" ? Object : _client.PrismaClient
    ])
], UsersService);
