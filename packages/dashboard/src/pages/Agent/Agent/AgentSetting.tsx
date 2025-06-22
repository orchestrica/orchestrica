import React, { useState } from 'react';
import {
    Box,
    Button, FormControlLabel, styled, Switch,
    TextField,
    Typography
} from '@mui/material';

const FormRow = styled('div')({
    margin: '32px 0'
})

export default function AgentSetting() {
    const [agentName, setAgentName] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <FormRow>
                <TextField
                    fullWidth
                    label="agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                />
            </FormRow>
            <FormRow>
                <TextField
                    id="outlined-multiline-static"
                    label="Multiline"
                    multiline
                    rows={4}
                    defaultValue="Default Value"
                    sx={{ width: '100%' }}
                />
            </FormRow>
            <FormRow>
                {/* Notifications Switch */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={notificationsEnabled}
                            onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        />
                    }
                    label="Enable Notifications"
                />
            </FormRow>
            {/* Submit Button */}
            <Button type="submit" variant="contained" fullWidth>
                Save
            </Button>
        </Box >
    );
};