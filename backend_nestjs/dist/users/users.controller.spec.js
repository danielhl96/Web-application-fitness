"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _userscontroller = require("./users.controller");
const _usersservice = require("./users.service");
describe('UsersController', ()=>{
    let usersController;
    let usersService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _userscontroller.UsersController
            ],
            providers: [
                {
                    provide: _usersservice.UsersService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue(null),
                        update: jest.fn().mockResolvedValue(null),
                        updateHistory: jest.fn().mockResolvedValue(null),
                        remove: jest.fn().mockResolvedValue(null),
                        changeEmail: jest.fn().mockResolvedValue({
                            message: 'Email updated successfully'
                        }),
                        changePassword: jest.fn().mockResolvedValue({
                            message: 'Password updated successfully'
                        }),
                        getHistory: jest.fn().mockResolvedValue([])
                    }
                }
            ]
        }).compile();
        usersController = module.get(_userscontroller.UsersController);
        usersService = module.get(_usersservice.UsersService);
    });
    describe('update Profile', ()=>{
        it('should  update the user profile', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                height: 180,
                weight: 75
            };
            const mockData = {
                height: 180,
                weight: 95
            };
            await usersController.updateProfile({
                user: mockUser
            }, mockData);
            expect(usersService.update).toHaveBeenCalledWith(mockUser.id, mockData);
            expect(usersService.updateHistory).toHaveBeenCalledWith(mockUser.id, mockData);
        });
    });
    describe('get history', ()=>{
        it('should return the user history', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                height: 180,
                weight: 75
            };
            const mockHistory = [
                {
                    id: 1,
                    user_id: 1,
                    height: 180,
                    weight: 75,
                    date: new Date()
                },
                {
                    id: 2,
                    user_id: 1,
                    height: 180,
                    weight: 80,
                    date: new Date()
                }
            ];
            usersService.getHistory = jest.fn().mockResolvedValue(mockHistory);
            const result = await usersController.getHistory({
                user: mockUser
            });
            expect(usersService.getHistory).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockHistory);
        });
    });
    describe('change email', ()=>{
        it('should update the user email and return a success message', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.com'
            };
            const mockBody = {
                email: 'test@test.com',
                password: 'password'
            };
            const mockResponse = {
                message: 'Email updated successfully'
            };
            usersService.changeEmail = jest.fn().mockResolvedValue(mockResponse);
            const result = await usersController.changeEmail({
                user: mockUser
            }, mockBody);
            expect(usersService.changeEmail).toHaveBeenCalledWith(mockUser.id, mockBody.email, mockBody.password);
            expect(result).toEqual(mockResponse);
        });
    });
    describe('change password', ()=>{
        it('should update the user password and return a success message', async ()=>{
            const mockUser = {
                id: 1,
                email: 'test@test.com'
            };
            const mockBody = {
                oldPassword: 'oldpassword',
                newPassword: 'newpassword'
            };
            const mockResponse = {
                message: 'Password updated successfully'
            };
            usersService.changePassword = jest.fn().mockResolvedValue(mockResponse);
            const result = await usersController.changePassword({
                user: mockUser
            }, mockBody);
            expect(usersService.changePassword).toHaveBeenCalledWith(mockUser.id, mockBody.oldPassword, mockBody.newPassword);
            expect(result).toEqual(mockResponse);
        });
    });
    describe('should not update the user email if password is wrong', ()=>{
        it('should throw an error if the password is incorrect', async ()=>{
            const mockUser = {
                id: 1,
                email: 'das@example.com'
            };
            const mockBody = {
                email: 'newemail@example.com',
                password: 'wrongpassword'
            };
            usersService.changeEmail = jest.fn().mockRejectedValue(new Error('Password is incorrect'));
            await expect(usersController.changeEmail({
                user: mockUser
            }, mockBody)).rejects.toThrow('Password is incorrect');
            expect(usersService.changeEmail).toHaveBeenCalledWith(mockUser.id, mockBody.email, mockBody.password);
        });
    });
});
