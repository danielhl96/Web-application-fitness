import { Meal, UI_STATE } from '../types';

type ProfileState = UI_STATE<{ calories: number; weight: number }>;

// ── Meal totals ───────────────────────────────────────────────────────────────

function sumField(meals: Meal[], field: keyof Meal): number {
  return meals.reduce((acc, m) => acc + (m[field] as number), 0);
}

export function calcCalories(meals: Meal[]): number {
  return meals.reduce((acc, m) => acc + m.calories, 0);
}

export function calcProteins(meals: Meal[]): number {
  return sumField(meals, 'protein');
}

export function calcCarbs(meals: Meal[]): number {
  return sumField(meals, 'carbs');
}

export function calcFats(meals: Meal[]): number {
  return sumField(meals, 'fats');
}

// ── Macro goals (based on body weight and TDEE) ───────────────────────────────

export function calcProteinsGoal(profile: ProfileState): number {
  return profile.type === 'success' ? profile.data.weight * 2.0 : 0;
}

export function calcFatsGoal(profile: ProfileState): number {
  return profile.type === 'success' ? profile.data.weight * 1.0 : 0;
}

export function calcCarbsGoal(profile: ProfileState): number {
  if (profile.type !== 'success') return 0;
  const { calories, weight } = profile.data;
  const proteinKcal = weight * 2.0 * 4;
  const fatKcal = weight * 1.0 * 9;
  return (calories - (proteinKcal + fatKcal)) / 4;
}
