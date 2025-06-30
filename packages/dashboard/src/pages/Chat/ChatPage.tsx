import { AgenticaRpcProvider } from "../../provider/AgenticaRpcProvider";
import { Chat } from "./comp/Chat";

function ChatPage() {
  return (
    <AgenticaRpcProvider>
      <div className="relative min-h-screen">
        {/* Shared Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-900" />
        <div className="fixed inset-0 opacity-[0.07] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
        <Chat />
      </div>
    </AgenticaRpcProvider>

  );
}

export default ChatPage;