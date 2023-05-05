import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
});

const { Content, Footer } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout className={montserrat.variable}>
      <AppHeader />
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default AppLayout;
