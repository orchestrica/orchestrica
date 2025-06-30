import { Outlet } from 'react-router';
import ToolpadAppProvider from './provider/ToolpadAppProvider';
import './styles/index.css';
export default function App() {
  return (
    <ToolpadAppProvider>
      <Outlet />
    </ToolpadAppProvider >
  );
}