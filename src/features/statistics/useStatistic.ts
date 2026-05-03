import { UI_STATE } from '../../types.js';
import { useEffect, useState } from 'react';
import { statisticsService } from './statisticsService.js';
import { ExerciseData, ExerciseEntry } from '../../types.js';
import { workoutPlanService } from '../../services/workoutPlanService.js';

import { Notification } from '../../types.js';

export function useStatistic() {
  const [showOverview, setShowOverview] = useState<boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [statistics, setStatistics] = useState<UI_STATE<Record<string, any>>>({ type: 'loading' });
  const [notification, setNotification] = useState<Notification | null>(null);

  const loadStatistics = () => {
    statisticsService
      .getStatistics(new Date().toISOString().split('T')[0])
      .then((response: Record<string, ExerciseEntry[]>) => {
        console.log(response);
        const transformed = Object.entries(response).map(([exercise_name, entries]) => ({
          exercise_name,
          entries,
          date: entries.map((e) => new Date(e.date).toLocaleDateString()),
          max_weight: Math.max(...entries.flatMap((e) => e.weights)),
          min_weight: Math.min(...entries.flatMap((e) => e.weights)),
          id: entries[0].id,
        }));

        setStatistics({ type: 'success', data: transformed });
      });
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  async function deleteExerciseEntry(exerciseId: number): Promise<void> {
    try {
      await workoutPlanService.deleteExercise(exerciseId);
      loadStatistics();
      setShowOverview(true);
      setSelectedExercise(null);
      setNotification({
        title: 'Entry Deleted',
        message: 'The exercise entry has been deleted successfully.',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        title: 'Deletion Failed',
        message: 'An error occurred while trying to delete the exercise entry.',
        type: 'error',
      });
    }
  }

  function calculateProgress(item: ExerciseData): number {
    let progress = 0;
    if (item.entries && item.entries.length >= 2) {
      const first = item.entries[0];
      const last = item.entries[item.entries.length - 1];
      const firstWeight =
        first.weights && first.weights.length > 0 ? first.weights.reduce((a, b) => a + b, 0) : 0;
      const lastWeight =
        last.weights && last.weights.length > 0 ? last.weights.reduce((a, b) => a + b, 0) : 0;

      const firstReps =
        first.reps && first.reps.length > 0 ? first.reps.reduce((a, b) => a + b, 0) : 0;
      const lastReps = last.reps && last.reps.length > 0 ? last.reps.reduce((a, b) => a + b, 0) : 0;
      if (firstWeight === 0 && lastWeight === 0) {
        return firstReps > 0 ? ((lastReps - firstReps) / firstReps) * 100 : 0;
      }
      if (firstWeight > 0 && firstReps > 0) {
        progress =
          ((lastWeight * lastReps - firstWeight * firstReps) / (firstWeight * firstReps)) * 100;
      }
    }
    return progress;
  }

  return {
    showOverview,
    setShowOverview,
    selectedExercise,
    setSelectedExercise,
    statistics,
    calculateProgress,
    deleteExerciseEntry,
    notification,
    setNotification,
  };
}
