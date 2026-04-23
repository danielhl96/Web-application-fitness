import api from '../Utils/api';
import { WorkoutPlan, SelectedExercise } from '../types';

export interface EditWorkoutPayload {
  plan_id: number | null;
  exercises: {
    name: string;
    reps: number[];
    sets: number;
    weights: number[];
    plan_id: number | null;
  }[];
}

export const workoutPlanService = {
  getAll: (): Promise<WorkoutPlan[]> =>
    api.get<WorkoutPlan[]>('/workout_plans/get_workout_plans').then((res) => res.data),

  edit: (payload: EditWorkoutPayload): Promise<void> =>
    api.put('/workout_plans/edit_workout_plan', payload),

  rename: (planId: number | null, newName: string): Promise<void> =>
    api.put('/workout_plans/change_workout_plan_name', { planId, newName }),

  delete: (planId: number | null): Promise<void> =>
    api.delete('workout_plans/delete_workout_plan', { data: { planId } }),
};

/** Maps raw API response to { planName: SelectedExercise[] } */
export function mapPlansToExercises(plans: WorkoutPlan[]): Record<string, SelectedExercise[]> {
  return plans.reduce<Record<string, SelectedExercise[]>>((acc, plan) => {
    acc[plan.name] = plan.plan_exercise_templates.map((ex) => ({
      exercise: ex.name,
      reps: ex.reps_template,
      sets: ex.sets,
      weights: ex.weights_template,
      plan_id: plan.id,
    }));
    return acc;
  }, {});
}

/**
 * Transforms SelectedExercise[] into the payload shape expected by the edit endpoint.
 * Pure function — no React, independently testable.
 */
export function buildEditPayload(exercises: SelectedExercise[]): EditWorkoutPayload {
  return {
    plan_id: exercises[0]?.plan_id ?? null,
    exercises: exercises.map(({ exercise: name, reps, sets, weights, plan_id }) => {
      const setsInt = Array.isArray(sets) ? (sets as number[]).length : Math.round(Number(sets));
      return {
        name,
        reps: Array.isArray(reps) ? (reps as number[]) : Array(setsInt).fill(reps),
        sets: setsInt,
        weights: (weights as number[] | null) ?? Array(setsInt).fill(0),
        plan_id: plan_id ?? null,
      };
    }),
  };
}
