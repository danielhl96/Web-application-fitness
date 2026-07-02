import { IHttpClient } from '../../shared/interfaces/IHttpClient';
import { httpClient } from '../../shared/Utils/api';
import { CardioSession } from '../../types';

// Payload shape matching the backend DTO (camelCase)
export type CardioCreatePayload = {
  date: string;
  durationMin: number;
  distanceKm: number;
  avgBpm: number;
  maxBpm?: number;
  powerW?: number;
  cadenceSpm?: number;
  calories?: number;
  notes?: string;
};

// ── Service ───────────────────────────────────────────────────────────────────

export class CardioService {
  constructor(private httpClient: IHttpClient) {}

  async getCardioWorkouts(date?: string): Promise<CardioSession[]> {
    const url = date ? `/cardio?date=${date}` : '/cardio';
    const response = await this.httpClient.get<CardioSession[]>(url);
    return response.data;
  }

  async createCardioWorkout(workoutData: CardioCreatePayload): Promise<void> {
    await this.httpClient.post('/cardio', workoutData);
  }

  async updateCardioWorkout(workoutId: number, workoutData: CardioCreatePayload): Promise<void> {
    await this.httpClient.patch(`/cardio/${workoutId}`, workoutData);
  }

  async deleteCardioWorkout(workoutId: number): Promise<void> {
    await this.httpClient.delete(`/cardio/${workoutId}`);
  }
}

export const cardioService = new CardioService(httpClient);
