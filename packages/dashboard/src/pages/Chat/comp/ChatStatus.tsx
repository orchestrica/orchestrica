interface ChatStatusProps {
  isError: boolean;
  isConnected: boolean;
  hasMessages: boolean;
  onRetryConnect: () => void;
  isWsUrlConfigured: boolean;
}

export function ChatStatus({
  isError,
  isConnected,
  hasMessages,
  onRetryConnect,
  isWsUrlConfigured
}: ChatStatusProps) {
  if (!isWsUrlConfigured) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-yellow-400 text-sm">
          VITE_AGENTICA_WS_URL is not configured
        </div>
        <div className="text-gray-400 text-sm">
          Please set the VITE_AGENTICA_WS_URL environment variable
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-red-400 text-sm">
          Failed to connect to Agentica server
        </div>
        <button
          onClick={onRetryConnect}
          className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Connecting to Agentica server...
      </div>
    );
  }

  if (!hasMessages) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Start a conversation by sending a message...
      </div>
    );
  }

  return null;
}
