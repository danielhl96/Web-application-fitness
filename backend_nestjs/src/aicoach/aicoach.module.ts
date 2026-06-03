import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { AicoachService } from './aicoach.service';
import { AicoachController } from './aicoach.controller';
@Module({
  imports: [OpenaiModule],
  providers: [AicoachService],
  controllers: [AicoachController],
})
export class AicoachModule {}
