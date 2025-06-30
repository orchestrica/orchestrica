import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-white mb-4 break-all">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-white mb-3 break-all">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-white mb-2 break-all">{children}</h3>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="text-sm text-gray-100 mb-4 last:mb-0 break-all">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-white break-all">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-300 break-all">{children}</em>
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 transition-colors underline break-all"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-zinc-800/50 px-1.5 py-0.5 rounded text-gray-100 text-sm break-all whitespace-pre-wrap">
          {children}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "plaintext";

    return (
      <div className="relative group rounded-lg overflow-hidden bg-zinc-800/50 my-4 break-all">
        <div className="absolute top-0 right-0 px-4 py-2 text-xs text-gray-400 uppercase bg-zinc-800/80 rounded-bl-lg">
          {language}
        </div>
        <pre className="!mt-0 !mb-0 overflow-x-auto p-4 break-all">
          <code {...props} className={`whitespace-pre-wrap ${className}`}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  ul: ({ children, ...props }) => (
    <ul {...props} className="list-none space-y-1 mb-4 last:mb-0 break-all">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="list-decimal list-inside space-y-1 mb-4 last:mb-0 break-all"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="text-sm text-gray-100 flex items-start break-all">
      <span className=" mr-2">•</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="border-l-2 border-blue-400 pl-4 italic text-gray-300 mb-4 last:mb-0 break-all"
    >
      {children}
    </blockquote>
  ),
};
