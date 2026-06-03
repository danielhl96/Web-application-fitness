// useAiCoach.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAiCoach } from './useAiCoach';
import { MockHttpClient } from '../../shared/clients/MockHttpClient';
import { WorkoutPlanService } from '../../services/workoutPlanService';
import { ProfileService } from '../profile/profileService';
import { MealService } from '../meal/mealService';
import { AiService } from './aiService';

// ── Shared MockHttpClient setup ───────────────────────────────────────────────

function createDeps(overrides?: Partial<MockHttpClient>) {
  const mock = new MockHttpClient();
  mock.mockResponse('/workout_plans', []);
  mock.mockResponse('users/profile', {
    age: 25,
    weight: 75,
    height: 180,
    gender: 'male',
    goal: '1',
    waist: 80,
    hip: 95,
  });
  mock.mockResponse('meals', []);
  mock.mockResponse('aicoach/response', { message: 'AI reply' });

  return {
    workoutPlanService: new WorkoutPlanService(mock),
    profileService: new ProfileService(mock),
    mealService: new MealService(mock),
    aiService: new AiService(mock),
    mock,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

it('should update question on input change', () => {
  const { workoutPlanService, profileService, mealService, aiService } = createDeps();
  const { result } = renderHook(() =>
    useAiCoach({ workoutPlanService, profileService, mealService, aiService })
  );

  act(() => result.current.handleQuestionChange('How many sets?'));

  expect(result.current.question).toBe('How many sets?');
});

it('should start with the initial coach greeting', () => {
  const { workoutPlanService, profileService, mealService, aiService } = createDeps();
  const { result } = renderHook(() =>
    useAiCoach({ workoutPlanService, profileService, mealService, aiService })
  );

  expect(result.current.chatHistory).toHaveLength(1);
  expect(result.current.chatHistory[0].isUser).toBe(false);
});

it('should load workout plans on init', async () => {
  const mock = new MockHttpClient();
  mock.mockResponse('/workout_plans', [
    { id: 1, name: 'Push Day', exercises: [], plan_exercise_templates: [] },
  ]);

  const { result } = renderHook(() =>
    useAiCoach({
      workoutPlanService: new WorkoutPlanService(mock),
      profileService: new ProfileService(mock),
      mealService: new MealService(mock),
      aiService: new AiService(mock),
    })
  );

  await waitFor(() => expect(result.current.workouts).toHaveLength(1));
  expect(result.current.workouts[0].name).toBe('Push Day');
});

it('should add user message and AI reply when sendQuestion is called', async () => {
  const mock = new MockHttpClient();
  mock.mockResponse('/workout_plans', []);
  mock.mockResponse('aicoach/response', { message: 'Do 3 sets of 10.' });

  const { result } = renderHook(() =>
    useAiCoach({
      workoutPlanService: new WorkoutPlanService(mock),
      profileService: new ProfileService(mock),
      mealService: new MealService(mock),
      aiService: new AiService(mock),
    })
  );

  act(() => result.current.handleQuestionChange('How many sets?'));
  act(() => result.current.sendQuestion());

  await waitFor(() => expect(result.current.chatHistory).toHaveLength(3));

  expect(result.current.chatHistory[1]).toEqual({ message: 'How many sets?', isUser: true });
  expect(result.current.chatHistory[2]).toEqual({ message: 'Do 3 sets of 10.', isUser: false });
  expect(result.current.question).toBe('');
});
