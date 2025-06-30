import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { markdownComponents } from "./MarkdownComponents";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "bg-white text-zinc-900" : "bg-zinc-700/50 text-gray-100"
          }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap break-all">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!bg-transparent">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
