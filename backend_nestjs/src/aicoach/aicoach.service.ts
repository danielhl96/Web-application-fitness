import { Injectable } from '@nestjs/common';
import { aiCoach } from '../openai';

@Injectable()
export class AicoachService {
  async getResponse(question: string, history: { isUser: boolean; message: string }[]) {
    const reply = await aiCoach(question, history);
    return { message: reply };
  }
}
