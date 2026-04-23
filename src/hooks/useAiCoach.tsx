import { useEffect, useState, useRef, JSX } from 'react';
import { profileService } from '../services/profileService';
import { mealService } from '../services/mealService';
import { workoutService, WorkoutPlan } from '../services/workoutService';
import { User } from '../types';

export interface ChatMessage {
  message: string;
  isUser: boolean;
}

export interface AnalyseAction {
  label: string;
  icon: JSX.Element;
  w?: string;
  onTrigger: () => void;
}

export function useAiCoach() {
  const [question, setQuestion] = useState<string>('');
  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      message: 'Hi, im your fitness coach! How can I assist you today?',
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleMessage(message: string, isUser: boolean) {
    setChatHistory((prev) => [...prev, { message, isUser }]);
  }

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
  };

  useEffect(() => {
    const ref = refs.current[chatHistory.length - 1];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [chatHistory]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  function fetchUserProfile() {
    profileService
      .get()
      .then((profile: User) => {
        const goalLabel =
          profile.goal === 3
            ? 'Bulk'
            : profile.goal === 2
              ? 'Maintain weight'
              : profile.goal === 1
                ? 'Loss weight'
                : '';
        const profileMsg = `I have the following profile data: Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Gender: ${profile.gender} and Waist circumference: ${profile.waist}cm and Hip circumference: ${profile.hip}cm and Fitness goal: ${goalLabel}. Please consider this information to analyse.`;
        handleMessage(profileMsg, true);
        handleOpenAIResponse(profileMsg);
      })
      .catch((_error: unknown) => {
        handleMessage('Sorry, there was an error fetching your profile.', false);
        setIsLoading(false);
      });
  }

  function fetchWorkouts() {
    workoutService.getAll().then(setWorkouts);
  }

  function fetchLastMeal() {
    mealService
      .getToday()
      .then((results) => {
        let message = 'My meals today: ';
        let hasMeals = false;

        results.forEach(({ type, meals }) => {
          if (meals.length > 0) {
            hasMeals = true;
            meals.forEach((meal) => {
              message += `${type}: ${meal.name} (${meal.calories} kcal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fats}g fat). Analyze accordingly. `;
            });
          }
        });

        if (!hasMeals) message = 'No meals found for today.';

        handleMessage(message, true);
        handleOpenAIResponse(message);
      })
      .catch((_error: unknown) => {
        handleMessage('Sorry, there was an error fetching your meals.', false);
        setIsLoading(false);
      });
  }

  function handleOpenAIResponse(userMessage: string): void {
    workoutService
      .getAiResponse(userMessage, chatHistory)
      .then((aiMessage: string) => {
        handleMessage(aiMessage, false);
        setIsLoading(false);
      })
      .catch((_error: unknown) => {
        handleMessage('Sorry, there was an error processing your request.', false);
        setIsLoading(false);
      });
  }

  // To add a new action, add an entry here — no changes to the JSX needed (OCP).
  const analyseActions: AnalyseAction[] = [
    {
      label: 'Analyse',
      w: 'w-35',
      icon: (
        <img
          alt="Nutrition Icon"
          src="/nutrition-plan.png"
          className="h-6 w-6 object-cover rounded-md"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      ),
      onTrigger: () => {
        fetchLastMeal();
        setQuestion('');
        setIsLoading(true);
      },
    },
    {
      label: 'Analyse',
      w: 'w-32',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onTrigger: () => {
        fetchUserProfile();
        setQuestion('');
        setIsLoading(true);
      },
    },
  ];

  function sendQuestion() {
    handleMessage(question, true);
    handleOpenAIResponse(question);
    setQuestion('');
    setIsLoading(true);
  }

  function handleWorkoutSelect(workoutName: string) {
    const selectedWorkout = workouts.find((w) => w.name === workoutName);
    if (selectedWorkout) {
      const workoutMessage = `I have the following workout plan: ${selectedWorkout.name} with exercises: ${selectedWorkout.workouts
        .map((ex) => `${ex.name} - Sets: ${ex.sets}, Reps: ${ex.reps}, Weight: ${ex.weights}kg`)
        .join('; ')}. Please consider this information to analyse.`;
      handleMessage(workoutMessage, true);
      handleOpenAIResponse(workoutMessage);
      setIsLoading(true);
    }
  }

  return {
    question,
    refs,
    workouts,
    chatHistory,
    isLoading,
    handleQuestionChange,
    analyseActions,
    sendQuestion,
    handleWorkoutSelect,
  };
}
