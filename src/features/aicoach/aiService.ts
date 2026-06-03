import { httpClient } from '../../shared/Utils/api';
import { IHttpClient } from '../../shared/interfaces/IHttpClient';
import { ChatMessage } from './useAiCoach';

export class AiService {
  constructor(private httpClient: IHttpClient) {}

  async getAiResponse(question: string, history: ChatMessage[]): Promise<string> {
    const response = await this.httpClient.post<{ message: string }>(
      'aicoach/response',
      { question, history },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.message;
  }
}

export const aiService = new AiService(httpClient);
