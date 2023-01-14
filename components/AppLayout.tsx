import { PropsWithChildren } from 'react';
import { Layout, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Header style={{ backgroundColor: colorBgContainer }}>Header</Header>
      <Content style={{ height: '800px' }}>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default AppLayout;
