import { StatisticsService } from './statistics.service';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    @Inject('PRISMA_USER') private prisma: PrismaClient
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('exercise_statistics')
  async getUserStatistics(
    @Req() req: { user: { id: number } }
  ): Promise<
    Record<string, { name: string; date: Date; sets: number; reps: number[]; weights: number[] }[]>
  > {
    return this.statisticsService.getUserStatistics(req.user.id);
  }
}
