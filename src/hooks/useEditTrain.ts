import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import exercise from '../Components/exercises.ts';
import api from '../Utils/api';
import { UI_STATE, SelectedExercise, WorkoutPlanMap, WorkoutPlan } from '../types.ts';

export type NotificationState = {
  title: string;
  message: string;
  type: 'success' | 'error';
} | null;

export interface UseEditTrainReturn {
  // ── State ──────────────────────────────────────────────────────────────────
  showState: UI_STATE<WorkoutPlan[]>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showEditWorkoutNameModal: boolean;
  setShowEditWorkoutNameModal: Dispatch<SetStateAction<boolean>>;
  savekey: string;
  setSaveKey: Dispatch<SetStateAction<string>>;
  addExercise: string;
  setAddExercise: Dispatch<SetStateAction<string>>;
  workoutName: string;
  setWorkoutName: Dispatch<SetStateAction<string>>;
  notification: NotificationState;
  setNotification: Dispatch<SetStateAction<NotificationState>>;
  confirmationModalForDelete: boolean;
  setConfirmationModalforWorkoutDelete: Dispatch<SetStateAction<boolean>>;
  selectedExercise: WorkoutPlanMap;
  setSelectedExercise: Dispatch<SetStateAction<WorkoutPlanMap>>;
  // ── Actions ────────────────────────────────────────────────────────────────
  handleEditWorkout: () => void;
  changePosition: (element: SelectedExercise, direction: 'up' | 'down') => void;
  changeWorkoutNameAPI: () => Promise<void>;
  handleShowModal: (workoutName: string) => void;
  handleRemoveWorkoutAPI: (workoutname: string) => void;
  handleAddExercise: (elem: string) => void;
}

