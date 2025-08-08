import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="min-w-[1280px] w-full mx-auto px-4">
      <Header />
      <Outlet />
    </div>
  );
}
