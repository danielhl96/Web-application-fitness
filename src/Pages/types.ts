export type WorkoutPlan = {
  name: string;
  id: number;
  plan_exercise_templates: {
    reps_template: number[];
    sets: number[];
    weights_template: number[];
    name: string;
  }[];
};

export type SelectedExercise = {
  exercise: string;
  plan_id: number | null;
  sets: number;
  reps: number | number[];
  weights?: number[];
};

export type WorkoutPlanMap = Record<string, SelectedExercise[]>;

export type User = {
  age: number;
  weight: number;
  height: number;
  gender: string;
  waist: number;
  hip: number;
  goal: number;
  calories: number;
  activity_level: string;
  bmi: number;
  bfp: number;
};

export type UserHistory = {
  date: string;
  weight: number;
  waist: number;
  hip: number;
  bfp: number;
};

export type UI_STATE<T> =
  | {
      type: 'loading';
    }
  | {
      type: 'error';
      error: string;
    }
  | {
      type: 'success';
      data: T;
    };
export type Meal = {
  name: string;
  calories: number;
  type: string;
  protein: number;
  carbs: number;
  fats: number;
};

type ApiResponse<T> = { status: 'success'; data: T } | { status: 'error'; message: string };

export type ExerciseTemplate = {
  name: string;
  description: string;
  img: string;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: number[];
  weights: number[];
  description: string;
  img: string;
};

export type Notification = {
  title: string;
  message: string;
  type: 'success' | 'error';
};
