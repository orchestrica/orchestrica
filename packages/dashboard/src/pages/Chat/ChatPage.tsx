import { useParams } from "react-router";
import { AgenticaRpcProvider } from "../../provider/AgenticaRpcProvider";
import ChatHistoryList from "./chatHistory/ChatHistoryList";
import { Chat } from "./comp/Chat";

const defaultAgentId = 'agent_1'
function ChatPage() {
  const { agentId: agentIdQueryParams, historyId } = useParams();
  const agentId = agentIdQueryParams || defaultAgentId;

  return (
    <AgenticaRpcProvider agentId={agentId} historyId={historyId}>
      <div className="relative min-h-screen" style={{ color: 'white' }}>
        {/* Shared Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-900" />
        <div className="fixed inset-0 opacity-[0.07] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="flex flex-row h-full">
          <div className="relative h-full p-8" style={{ width: '300px' }}>
            <div><ChatHistoryList agentId={agentId} /></div>
          </div>
          <Chat />
        </div>
      </div >
    </AgenticaRpcProvider >

  );
}

export default ChatPage;