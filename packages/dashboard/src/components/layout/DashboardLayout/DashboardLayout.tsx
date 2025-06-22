import { Outlet } from 'react-router';
import { PageContainer } from '@toolpad/core';
import { DashboardLayout as ToolpadDashboardLayout } from '@toolpad/core/DashboardLayout';

export default function DashboardLayout() {


    return (
        <ToolpadDashboardLayout>
            <PageContainer>
                <Outlet />
            </PageContainer>
        </ToolpadDashboardLayout>
    );
}
