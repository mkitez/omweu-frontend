import { Layout } from 'antd';
import { Montserrat } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { useNewMessageNotificationWebSocket } from '../hooks/useNewMessageNotificationWebSocket';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
});

const { Content } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  const notificationContextHolder = useNewMessageNotificationWebSocket();
  return (
    <Layout className={montserrat.variable} style={{ minHeight: '100vh' }}>
      {notificationContextHolder}
      <AppHeader />
      <Content style={{ minHeight: 600 }}>{children}</Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
