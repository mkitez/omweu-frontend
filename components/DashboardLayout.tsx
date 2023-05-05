import { PropsWithChildren, useState, useEffect } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import AppHeader from './AppHeader';
import { useRouter } from 'next/router';

const { Content, Footer, Sider } = Layout;

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
    <Layout>
      <AppHeader />
      <Content className="content">
        <Layout hasSider>
          <Sider style={{ background: 'none' }}>
            <Menu
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              items={items}
              style={{ borderRadius }}
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
          <Content style={{ padding: '5px 20px' }}>{children}</Content>
        </Layout>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default DashboardLayout;
