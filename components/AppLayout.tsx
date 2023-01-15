import { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import styles from '../styles/Content.module.css';

const { Content, Footer } = Layout;

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout>
      <AppHeader />
      <Content className={styles.container}>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default AppLayout;
