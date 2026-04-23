import api from '../Utils/api';
import { Meal } from '../types';

const MEAL_TYPES = ['breakfast', 'launch', 'dinner', 'snack'] as const;

export interface MealResult {
  type: string;
  meals: Meal[];
}

export const mealService = {
  getToday: (): Promise<MealResult[]> => {
    const date = new Date().toISOString().split('T')[0];
    const promises = MEAL_TYPES.map((type) =>
      api
        .get<Meal[]>(`meals/get_${type}`, { params: { date } })
        .then((res) => ({ type, meals: res.data }))
        .catch(() => ({ type, meals: [] as Meal[] }))
    );
    return Promise.all(promises);
  },
};
