import DashboardIcon from '@mui/icons-material/Dashboard';
import { createTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { type Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';


import { ReactNode } from 'react';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: '',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'agent',
        title: 'Agent',
        icon: <ShoppingCartIcon />,
        pattern: '/agent'
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
];

const BRANDING = {
    title: 'Orchestrica',
};



const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default function ToolpadAppProvider({ children }: { children: ReactNode }) {
    return (
        <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={demoTheme}>
            {children}
        </ReactRouterAppProvider >
    );
}