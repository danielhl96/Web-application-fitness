import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';
import { WorkoutPlan } from '../types';

class TrainingService {
  constructor(private httpClient: IHttpClient) {}
}

export const trainingService = new TrainingService(httpClient);
