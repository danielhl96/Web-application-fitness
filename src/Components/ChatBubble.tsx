interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  refCallback: (el: HTMLDivElement | null) => void;
}

function ChatBubble({ message, isUser, refCallback }: ChatBubbleProps) {
  return (
    <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`} ref={refCallback}>
      <div
        className={`chat-bubble ${isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'} break-words text-sm`}
      >
        {isUser ? 'User: ' : 'Coach: '}
        {message}
      </div>
    </div>
  );
}

export default ChatBubble;
