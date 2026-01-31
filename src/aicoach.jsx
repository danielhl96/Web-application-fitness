import TemplatePage from './templatepage';
import Button from './button';
import Input from './input';
import { useEffect, useState, useRef, use } from 'react';
import Header from './Header.jsx';
import api from './api.js';
import TemplateModal from './templatemodal';
function AiCoach() {
  const [question, setQuestion] = useState('');
  const refs = useRef({});
  const [workouts, setWorkouts] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    {
      message: 'Hi, im your fitness coach! How can I assist you today?',
      isUser: false,
      refs: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  function handleMessage(message, isUser) {
    setChatHistory((prev) => [...prev, { message, isUser, refs: null }]);
  }

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
    api.get('/get_profile').then((response) => {
      const profile = response.data;
      handleMessage(
        `I have the following profile data: Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Gender: ${profile.gender} and Waist circumference: ${profile.waist}cm and Hip circumference: ${profile.hip}cm and Fitness goal: ${profile.goal == 3 ? 'Bulk' : profile.goal == 2 ? 'Maintain weight' : profile.goal == 1 ? 'loss weight' : ''}. Please consider this information to analyse.`,
        true
      );
      handleOpenAIResponse(
        `I have the following profile data: Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Gender: ${profile.gender} and Waist circumference: ${profile.waist}cm and Hip circumference: ${profile.hip}cm and Fitness goal: ${profile.goal == 3 ? 'Bulk' : profile.goal == 2 ? 'Maintain weight' : profile.goal == 1 ? 'Loss weight' : ''}. Please consider this information to analyse.`
      );
    });
  }

  function fetchWorkouts() {
    api.get('/get_workout_plans').then((response) => {
      const workoutsData = response.data;
      const newWorkouts = workoutsData.map((workout) => ({
        workouts: workout.exercises,
        name: workout.name,
      }));
      setWorkouts(newWorkouts);
    });
  }

  function fetchLastMeal() {
    const date = new Date().toISOString().split('T')[0];
    //All meal types to fetch
    const mealTypes = ['breakfast', 'launch', 'dinner', 'snacks'];
    const promises = mealTypes.map((type) =>
      api
        .get(`/get_meal_${type}`, { params: { date } })
        .then((response) => ({
          type,
          meals: response.data,
        }))
        .catch(() => {
          setIsLoading(false);
          return { type, meals: [] };
        })
    );

    //Wait for all meal fetches to complete
    Promise.all(promises)
      .then((results) => {
        let allMealsMessage = 'My meals today: ';
        let aiMessage = 'My meals today: ';
        let hasMeals = false;

        results.forEach(({ type, meals }) => {
          if (meals.length > 0) {
            hasMeals = true;
            meals.forEach((meal) => {
              allMealsMessage += `${type}: ${meal.name} (${meal.calories} kcal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fats}g fat). Analyze accordingly. `;
              aiMessage += `${type}: ${meal.name} (${meal.calories} kcal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fats}g fat). Analyze accordingly. `;
            });
          }
        });

        if (!hasMeals) {
          allMealsMessage = 'No meals found for today.';
          aiMessage = 'No meals found for today.';
        }
        // Send user message to chat history (chatbubble) and request AI analysis
        handleMessage(allMealsMessage, true);
        handleOpenAIResponse(aiMessage);
      })
      .catch((error) => {
        handleMessage('Sorry, there was an error fetching your meals.', false);
        setIsLoading(false);
      });
  }

  function openModal() {
    return (
      <TemplateModal>
        <span className="loading loading-bars loading-xl"></span>
      </TemplateModal>
    );
  }

  function handleOpenAIResponse(userMessage) {
    api
      .post(
        '/aicoach',
        { question: userMessage, history: chatHistory },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        const aiMessage = response.data.answer;
        handleMessage(aiMessage, false);
        setIsLoading(false);
      })
      .catch((error) => {
        handleMessage('Sorry, there was an error processing your request.', false);
        setIsLoading(false);
      });
  }

  function createBubble(message, isUser, index, ref) {
    return (
      <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`} key={index} ref={ref}>
        <div
          className={`chat-bubble ${isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'} break-words text-sm`}
        >
          {isUser ? 'User: ' : 'Coach: '}
          {message}
        </div>
      </div>
    );
  }
  //Render the main component consisting of TemplatePage and other reusable components (Inputs, Buttons, Header, Modal)
  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="flex flex-col h-full">
          <div className="divider divider-primary">AI-Coaching</div>
          <div className="flex-grow overflow-y-auto h-[40dvh]">
            {chatHistory.map(({ message, isUser }, index) =>
              createBubble(message, isUser, index, (el) => {
                refs.current[index] = el;
              })
            )}
            {isLoading && openModal()}
          </div>
          <div className="divider divider-primary"></div>
          <div className="flex flex-row justify-center mb-4 gap-1 text-xs overflow-x-auto overflow-y-hidden">
            <select
              className="select text-xs select-primary w-auto max-w-xs shadow-lg border border-blue-400 text-white rounded-xl focus:ring-2 focus:ring-blue-400"
              style={{
                background: 'rgba(30, 41, 59, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                border: '1.5px solid #3b82f6',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onChange={(e) => {
                const selectedWorkout = workouts.find((w) => w.name === e.target.value);
                if (selectedWorkout) {
                  const workoutMessage = `I have the following workout plan: ${selectedWorkout.name} with exercises: ${selectedWorkout.workouts
                    .map(
                      (ex) =>
                        `${ex.name} - Sets: ${ex.sets}, Reps: ${ex.reps}, Weight: ${ex.weights}kg
                        `
                    )
                    .join('; ')}. Please consider this information to analyse.`;
                  handleMessage(workoutMessage, true);
                  handleOpenAIResponse(workoutMessage);
                  setIsLoading(true);
                }
              }}
            >
              <option disabled selected>
                Analyse Workouts
              </option>
              {workouts.map((workout, index) => (
                <option key={index} value={workout.name}>
                  {workout.name}
                </option>
              ))}
            </select>
            <Button
              border="#3b82f6"
              onClick={() => {
                fetchLastMeal();
                setQuestion('');
                setIsLoading(true);
              }}
              w="w-35"
            >
              <img
                alt="Nutrition Icon"
                src="/nutrition-plan.png"
                className="h-6 w-6 object-cover rounded-md"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              Analyse
            </Button>

            <Button
              border="#3b82f6"
              onClick={() => {
                fetchUserProfile();
                setQuestion('');
                setIsLoading(true);
              }}
              w="w-32"
            >
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
              Analyse
            </Button>
          </div>
          <div className="flex flex-row space-x-1 items-center justify-center">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              type="text"
              placeholder="Enter your question..."
            />
            <Button
              disabled={question.length === 0}
              onClick={() => {
                handleMessage(question, true);
                handleOpenAIResponse(question);
                setQuestion('');
                setIsLoading(true);
              }}
              border="#3b82f6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>
        </div>
      </TemplatePage>
    </div>
  );
}

export default AiCoach;
