import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class StatisticsService {
  constructor(@Inject('PRISMA_USER') private prisma: PrismaClient) {}

  async getUserStatistics(
    userId: number
  ): Promise<
    Record<string, { name: string; date: Date; sets: number; reps: number[]; weights: number[] }[]>
  > {
    const list: Record<
      string,
      { name: string; date: Date; sets: number; reps: number[]; weights: number[] }[]
    > = {};
    const exercises = await this.prisma.exercises.findMany({
      where: { user_id: userId },
      orderBy: { date: 'asc' },
    });
    if (!exercises || exercises.length === 0)
      throw new NotFoundException('No exercises found for this user');
    for (const exercise of exercises) {
      if (!(exercise.name in list)) {
        list[exercise.name] = [];
      }
      list[exercise.name].push({
        name: exercise.name,
        date: exercise.date,
        sets: exercise.sets,
        reps: exercise.reps,
        weights: exercise.weights,
      });
    }
    return list;
  }
}
