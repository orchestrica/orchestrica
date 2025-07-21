import { useNavigate } from "react-router";
import { useFetch } from "../../../hooks/useFetch";
import ChatHistory from "./ChatHistory";

function ChatHistoryList({ agentId }: { agentId: string }) {
  const { data: histories } = useFetch<any[]>(agentId ? `/getHistories?agentId=${agentId}` : '');
  const navigate = useNavigate();
  const handleClick = (id: number) => {
    navigate(`/chat/${agentId}/${id}`)
  }
  return (
    <div>
      <label>History</label>
      <ul>
        {histories?.map(d =>
          <button key={d.id} onClick={() => handleClick(d.id)} className="hover:bg-gray-950 w-full rounded-xl overflow-hidden cursor-pointer">
            <ChatHistory {...d} />
          </button>)}
      </ul>
    </div>
  );
}

export default ChatHistoryList;