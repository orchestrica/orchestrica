import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { timeAgo } from "../../functions/date";

interface AgentCardProps {
    name: string;
    updateDate: string;
    totalTraces: number;
    totalTokens: number;
    latencyP50: number;
}


const StyledCard = styled('div')(({ theme }) => ({
    border: '1px solid black',
    borderRadius: 16,
    padding: theme.spacing(2),
    transition: 'transform 0.2s ease',
    ":hover": {
        transform: 'scale(1.02)'
    }
}));

const Head = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const GroupWrap = styled('div')({
    display: 'flex',
    gap: 8,
    marginTop: '8px'
})

const Group = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
})


export default function AgentCard({ name, updateDate, totalTraces, totalTokens, latencyP50 }: AgentCardProps) {
    return (<StyledCard>
        <Head>
            <div>
                <Typography variant={'subtitle1'} fontWeight={700}>{name}</Typography>
                <Typography variant={'body2'}>{timeAgo(updateDate)}</Typography>
            </div>
        </Head>
        <GroupWrap>
            <Group>
                <Typography variant={'subtitle2'}>Total Traces</Typography>
                <Typography variant={'body2'} fontWeight={700} >{totalTraces}</Typography>
            </Group>
            <Group>
                <Typography variant={'subtitle2'}>Total Tokens</Typography>
                <Typography variant={'body2'} fontWeight={700} >{totalTokens}</Typography>
            </Group>
            <Group>
                <Typography variant={'subtitle2'}>Latency P50</Typography>
                <Typography variant={'body2'} fontWeight={700} >{latencyP50}</Typography>
            </Group>
        </GroupWrap>
    </StyledCard >);
};