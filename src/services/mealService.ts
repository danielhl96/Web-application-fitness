import api from '../Utils/api';
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

  getMealsByDate: (date: string): Promise<MealResult[]> => {
    const promises = MEAL_TYPES.map((type) =>
      api
        .get<Meal[]>(`meals/get_${type}`, { params: { date } })
        .then((res) => ({ type, meals: res.data }))
        .catch(() => ({ type, meals: [] as Meal[] }))
    );
    return Promise.all(promises);
  },

  getMealsByTypAndDate: (type: string, date: string): Promise<Meal[]> =>
    api.get<Meal[]>(`meals/get_${type}`, { params: { date } }).then((res) => res.data),

  deleteMeal: (mealId: number, setMessage: (message: string) => void): Promise<void> =>
    api.delete('meals/delete_meal', { data: { mealId } }).then((res) => {
      setMessage(res.data.message);
    }),

  create: (payload: CreateMealPayload): Promise<void> =>
    api.post('meals/create_meal', payload).then(() => {}),

  edit: (payload: EditMealPayload): Promise<void> =>
    api.put('meals/edit_meal', payload).then(() => {}),

  analyzeText: (text: string): Promise<Meal> =>
    api.post<Meal>('meals/analyze_food_text', { text }).then((res) => res.data),

  analyzeImage: (image: File, mealType: string, prompt?: string): Promise<Meal> => {
    const formData = new FormData();
    formData.append('meal_type', mealType);
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);
    return api
      .post<Meal>('meals/calculate_meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
