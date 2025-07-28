import { Outlet } from 'react-router-dom';
import Header from './Header';
import { InlineMessage } from '../components/messages/InlineMessage';
import { MessageAutoClear } from '../components/messages/MessageAutoClear';

export default function AppLayout() {
  return (
    <div className="min-w-[1280px] w-full mx-auto px-4">
      <Header />
      <MessageAutoClear />
      <InlineMessage />
      <Outlet />
    </div>
  );
}
