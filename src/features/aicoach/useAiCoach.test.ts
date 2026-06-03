// useAiCoach.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAiCoach } from './useAiCoach';

it('should add user message to chat history', async () => {
  const { result } = renderHook(() => useAiCoach());
  act(() => result.current.handleQuestionChange({ target: { value: 'How many sets?' } }));
  expect(result.current.question).toBe('How many sets?');
});
