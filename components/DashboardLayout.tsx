import { PropsWithChildren } from 'react';
import { Button, Layout, Menu } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import AppHeader from './AppHeader';
import styles from '../styles/Content.module.css';
import { useRouter } from 'next/router';

const { Content, Footer, Sider } = Layout;

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const selectedKey = router.pathname.split('/').slice(-1)[0];
  const items = [
    {
      key: 'trips',
      icon: <CalendarOutlined />,
      label: <Link href="/dashboard/trips">Trips</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
  ];
  return (
    <Layout>
      <AppHeader />
      <Content className={styles.container}>
        <Layout>
          <Sider style={{ background: 'none' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[selectedKey]}
              items={items}
            />
            <div style={{ padding: '5px 12px' }}>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Log out
              </Button>
            </div>
          </Sider>
          <Content style={{ padding: '0px 20px' }}>{children}</Content>
        </Layout>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default DashboardLayout;
