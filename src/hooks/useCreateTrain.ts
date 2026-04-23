import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exercise from '../Components/exercises.ts';
import { workoutPlanService, buildCreatePayload } from '../services/workoutPlanService';
import { Exercise, ExerciseTemplate, Notification } from '../types';

export default function useCreateTrain() {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [workoutName, setWorkoutName] = useState<string>('');
  const [workoutNameSet, setWorkoutNameSet] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise[]>([]);
  const [addExercise, setAddExercise] = useState('');
  const [exerciseExists, setExerciseExists] = useState<ExerciseTemplate[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    setExerciseExists(exercise);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveTraining = async (): Promise<void> => {
    try {
      await workoutPlanService.create(buildCreatePayload(workoutName, selectedExercise));
      setNotification({
        title: 'Training Saved',
        message: 'Your training has been saved successfully!',
        type: 'success',
      });
      setSavedSuccessfully(true);
      setWorkoutName('');
      setWorkoutNameSet(false);
      setSelectedExercise([]);
    } catch {
      setNotification({
        title: 'Error',
        message: 'There was an error saving your training.',
        type: 'error',
      });
    }
  };

  const handleExerciseChange = (name: string): void => {
    const found = exercise.find((item) => item.name === name);
    if (!found) return;

    setSelectedExercise((prev) => {
      if (prev.some((item) => item.name === found.name)) {
        setNotification({
          title: 'Exercise Exists',
          message: `${found.name} is already in your workout.`,
          type: 'error',
        });
        return prev;
      }
      setNotification({
        title: 'Exercise Added',
        message: `${found.name} has been added to your workout.`,
        type: 'success',
      });
      setAddExercise('');
      return [
        ...prev,
        {
          ...found,
          sets: 1,
          reps: [8],
          weights: [0],
          date: new Date().toISOString().split('T')[0],
        },
      ];
    });
    setAddExercise('');
  };

  const handleRemoveExercise = (name: string): void => {
    setSelectedExercise((prev) => prev.filter((item) => item.name !== name));
    setNotification({
      title: 'Exercise Removed',
      message: `${name} has been removed from your workout.`,
      type: 'success',
    });
  };

  const handleRepsChange = (exerciseName: string, reps: number): void => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? { ...item, reps: Array.from({ length: item.sets }, () => reps) }
          : item
      )
    );
  };

  const handleSetsChange = (exerciseName: string, sets: number): void => {
    setSelectedExercise((prev) =>
      prev.map((item) =>
        item.name === exerciseName
          ? {
              ...item,
              sets,
              reps: Array.isArray(item.reps)
                ? Array.from({ length: sets }, (_, i) => item.reps[i] || 8)
                : Array(sets).fill(8),
              weights: Array.isArray(item.weights)
                ? Array.from({ length: sets }, (_, i) => item.weights[i] || 0)
                : Array(sets).fill(0),
            }
          : item
      )
    );
  };

  const changePosition = (element: Exercise, direction: 'up' | 'down'): void => {
    const index = selectedExercise.findIndex((ex) => ex.name === element.name);
    if (direction === 'up' && index > 0) {
      const next = [...selectedExercise];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      setSelectedExercise(next);
    } else if (direction === 'down' && index < selectedExercise.length - 1) {
      const next = [...selectedExercise];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      setSelectedExercise(next);
    }
  };

  const confirmWorkoutName = (): void => setWorkoutNameSet((prev) => !prev);

  const goHome = (): void => {
    navigate('/');
  };

  return {
    workoutName,
    setWorkoutName,
    workoutNameSet,
    confirmWorkoutName,
    selectedExercise,
    addExercise,
    setAddExercise,
    exerciseExists,
    notification,
    setNotification,
    savedSuccessfully,
    handleSaveTraining,
    handleExerciseChange,
    handleRemoveExercise,
    handleRepsChange,
    handleSetsChange,
    changePosition,
    goHome,
  };
}
