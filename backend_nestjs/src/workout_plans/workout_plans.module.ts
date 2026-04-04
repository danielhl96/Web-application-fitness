import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutPlansService } from './workout_plans.service';
import { WorkoutPlansController } from './workout_plans.controller';

@Module({
  imports: [PrismaModule],
  providers: [WorkoutPlansService],
  controllers: [WorkoutPlansController],
  exports: [WorkoutPlansService],
})
export class WorkoutPlansModule {}
