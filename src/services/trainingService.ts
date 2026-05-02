import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';
import { WorkoutPlan } from '../types';

class TrainingService {
  constructor(private httpClient: IHttpClient) {}

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await this.httpClient.get<WorkoutPlan[]>('workout_plans/get_workout_plans');
    return response.data;
  }

  async saveExercise(data: {
    workout_plan_id: number | null;
    name: string;
    sets: number;
    reps: number[];
    weights: number[];
  }): Promise<void> {
    await this.httpClient.post('workout_plans/create_exercise', data);
  }
}

export const trainingService = new TrainingService(httpClient);
