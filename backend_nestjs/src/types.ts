export type User = {
  id: number;
  email: string;
};

export type JwtPayload = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};

export type BodyMetrics = {
  weight: number;
  hip: number;
  waist: number;
  bpf: number;
  date: string;
};

export type ExerciseTemplate = {
  name?: string;
  plan_id: number;
  exercises: {
    name: string;
    sets: number;
    reps: number[];
    weights: number[];
  }[];
};

export type UserData = {
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  waist?: number;
  hip?: number;
  bpf?: number;
  calories?: number;
  activity_level?: string;
  goal?: string;
  bmi?: number;
};

export type UserHistory = {
  weight: number;
  hip: number;
  waist: number;
  bpf: number;
};

export type WorkoutPlan = {
  id: number;
  name: string;
  user_id: number;
  plan_exercise_templates: {
    id: number;
    name: string;
    sets: number;
    reps_template: number[];
    weights_template: number[];
  }[];
  exercises: {
    id: number;
    name: string;
    date: string;
    sets: number;
    reps: number[];
    weights: number[];
  }[];
};
