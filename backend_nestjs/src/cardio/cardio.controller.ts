import {
  Controller,
  Post,
  UseGuards,
  Delete,
  Patch,
  Get,
  Req,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CardioService } from './cardio.service';
import { CreateCardioWorkoutDto } from './dto/dto';
import { User } from 'src/types';

@Controller('cardio')
export class CardioController {
  constructor(private readonly cardioService: CardioService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCardioWorkout(
    @Req() req: { user: User },
    @Body() workoutData: CreateCardioWorkoutDto
  ) {
    return this.cardioService.createCardioWorkout(req.user.id, workoutData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCardioWorkout(@Req() req: { user: User }, @Param('id') id: string) {
    return this.cardioService.deleteCardioWorkout(req.user.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCardioWorkout(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() workoutData: CreateCardioWorkoutDto
  ) {
    return this.cardioService.updateCardioWorkout(req.user.id, Number(id), workoutData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCardioWorkouts(@Req() req: { user: User }, @Query('date') date?: string) {
    if (date) {
      return this.cardioService.getCardioWorkoutByDate(req.user.id, date);
    }
    return this.cardioService.getCardioWorkouts(req.user.id);
  }
}
