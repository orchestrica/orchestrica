import { Outlet } from 'react-router';
import ToolpadAppProvider from './provider/ToolpadAppProvider';

export default function App() {
  return (
    <ToolpadAppProvider>
      <Outlet />
    </ToolpadAppProvider >
  );
}