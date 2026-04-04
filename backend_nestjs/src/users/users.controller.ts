import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Inject,
  UseGuards,
  Req,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  EmailChangeDto,
  PasswordChangeDto,
  DeleteProfileDto,
  UpdateProfileDto,
} from './dto/users.dto';
import { User } from 'src/types';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: { user: User }) {
    const user = await this.usersService.findOne(req.user.id);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('edit_profile')
  async updateProfile(@Req() req: { user: User }, @Body() data: UpdateProfileDto) {
    await Promise.all([
      this.usersService.update(req.user.id, data),
      this.usersService.updateHistory(req.user.id, data),
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_history')
  async getHistory(@Req() req: { user: User }) {
    return this.usersService.getHistory(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change_email')
  async changeEmail(@Req() req: { user: User }, @Body() body: EmailChangeDto) {
    return this.usersService.changeEmail(req.user.id, body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change_password')
  async changePassword(@Req() req: { user: User }, @Body() body: PasswordChangeDto) {
    return this.usersService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete_account')
  async deleteAccount(@Req() req: { user: User }, @Body() body: DeleteProfileDto) {
    await this.usersService.remove(req.user.id);
  }
}
