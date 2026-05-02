import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';
import { Meal } from '../types';

const MEAL_TYPES = ['breakfast', 'launch', 'dinner', 'snack'] as const;

export interface MealResult {
  type: string;
  meals: Meal[];
}

export interface CreateMealPayload {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealtype: string;
  date: string;
}

export interface EditMealPayload {
  mealId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

class MealService {
  constructor(private httpClient: IHttpClient) {}

  async getToday(): Promise<MealResult[]> {
    const date = new Date().toISOString().split('T')[0];
    const promises = MEAL_TYPES.map(async (type) => {
      try {
        const response = await this.httpClient.get<Meal[]>(`meals/get_${type}`, {
          params: { date },
        });
        return { type, meals: response.data };
      } catch {
        return { type, meals: [] as Meal[] };
      }
    });
    return Promise.all(promises);
  }

  async getMealsByDate(date: string): Promise<MealResult[]> {
    const promises = MEAL_TYPES.map(async (type) => {
      try {
        const response = await this.httpClient.get<Meal[]>(`meals/get_${type}`, {
          params: { date },
        });
        return { type, meals: response.data };
      } catch {
        return { type, meals: [] as Meal[] };
      }
    });
    return Promise.all(promises);
  }

  async getMealsByTypAndDate(type: string, date: string): Promise<Meal[]> {
    const response = await this.httpClient.get<Meal[]>(`meals/get_${type}`, { params: { date } });
    return response.data;
  }

  async deleteMeal(mealId: number, setMessage: (message: string) => void): Promise<void> {
    const response = await this.httpClient.delete('meals/delete_meal', { params: { mealId } });
    setMessage(response.data.message);
  }

  async create(payload: CreateMealPayload): Promise<void> {
    await this.httpClient.post('meals/create_meal', payload);
  }

  async edit(payload: EditMealPayload): Promise<void> {
    await this.httpClient.put('meals/edit_meal', payload);
  }

  async analyzeText(text: string): Promise<Meal> {
    const response = await this.httpClient.post<Meal>('meals/analyze_food_text', { text });
    return response.data;
  }

  async analyzeImage(image: File, mealType: string, prompt?: string): Promise<Meal> {
    const formData = new FormData();
    formData.append('meal_type', mealType);
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);
    const response = await this.httpClient.post<Meal>('meals/calculate_meal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const mealService = new MealService(httpClient);
