import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
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
  @Get()
  async getWorkoutPlans(@Req() req: { user: User }) {
    const workout_plans = await this.workoutPlansService.getWorkoutPlans(req.user.id);
    if (!workout_plans) throw new NotFoundException('No workout plans found for this user');
    return workout_plans;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':planId')
  async editWorkoutPlan(
    @Param('planId') planId: string,
    @Body() body: Omit<EditWorkoutPlanDto, 'plan_id'>
  ) {
    console.log('Received request to edit workout plan with planId:', planId, 'body:', body);
    return this.workoutPlansService.editWorkoutPlan({ ...body, plan_id: Number(planId) });
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':planId/name')
  async changeWorkoutPlanName(
    @Param('planId') planId: string,
    @Body() body: Omit<ChangeWorkoutPlanNameDto, 'planId'>
  ) {
    return this.workoutPlansService.changeWorkoutPlanName(Number(planId), body.newName);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWorkoutPlan(@Req() req: { user: User }, @Body() body: CreateWorkoutPlanDto) {
    await this.workoutPlansService.createWorkoutPlan(body, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':planId')
  async deleteWorkoutPlan(@Param('planId') planId: string) {
    await this.workoutPlansService.deleteWorkoutPlan(Number(planId));
  }
  @UseGuards(JwtAuthGuard)
  @Post(':planId/exercises')
  async createExercises(
    @Param('planId') planId: string,
    @Body() body: Omit<CreateExerciseDto, 'workout_plan_id'>,
    @Req() req: { user: User }
  ) {
    await this.workoutPlansService.createExercises(
      { ...body, workout_plan_id: Number(planId) },
      req.user.id
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('exercises/:exerciseId')
  async deleteExercise(@Param('exerciseId') exerciseId: string) {
    await this.workoutPlansService.deleteExercise(Number(exerciseId));
  }
}