export function useEditTrain(): UseEditTrainReturn {
  const [requestId, setRequestId] = useState<number>(0);
  const [showState, setState] = useState<UI_STATE<WorkoutPlan[]>>({ type: 'loading' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditWorkoutNameModal, setShowEditWorkoutNameModal] = useState<boolean>(false);
  const [savekey, setSaveKey] = useState<string>('');
  const [addExercise, setAddExercise] = useState<string>('');
  const [workoutName, setWorkoutName] = useState<string>('');
  const [notification, setNotification] = useState<NotificationState>(null);
  const [confirmationModalForDelete, setConfirmationModalforWorkoutDelete] =
    useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutPlanMap>({});

  // ── Fetch workout plans whenever requestId changes ─────────────────────────
  useEffect(() => {
    api
      .get('/workout_plans/get_workout_plans')
      .then((response: { data: WorkoutPlan[] }) => {
        setState({ type: 'success', data: response.data });
      })
      .catch((error: Error) => {
        setState({ type: 'error', error: error.message });
      });
  }, [requestId]);

  // ── Map API response → { planName: SelectedExercise[] } ───────────────────
  const mapPlans = (plans: WorkoutPlan[]): WorkoutPlanMap =>
    plans.reduce<WorkoutPlanMap>((acc, plan) => {
      acc[plan.name] = plan.plan_exercise_templates.map((ex) => ({
        exercise: ex.name,
        reps: ex.reps_template,
        sets: ex.sets,
        weights: ex.weights_template,
        plan_id: plan.id,
      }));
      return acc;
    }, {});

  // ── Sync selectedExercise whenever backend data changes ───────────────────
  useEffect(() => {
    if (showState.type === 'success' && showState.data.length > 0) {
      setSelectedExercise(mapPlans(showState.data));
    } else {
      setSelectedExercise({});
    }
  }, [showState]);

  // ── Persist edited workout plan to backend ────────────────────────────────
  function handleEditWorkout(): void {
    const payload = {
      plan_id: selectedExercise[savekey][0]?.plan_id ?? null,
      exercises: selectedExercise[savekey]?.map(
        ({ exercise: name, reps, sets, weights, plan_id }) => {
          const setsInt = Array.isArray(sets)
            ? (sets as number[]).length
            : Math.round(Number(sets));
          console.log(selectedExercise[savekey], name, reps, sets, weights);
          return {
            name,
            reps: Array.isArray(reps) ? reps : Array(setsInt).fill(reps),
            sets: setsInt,
            weights: weights ?? Array(setsInt).fill(0),
            plan_id: plan_id ?? null,
          };
        }
      ),
    };

    api
      .put('/workout_plans/edit_workout_plan', payload)
      .then(() => {
        setNotification({
          title: 'Workout Updated',
          message: 'Your workout plan has been updated successfully.',
          type: 'success',
        });
        setRequestId((prev) => prev + 1);
        setShowModal(false);
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error updating your workout plan.',
          type: 'error',
        });
      });
  }

  // ── Move exercise up or down within a workout plan ────────────────────────
  function changePosition(element: SelectedExercise, direction: 'up' | 'down'): void {
    const index = selectedExercise[savekey].findIndex((ex) => ex === element);
    const exercises = [...selectedExercise[savekey]];

    if (direction === 'up' && index > 0) {
      [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
      setSelectedExercise({ ...selectedExercise, [savekey]: exercises });
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
      setSelectedExercise({ ...selectedExercise, [savekey]: exercises });
    }
  }

  // ── Rename a workout plan via API ─────────────────────────────────────────
  async function changeWorkoutNameAPI(): Promise<void> {
    try {
      await api.put('/workout_plans/change_workout_plan_name', {
        planId: selectedExercise[savekey][0]?.plan_id,
        newName: workoutName,
      });
      setNotification({
        title: 'Workout Name Changed',
        message: 'Your workout name has been changed successfully.',
        type: 'success',
      });
      setShowEditWorkoutNameModal(false);
    } catch {
      setNotification({
        title: 'Error',
        message: 'There was an error changing the workout name.',
        type: 'error',
      });
      setShowEditWorkoutNameModal(false);
    }
  }

  // ── Toggle the exercise editor modal for a given workout ──────────────────
  function handleShowModal(name: string): void {
    setShowModal((prev) => !prev);
    setSaveKey(name);
    setRequestId((prev) => prev + 1);
  }

  // ── Remove a workout plan from local state ────────────────────────────────
  const handleRemoveWorkout = (workoutname: string): void => {
    setSelectedExercise((prev) => {
      const updated = { ...prev };
      delete updated[workoutname];
      return updated;
    });
  };

  // ── Delete a workout plan via API, then update local state ────────────────
  const handleRemoveWorkoutAPI = (workoutname: string): void => {
    api
      .delete('workout_plans/delete_workout_plan', {
        data: { planId: selectedExercise[workoutname][0]?.plan_id },
      })
      .then(() => {
        handleRemoveWorkout(workoutname);
        setConfirmationModalforWorkoutDelete(false);
        setNotification({
          title: 'Workout Deleted',
          message: 'Workout plan has been deleted.',
          type: 'success',
        });
      })
      .catch(() => {
        setNotification({
          title: 'Error',
          message: 'There was an error deleting the workout plan.',
          type: 'error',
        });
      });
  };

  // ── Add a new exercise to the currently open workout ──────────────────────
  const handleAddExercise = (elem: string): void => {
    if (exercise.some((ex) => ex.name === elem)) {
      const newExercise: SelectedExercise = {
        exercise: elem,
        reps: 1,
        sets: 1,
        weights: [],
        plan_id: selectedExercise[savekey][0]?.plan_id ?? null,
      };
      setSelectedExercise((prev) => ({
        ...prev,
        [savekey]: [...prev[savekey], newExercise],
      }));
      setAddExercise('');
      setNotification({
        title: 'Exercise Added',
        message: `${elem} has been added to your workout.`,
        type: 'success',
      });
    }
  };

  return {
    showState,
    showModal,
    setShowModal,
    showEditWorkoutNameModal,
    setShowEditWorkoutNameModal,
    savekey,
    setSaveKey,
    addExercise,
    setAddExercise,
    workoutName,
    setWorkoutName,
    notification,
    setNotification,
    confirmationModalForDelete,
    setConfirmationModalforWorkoutDelete,
    selectedExercise,
    setSelectedExercise,
    handleEditWorkout,
    changePosition,
    changeWorkoutNameAPI,
    handleShowModal,
    handleRemoveWorkoutAPI,
    handleAddExercise,
  };
}
