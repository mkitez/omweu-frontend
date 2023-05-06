import { PropsWithChildren, useState, useEffect } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import AppLayout from './AppLayout';
import styles from '../styles/DashboardLaout.module.css';

const { Content, Sider } = Layout;

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>();
  useEffect(() => {
    setSelectedKey(router.pathname.split('/').slice(-1)[0]);
  }, [router.pathname]);

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
    <AppLayout>
      <div className={`content ${styles.root}`}>
        <Layout hasSider>
          <Sider breakpoint="md" collapsedWidth="70" theme="light">
            <Menu
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              items={items}
              style={{ borderRadius }}
            />
            <div className={styles.logoutBtnContainer}>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <span className={styles.logoutBtnLabel}>Log out</span>
              </Button>
            </div>
          </Sider>
          <Content style={{ padding: '5px 20px' }}>{children}</Content>
        </Layout>
      </div>
    </AppLayout>
  );
};

export default DashboardLayout;
