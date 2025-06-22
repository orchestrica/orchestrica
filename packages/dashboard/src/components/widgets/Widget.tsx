import { ReactNode } from "react";
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";

interface WidgetProps {
    children?: ReactNode
    title?: string;
}

const Wrapper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.primary,
    borderRadius: 16,
    height: 400,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    overflow: 'auto',
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const Title = styled('h3')(({ theme }) => ({
    ...theme.typography.h5,
    width: '100%',
    textAlign: 'left',
    marginBottom: '8px',
    ["::first-letter"]: {
        textTransform: 'uppercase'
    }
}));
export default function Widget({ title, children,  }: WidgetProps) {
    return (
        <Wrapper>
            {!!title && <Title>{title}</Title>}
            {children}
        </Wrapper>
    )
}