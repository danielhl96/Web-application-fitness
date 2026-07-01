import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCardioWorkoutDto } from './dto/dto';

@Injectable()
export class CardioService {
  constructor(@Inject('PRISMA_USER') private prismaUser: PrismaClient) {}

  async createCardioWorkout(userId: number, workoutData: CreateCardioWorkoutDto) {
    const paceMinPerKm = workoutData.durationMin / workoutData.distanceKm;

    await this.prismaUser.cardio.create({
      data: {
        user_id: userId,
        duration_min: workoutData.durationMin,
        distance_km: workoutData.distanceKm,
        avg_bpm: workoutData.avgBpm,
        max_bpm: workoutData.maxBpm,
        pace_min_per_km: paceMinPerKm,
        power_w: workoutData.powerW,
        cadence_spm: workoutData.cadenceSpm,
        calories: workoutData.calories,
        notes: workoutData.notes,
        date: workoutData.date ? new Date(workoutData.date) : this.today(),
      },
    });
    return { message: 'Cardio workout created successfully' };
  }

  async deleteCardioWorkout(userId: number, workoutId: number) {
    const workout = await this.prismaUser.cardio.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.user_id !== userId) {
      throw new Error('Workout not found or unauthorized');
    }

    await this.prismaUser.cardio.delete({
      where: { id: workoutId },
    });

    return { message: 'Cardio workout deleted successfully' };
  }

  async updateCardioWorkout(
    userId: number,
    workoutId: number,
    workoutData: CreateCardioWorkoutDto
  ) {
    const workout = await this.prismaUser.cardio.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.user_id !== userId) {
      throw new Error('Workout not found or unauthorized');
    }

    const paceMinPerKm = workoutData.durationMin / workoutData.distanceKm;

    await this.prismaUser.cardio.update({
      where: { id: workoutId },
      data: {
        duration_min: workoutData.durationMin,
        distance_km: workoutData.distanceKm,
        avg_bpm: workoutData.avgBpm,
        max_bpm: workoutData.maxBpm,
        pace_min_per_km: paceMinPerKm,
        power_w: workoutData.powerW,
        cadence_spm: workoutData.cadenceSpm,
        calories: workoutData.calories,
        notes: workoutData.notes,
        date: workoutData.date ? new Date(workoutData.date) : this.today(),
      },
    });

    return { message: 'Cardio workout updated successfully' };
  }

  async getCardioWorkoutByDate(userId: number, date: string) {
    const workout = await this.prismaUser.cardio.findFirst({
      where: {
        user_id: userId,
        date: new Date(date),
      },
    });
    return workout;
  }

  async getCardioWorkouts(userId: number) {
    const workouts = await this.prismaUser.cardio.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    });
    return workouts;
  }

  private today(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
