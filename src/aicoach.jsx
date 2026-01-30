import TemplatePage from './templatepage';
import Button from './button';
import Input from './input';
import { useEffect, useState } from 'react';
import Header from './Header.jsx';
import api from './api.js';
import TemplateModal from './templatemodal';
function AiCoach() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { message: 'Hi, how can I help you?', isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  function handleMessage(message, isUser) {
    setChatHistory((prev) => [...prev, { message, isUser }]);
  }

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

  function fetchLastMeal() {
    const date = new Date().toISOString().split('T')[0];
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
        console.error('Error fetching meals:', error);
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
        console.error('Error fetching AI response:', error);
        handleMessage('Sorry, there was an error processing your request.', false);
        setIsLoading(false);
      });
  }

  function createBubble(message, isUser, index) {
    return (
      <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`} key={index}>
        <div
          className={`chat-bubble ${isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'} break-words`}
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
            {chatHistory.map(({ message, isUser }, index) => createBubble(message, isUser, index))}
            {isLoading && openModal()}
          </div>
          <div className="divider divider-primary"></div>
          <div className="flex flex-row justify-center mb-4 gap-1 text-xs overflow-x-auto overflow-y-hidden">
            <Button
              border="#3b82f6"
              onClick={() => {
                fetchLastMeal();
                setQuestion('');
                setIsLoading(true);
              }}
              w="w-35"
            >
              Analyse today's meals
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
              Bodymeasurement
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
                className="h-6 w-3"
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
