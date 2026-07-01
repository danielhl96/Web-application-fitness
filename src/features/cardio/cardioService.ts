import { IHttpClient } from '../../shared/interfaces/IHttpClient';
import { httpClient } from '../../shared/Utils/api';
import { CardioSession } from '../../types';

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'cardio_sessions';

// ── Service ───────────────────────────────────────────────────────────────────

export class CardioService {
  constructor(private httpClient: IHttpClient) {}

  async getCardioWorkouts(date?: string): Promise<CardioSession[]> {
    const url = date ? `/cardio?date=${date}` : '/cardio';
    const response = await this.httpClient.get<CardioSession[]>(url);
    return response.data;
  }

  async createCardioWorkout(workoutData: Omit<CardioSession, 'id'>): Promise<void> {
    this.httpClient.post('/cardio', workoutData);
  }

  async updateCardioWorkout(
    workoutId: number,
    workoutData: Omit<CardioSession, 'id'>
  ): Promise<void> {
    this.httpClient.patch(`/cardio/${workoutId}`, workoutData);
  }

  async deleteCardioWorkout(workoutId: number): Promise<void> {
    this.httpClient.delete(`/cardio/${workoutId}`);
  }
}

export const cardioService = new CardioService(httpClient);
