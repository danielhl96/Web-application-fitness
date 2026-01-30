import TemplatePage from './templatepage';
import Button from './button';
import Input from './input';
import { useState } from 'react';
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
        { question: userMessage },
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

  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="flex flex-col h-full">
          <div className="divider divider-primary">AI-Coaching</div>
          <div className="flex-grow overflow-y-auto">
            {chatHistory.map(({ message, isUser }, index) => createBubble(message, isUser, index))}
            {isLoading && openModal()}
          </div>
          <div className="divider divider-primary"></div>
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
                className="h-6 w-6"
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
