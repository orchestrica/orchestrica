import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import HomePage from './pages/Home/HomePage';
import DashboardLayout from './components/layout/DashboardLayout/DashboardLayout';
import AgentListPage from './pages/Agent/AgentListPage';
import AgentPage from './pages/Agent/Agent/AgentPage';

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: DashboardLayout,
        children: [
          {
            path: '',
            Component: HomePage,
          },
          {
            path: 'agent',
            Component: AgentListPage,
          },
          {
            path: '/agent/:id',
            Component: AgentPage,
          }]
      },
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);