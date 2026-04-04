import { Module } from '@nestjs/common';
import { AicoachService } from './aicoach.service';
import { AicoachController } from './aicoach.controller';
@Module({
  imports: [],
  providers: [AicoachService],
  controllers: [AicoachController],
})
export class AicoachModule {}
