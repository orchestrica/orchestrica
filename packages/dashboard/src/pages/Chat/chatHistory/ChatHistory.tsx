
interface ChatHistoryProps {
  title: string;
  id: string;
  date: string;
}
function ChatHistory({ title }: ChatHistoryProps) {
  return (
    <div className="p-4 text-left truncate">
      {title}
    </div>

  );
}

export default ChatHistory;