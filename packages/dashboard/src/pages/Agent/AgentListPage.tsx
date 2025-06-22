import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, styled, TextField } from "@mui/material";
import AgentCard from "../../components/AgentCard/AgentCard";
import { Link } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

const agents = new Array(3).fill({}).map((_, index) => ({ name: `Agent_${index}`, updateDate: new Date().toString(), id: index, totalTraces: index * 10, totalTokens: index * 150, latencyP50: 1000 * 0.2 }))
const AgentList = styled('ul')({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
    gap: 16,
    marginTop: 16
})

const ToolBox = styled('div')({
    display: 'flex',
    alignItems: 'stretch',
})

const SORTING_OPTIONS = [{ label: 'Name', value: 'name' }, { label: 'Last Updated', vale: 'update' }, { label: 'Created Date', value: 'createDate' }]
export default function AgentListPage() {
    const [sorting, setSorting] = useState(SORTING_OPTIONS[1].value);

    const handleChange = (event: SelectChangeEvent) => {
        setSorting(event.target.value as string);
    };
    return (
        <div>
            <ToolBox>
                <TextField
                    fullWidth
                    label="agent name"
                >
                </TextField>
                <FormControl sx={{ maxWidth: '200px', width: '100%' }}>
                    <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                    <Select
                        value={sorting}
                        label="Age"
                        onChange={handleChange}
                    >
                        {SORTING_OPTIONS.map(d => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button variant="contained" endIcon={<AddIcon />} >Create</Button>
            </ToolBox>
            <AgentList>{agents.map((d) => <Link key={d.id} to={`/agent/${d.id}`}><AgentCard {...d} /></Link>)}</AgentList>
        </div>
    );
}