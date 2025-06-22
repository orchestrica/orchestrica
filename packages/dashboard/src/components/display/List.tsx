import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function AlignItemsList({ data }: { data: { [key: string]: any, name: string, desc: string, createDate: string }[] }) {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper', overflowY: 'auto', height: '100%', background: 'transparent' }}>
            {data?.map(({ name, desc, createDate }) => {
                return <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ overflowX: 'hidden' }}
                        primary={name}
                        secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: 'text.primary', display: 'inline', wordBreak: 'break-all' }}
                                >
                                    {desc}
                                </Typography>
                                <Typography component={'span'} variant='body2' sx={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'pre-line' }}>{' '}<AccessTimeIcon sx={{ fontSize: '1em', marginRight: '2px' }} />{createDate}</Typography>
                            </>

                        }
                    />
                </ListItem >
            })}
        </List >
    );
}
