import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { SttGateway } from './stt.gateway';

@Module({
  imports: [OpenaiModule],
  providers: [SttGateway],
})
export class SttModule {}
