import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('PRISMA_USER') private prisma: PrismaClient
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.prisma.users.findUnique({
      where: { id: user.id },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() data: any) {
    const user = req.user as any;
    return this.prisma.users.update({
      where: { id: user.id },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.prisma.users.delete({
      where: { id: user.id },
    });
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.users.create({ data });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.users.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.users.delete({
      where: { id: parseInt(id) },
    });
  }
}
