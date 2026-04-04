import { Controller, UseGuards, Get, Body, Post } from '@nestjs/common';
import { AicoachService } from './aicoach.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('aicoach')
export class AicoachController {
  constructor(private aicoachService: AicoachService) {}

  @UseGuards(JwtAuthGuard)
  @Post('response')
  async getResponse(
    @Body() body: { question: string; history: { isUser: boolean; message: string }[] }
  ) {
    return this.aicoachService.getResponse(body.question, body.history);
  }
}
