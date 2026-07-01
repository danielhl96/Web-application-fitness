import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CardioModule } from './cardio/cardio.module';
import { WorkoutPlansModule } from './workout_plans/workout_plans.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MealsModule } from './meals/meals.module';
import { AicoachModule } from './aicoach/aicoach.module';
import { SttModule } from './stt/stt.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkoutPlansModule,
    StatisticsModule,
    MealsModule,
    AicoachModule,
    SttModule,
    CardioModule,
  ],
  providers: [],
})
export class AppModule {}
