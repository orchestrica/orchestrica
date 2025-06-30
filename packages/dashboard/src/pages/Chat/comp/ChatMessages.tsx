import { IAgenticaEventJson } from "@agentica/core";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
  messages: IAgenticaEventJson[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <>
      {messages.map((message, externalIndex) => (
        (() => {
          if (message.type === "userMessage") {
            return message.contents.map((content, internalIndex) => (
              <ChatMessage
                key={`${externalIndex}-${internalIndex}`}
                message={{
                  id: `${externalIndex}-${internalIndex}`,
                  role: "user",
                  content: "text" in content ? content.text : ""
                }}
              />
            ))
          }

          if (message.type === "assistantMessage") {
            return <ChatMessage
              key={`${externalIndex}`}
              message={{
                id: `${externalIndex}`,
                role: "assistant",
                content: message.text
              }}
            />;
          }

          if (message.type === "describe") {
            return <ChatMessage
              key={`${externalIndex}`}
              message={{
                id: `${externalIndex}`,
                role: "assistant",
                content: message.text
              }}
            />;
          }
          return;
        })()
      ))}
    </>
  );
}
