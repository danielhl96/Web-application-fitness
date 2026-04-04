import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ExerciseTemplate } from '../types';
import { CreateExerciseDto, CreateWorkoutPlanDto } from './dto/workout_plans_dto';

@Injectable()
export class WorkoutPlansService {
  constructor(@Inject('PRISMA_USER') private prisma: PrismaClient) {}

  async changeWorkoutPlanName(planId: number, newName: string) {
    await this.prisma.workout_plans.update({
      where: { id: planId },
      data: { name: newName },
    });
    return { message: 'Workout plan name updated successfully' };
  }

  async editWorkoutPlan(data: ExerciseTemplate) {
    console.log('Editing workout plan with id:', data.plan_id, 'and data:', data);
    const plan = await this.prisma.workout_plans.findUnique({ where: { id: data.plan_id } });
    if (!plan) {
      throw new Error('Workout plan not found');
    }

    await this.prisma.workout_plans.update({
      where: { id: data.plan_id },
      data: {
        ...(data.name && { name: data.name }),
        plan_exercise_templates: {
          deleteMany: { workout_plan_id: data.plan_id },
          createMany: {
            data: data.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              reps_template: exercise.reps,
              weights_template: exercise.weights,
              date: new Date(),
            })),
          },
        },
      },
    });

    return { message: 'Workout plan updated successfully' };
  }

  async getWorkoutPlans(userId: number) {
    const plans = await this.prisma.workout_plans.findMany({
      where: { user_id: userId },
      include: {
        exercises: {
          orderBy: { date: 'desc' },
          where: { user_id: userId },
        },
        plan_exercise_templates: {
          select: { id: true, name: true, sets: true, reps_template: true, weights_template: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    return plans.map((plan) => {
      // For each exercise name, keep only the most recently logged entry
      const latestByName = new Map<string, (typeof plan.exercises)[0]>();
      for (const exercise of plan.exercises) {
        const existing = latestByName.get(exercise.name);
        if (!existing || exercise.date > existing.date) {
          latestByName.set(exercise.name, exercise);
        }
      }

      return {
        ...plan,
        exercises: Array.from(latestByName.values()),
      };
    });
  }
  async createWorkoutPlan(body: CreateWorkoutPlanDto, userId: number) {
    const { name, exercises } = body;
    const workoutPlan = await this.prisma.workout_plans.create({
      data: {
        name,
        user_id: userId,
        plan_exercise_templates: {
          createMany: {
            data: exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              reps_template: exercise.reps,
              weights_template: exercise.weights,
              date: new Date(),
            })),
          },
        },
      },
    });
    return { message: 'Workout plan created successfully' };
  }
  async deleteWorkoutPlan(planId: number) {
    await this.prisma.plan_exercise_templates.deleteMany({ where: { workout_plan_id: planId } });
    await this.prisma.exercises.deleteMany({ where: { workout_plan_id: planId } });
    await this.prisma.workout_plans.delete({ where: { id: planId } });
    return { message: 'Workout plan deleted successfully' };
  }

  async createExercises(data: CreateExerciseDto, userId: number) {
    const plan = await this.prisma.workout_plans.findUnique({
      where: { id: data.workout_plan_id },
    });
    if (!plan) {
      throw new Error('Workout plan not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exercise = await this.prisma.exercises.findFirst({
      where: {
        workout_plan_id: data.workout_plan_id,
        name: data.name,
        date: today,
      },
    });

    if (exercise) {
      await this.prisma.exercises.update({
        where: { id: exercise.id },
        data: {
          sets: data.sets,
          reps: data.reps,
          weights: data.weights,
        },
      });
      return { message: 'Exercise updated successfully' };
    }

    await this.prisma.exercises.create({
      data: {
        name: data.name,
        sets: data.sets,
        reps: data.reps,
        weights: data.weights,
        workout_plan_id: data.workout_plan_id,
        user_id: userId,
        date: today,
      },
    });

    return { message: 'Exercises added to workout plan successfully' };
  }
}
