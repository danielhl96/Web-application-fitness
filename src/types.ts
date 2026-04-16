export type WorkoutPlan = {
  name: string;
  id: number;
  plan_exercise_templates: {
    reps_template: number[];
    sets: number;
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

export type NotificationState = {
  title: string;
  message: string;
  type: 'success' | 'error';
} | null;

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
  id: number;
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

export type ProfileForm = {
  bmi: number;
  height: number;
  weight: number;
  hwr: number;
  hip: number;
  waist: number;
  goal: number;
  bfp: number;
  gender: string;
  age: number;
  calories: number;
  activity: string;
  bri: number;
};

export type ProfileFormErrors = {
  height: boolean;
  weight: boolean;
  hip: boolean;
  waist: boolean;
  age: boolean;
  bfp: boolean;
};

export type Action =
  | {
      type:
        | 'SET_SEC'
        | 'SET_MIN'
        | 'SET_ROUNDS'
        | 'SET_COUNT_ROUNDS'
        | 'SET_BREAKTIME'
        | 'SET_STARTTIME'
        | 'SET_ROUNDTIME'
        | 'SET_TOTALTIME';
      payload: number;
    }
  | {
      type: 'SET_IS_BREAK_MODE' | 'SET_IS_START_MODE' | 'SET_IS_STOP_MODE';
      payload: boolean;
    }
  | { type: 'INCREMENT_SEC' };
