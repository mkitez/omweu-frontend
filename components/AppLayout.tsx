import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
});

const { Content } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout className={montserrat.variable} style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content>{children}</Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
