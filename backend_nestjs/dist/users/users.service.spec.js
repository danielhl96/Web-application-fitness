"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _usersservice = require("./users.service");
const _common = require("@nestjs/common");
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
// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock('argon2');
const prismaMock = {
    users: {
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    },
    history_body_metrics: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
    }
};
// ── Tests ─────────────────────────────────────────────────────────────────────
describe('UsersService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _usersservice.UsersService,
                {
                    provide: 'PRISMA_USER',
                    useValue: prismaMock
                }
            ]
        }).compile();
        service = module.get(_usersservice.UsersService);
        jest.clearAllMocks();
    });
    // ── findOne ─────────────────────────────────────────────────────────────────
    describe('findOne', ()=>{
        it('should return user data when user exists', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.de',
                height: 180,
                password: 'hashed-password'
            };
            prismaMock.users.findUnique.mockResolvedValue(mockUser);
            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
        });
        it('should throw NotFoundException when user does not exist', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue(null);
            await expect(service.findOne(99)).rejects.toThrow(_common.NotFoundException);
        });
    });
    // ── changeEmail ─────────────────────────────────────────────────────────────
    describe('changeEmail', ()=>{
        it('should update email and return success message', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue({
                password: 'hashed-password'
            });
            _argon2.verify.mockResolvedValue(true);
            prismaMock.users.update.mockResolvedValue({});
            const result = await service.changeEmail(1, 'new@test.de', 'hashed-password');
            expect(prismaMock.users.update).toHaveBeenCalledWith({
                where: {
                    id: 1
                },
                data: {
                    email: 'new@test.de'
                }
            });
            expect(result).toEqual({
                message: 'Email updated successfully'
            });
        });
    });
    // ── changePassword ──────────────────────────────────────────────────────────
    describe('changePassword', ()=>{
        it('should change password when old password is correct', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue({
                password: 'hashed-old'
            });
            _argon2.verify.mockResolvedValue(true);
            _argon2.hash.mockResolvedValue('hashed-new');
            prismaMock.users.update.mockResolvedValue({});
            const result = await service.changePassword(1, 'oldpass', 'newpass');
            expect(prismaMock.users.update).toHaveBeenCalledWith({
                where: {
                    id: 1
                },
                data: {
                    password: 'hashed-new'
                }
            });
            expect(result).toEqual({
                message: 'Password updated successfully'
            });
        });
        it('should throw UnauthorizedException when old password is wrong', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue({
                password: 'hashed-old'
            });
            _argon2.verify.mockResolvedValue(false);
            await expect(service.changePassword(1, 'wrongpass', 'newpass')).rejects.toThrow(_common.UnauthorizedException);
        });
        it('should throw NotFoundException when user does not exist', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue(null);
            await expect(service.changePassword(99, 'any', 'any')).rejects.toThrow(_common.NotFoundException);
        });
    });
    // ── remove ──────────────────────────────────────────────────────────────────
    describe('remove', ()=>{
        it('should delete the user and return success message', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue({
                id: 1
            });
            prismaMock.users.delete.mockResolvedValue({});
            const result = await service.remove(1);
            expect(prismaMock.users.delete).toHaveBeenCalledWith({
                where: {
                    id: 1
                }
            });
            expect(result).toEqual({
                message: 'User deleted successfully'
            });
        });
        it('should throw NotFoundException when user does not exist', async ()=>{
            prismaMock.users.findUnique.mockResolvedValue(null);
            await expect(service.remove(99)).rejects.toThrow(_common.NotFoundException);
        });
    });
    // ── getHistory ──────────────────────────────────────────────────────────────
    describe('getHistory', ()=>{
        it('should return history entries for a user', async ()=>{
            const history = [
                {
                    id: 1,
                    weight: 80,
                    date: new Date()
                }
            ];
            prismaMock.history_body_metrics.findMany.mockResolvedValue(history);
            const result = await service.getHistory(1);
            expect(result).toEqual(history);
            expect(prismaMock.history_body_metrics.findMany).toHaveBeenCalledWith({
                where: {
                    user_id: 1
                }
            });
        });
    });
    // ── updateHistory ────────────────────────────────────────────────────────────
    describe('updateHistory', ()=>{
        const data = {
            weight: 82,
            hip: 90,
            waist: 80,
            bpf: 15
        };
        it('should update existing history entry when one exists today', async ()=>{
            const existing = {
                id: 5
            };
            prismaMock.history_body_metrics.findFirst.mockResolvedValue(existing);
            prismaMock.history_body_metrics.update.mockResolvedValue({});
            await service.updateHistory(1, data);
            expect(prismaMock.history_body_metrics.update).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    id: 5
                }
            }));
        });
        it('should create a new history entry when none exists today', async ()=>{
            prismaMock.history_body_metrics.findFirst.mockResolvedValue(null);
            prismaMock.history_body_metrics.create.mockResolvedValue({});
            await service.updateHistory(1, data);
            expect(prismaMock.history_body_metrics.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    user_id: 1
                })
            }));
        });
    });
});
