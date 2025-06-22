import { useParams } from "react-router";
import { Typography } from "@mui/material";
import AgentTabs from "./AgentTabs";

const getAgent = (id?: string) => {
    if (!id) return { name: '' }
    return {
        name: 'Agent ' + id,
    }
}


export default function AgentPage() {
    const { id } = useParams();
    const { name } = getAgent(id);
    console.log(id)
    return (
        <div>
            <Typography
                variant="body1"
                sx={{ color: '#3b3b3b', }}
            >
                id : {id}
            </Typography>
            <Typography variant="h3" sx={{ marginBottom: '16px' }}>{name}</Typography>
            <AgentTabs />
        </div>
    );
}