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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';
import { WorkoutPlansService } from './workout_plans.service';
import { CreateExerciseDto, EditWorkoutPlanDto } from './dto/workout_plans_dto';
import { ChangeWorkoutPlanNameDto } from './dto/workout_plans_dto';
import { User } from 'src/types';
import { CreateWorkoutPlanDto } from './dto/workout_plans_dto';
import { DeleteWorkoutPlanDto } from './dto/workout_plans_dto';
@Controller('workout_plans')
export class WorkoutPlansController {
  constructor(
    private readonly workoutPlansService: WorkoutPlansService,
    @Inject('PRISMA_USER') private prisma: PrismaClient
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_workout_plans')
  async getWorkoutPlans(@Req() req: { user: User }) {
    const workout_plans = await this.workoutPlansService.getWorkoutPlans(req.user.id);
    if (!workout_plans) throw new NotFoundException('No workout plans found for this user');
    return workout_plans;
  }
  @UseGuards(JwtAuthGuard)
  @Put('edit_workout_plan')
  async editWorkoutPlan(@Body() body: EditWorkoutPlanDto) {
    console.log('Received request to edit workout plan with body:', body);
    return this.workoutPlansService.editWorkoutPlan(body);
  }
  @UseGuards(JwtAuthGuard)
  @Put('change_workout_plan_name')
  async changeWorkoutPlanName(@Body() body: ChangeWorkoutPlanNameDto) {
    return this.workoutPlansService.changeWorkoutPlanName(body.planId, body.newName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create_workout_plan')
  async createWorkoutPlan(@Req() req: { user: User }, @Body() body: CreateWorkoutPlanDto) {
    await this.workoutPlansService.createWorkoutPlan(body, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete('delete_workout_plan')
  async deleteWorkoutPlan(@Body() body: DeleteWorkoutPlanDto) {
    await this.workoutPlansService.deleteWorkoutPlan(body.planId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('create_exercise')
  async createExercises(@Body() body: CreateExerciseDto, @Req() req: { user: User }) {
    await this.workoutPlansService.createExercises(body, req.user.id);
  }
}
