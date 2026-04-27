import api from '../Utils/api';

type ExerciseEntry = {
  date: string;
  weights: number[];
  reps: number[];
};

export const statisticsService = {
  getStatistics: (date: string): Promise<any> =>
    api.get('/statistics/exercise_statistics', { params: { date } }).then((res) => res.data),
};
