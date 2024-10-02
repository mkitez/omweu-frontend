import { Layout, notification } from 'antd';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import { Message } from './Chat';
import UserAvatar from './TripDetails/UserAvatar';
import { User } from './Trips';

interface MessageNotificationData {
  type: string;
  from_user: User;
  message: Message;
}

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
});

const { Content } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const notificationsWebSocket = useNotificationWebSocket({
    onMessage: (e) => {
      const data = JSON.parse(e.data) as MessageNotificationData;
      if (router.query.chatId === data.message.conversation_id) {
        return;
      }
      const key = data.message.id;
      api.open({
        message: (
          <div className="notification-message">
            <UserAvatar user={data.from_user} small />
            <div>{data.from_user.first_name}</div>
          </div>
        ),
        description: (
          <div className="notification-description">{data.message.content}</div>
        ),
        placement: 'bottomRight',
        className: 'notification',
        key,
        duration: 0,
        onClick: () => {
          router.push(`/chat/${data.message.conversation_id}`);
          api.destroy(key);
        },
      });
    },
  });

  return (
    <Layout className={montserrat.variable} style={{ minHeight: '100vh' }}>
      {contextHolder}
      <AppHeader />
      <Content style={{ minHeight: 600 }}>{children}</Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
