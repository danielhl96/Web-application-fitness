import { IHttpClient } from '../shared/interfaces/IHttpClient';
import { httpClient } from '../shared/Utils/api';
import { Exercise } from '../types';
import { ChatMessage } from '../features/aicoach/useAiCoach';

export interface WorkoutPlan {
  name: string;
  workouts: Exercise[];
}

class WorkoutService {
  constructor(private httpClient: IHttpClient) {}

  async getAll(): Promise<WorkoutPlan[]> {
    const response = await this.httpClient.get<{ name: string; exercises: Exercise[] }[]>(
      'workout_plans/get_workout_plans'
    );
    return response.data.map((w) => ({ name: w.name, workouts: w.exercises }));
  }

  async getAiResponse(question: string, history: ChatMessage[]): Promise<string> {
    const response = await this.httpClient.post<{ message: string }>(
      'aicoach/response',
      { question, history },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.message;
  }
}

export const workoutService = new WorkoutService(httpClient);
