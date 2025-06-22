import { Grid } from "@mui/material";
import UsageWidget from "../../components/widgets/Usage/Usage";
import Widget from "../../components/widgets/Widget";
import { AreaChart } from "../../components/chart/AreaChart";
import AlignItemsList from "../../components/display/List";
import StickyHeadTable from "../../components/display/Table";
import { BarChart } from "../../components/chart/BarChart";


export default function HomePage() {
  return <div>
    <Grid container spacing={3} >
      <Grid size={6}>
        <Widget title='widget 1' >
          <StickyHeadTable />
        </Widget>
      </Grid>
      <Grid size={6}>
        <Widget title='widget 2' >
          <BarChart />
        </Widget>
      </Grid>
      <Grid size={8}>
        <Widget title='widget 6'>
          <AreaChart />
        </Widget>
      </Grid>
      <Grid size={4} >
        <Widget title='widget 7'>
          <AlignItemsList data={[{ name: 'Agent1', desc: 'agent description', createDate: '2025-6-22' }, { name: 'Agent2', desc: 'agent descriptiondescription description description', createDate: '2025-6-22' }, { name: 'Agent3', desc: 'agent description descriptiondescription ', createDate: '2025-6-22' },
          { name: 'Agent4', desc: 'agent description descriptiondescription ', createDate: '2025-6-22' }
          ]} />
        </Widget>
      </Grid>
      <Grid size={4}>
        <UsageWidget />
      </Grid>
      <Grid size={4}>
        <Widget title='widget 4' />
      </Grid>
      <Grid size={4} >
        <Widget title='widget 5' />
      </Grid>
    </Grid >
  </div >;
}