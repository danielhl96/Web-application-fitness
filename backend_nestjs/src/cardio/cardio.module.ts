import { Module } from '@nestjs/common';
import { CardioService } from './cardio.service';
import { CardioController } from './cardio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [CardioService],
  controllers: [CardioController],
  exports: [CardioService],
})
export class CardioModule {}
