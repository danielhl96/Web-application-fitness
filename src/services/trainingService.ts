import { IHttpClient } from '../shared/interfaces/IHttpClient';
import { httpClient } from '../shared/Utils/api';
import { WorkoutPlan } from '../types';

class TrainingService {
  constructor(private httpClient: IHttpClient) {}
}

export const trainingService = new TrainingService(httpClient);
