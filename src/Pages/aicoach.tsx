import TemplatePage from '../Components/templatepage.js';
import Button from '../Components/button.js';
import Input from '../Components/input.js';
import Header from '../Components/Header.js';
import TemplateModal from '../Components/templatemodal.js';
import ChatBubble from '../Components/ChatBubble';
import { useAiCoach } from '../hooks/useAiCoach';

function AiCoach() {
  const {
    question,
    refs,
    workouts,
    chatHistory,
    isLoading,
    handleQuestionChange,
    analyseActions,
    sendQuestion,
    handleWorkoutSelect,
  } = useAiCoach();

  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="flex flex-col h-full">
          <div className="divider divider-primary">AI-Coaching</div>

          {/* Chat history */}
          <div className="flex-grow overflow-y-auto h-[40dvh]">
            {chatHistory.map(({ message, isUser }, index) => (
              <ChatBubble
                key={index}
                message={message}
                isUser={isUser}
                refCallback={(el) => {
                  refs.current[index] = el;
                }}
              />
            ))}
            {isLoading && (
              <TemplateModal>
                <span className="loading loading-bars loading-xl" />
              </TemplateModal>
            )}
          </div>

          <div className="divider divider-primary"></div>

          {/* Analyse actions row */}
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
              onChange={(e) => handleWorkoutSelect(e.target.value)}
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

            {analyseActions.map((action, i) => (
              <Button key={i} border="#3b82f6" onClick={action.onTrigger} w={action.w}>
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>

          {/* Question input */}
          <div className="flex flex-row space-x-1 items-center justify-center">
            <Input
              value={question}
              onChange={handleQuestionChange}
              placeholder="Enter your question..."
            />
            <Button disabled={question.length === 0} onClick={sendQuestion} border="#3b82f6">
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
