import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class AicoachService {
  constructor(private readonly openaiService: OpenaiService) {}

  async getResponse(question: string, history: { isUser: boolean; message: string }[]) {
    const reply = await this.openaiService.aiCoach(question, history);
    return { message: reply };
  }
}
