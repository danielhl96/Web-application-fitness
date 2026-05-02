import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';

type ExerciseEntry = {
  date: string;
  weights: number[];
  reps: number[];
};

class StatisticsService {
  constructor(private httpClient: IHttpClient) {}

  async getStatistics(date: string): Promise<any> {
    const response = await this.httpClient.get('/statistics/exercise_statistics', {
      params: { date },
    });
    return response.data;
  }
}

export const statisticsService = new StatisticsService(httpClient);
