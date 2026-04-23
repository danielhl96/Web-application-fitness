import api from '../Utils/api';
import { Exercise } from '../types';
import { ChatMessage } from '../hooks/useAiCoach';

export interface WorkoutPlan {
  name: string;
  workouts: Exercise[];
}

export const workoutService = {
  getAll: (): Promise<WorkoutPlan[]> =>
    api
      .get<{ name: string; exercises: Exercise[] }[]>('workout_plans/get_workout_plans')
      .then((res) => res.data.map((w) => ({ name: w.name, workouts: w.exercises }))),

  getAiResponse: (question: string, history: ChatMessage[]): Promise<string> =>
    api
      .post<{
        message: string;
      }>('aicoach/response', { question, history }, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => res.data.message),
};
