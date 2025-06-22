import { Outlet } from 'react-router';
import ToolpadAppProvider from './provider/ToolpadAppProvider';
import './styles/reset.css';
export default function App() {
  return (
    <ToolpadAppProvider>
      <Outlet />
    </ToolpadAppProvider >
  );
}