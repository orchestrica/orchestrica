import { useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { useAgenticaRpc } from "../../../provider/AgenticaRpcProvider";

export function Chat() {
  const { messages, conversate, isConnected, isError, tryConnect } =
    useAgenticaRpc();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasMessage = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const isLastMessageFromUser = lastMessage?.type === "userMessage";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      console.log('content', content);

      await conversate(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-w-0">
      <div className="relative w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <div className="h-full flex flex-col bg-zinc-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/30">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            {hasMessage && <ChatMessages messages={messages} />}
            <ChatStatus
              isError={isError}
              isConnected={isConnected}
              hasMessages={hasMessage}
              onRetryConnect={tryConnect}
              isWsUrlConfigured={import.meta.env.VITE_AGENTICA_WS_URL !== ""}
            />
          </div>

          <div className="p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!isConnected || isError || isLastMessageFromUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
