import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';

const { Content, Footer } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout>
      <AppHeader />
      <Content style={{ height: '800px' }}>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default AppLayout;
