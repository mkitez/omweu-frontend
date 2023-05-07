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
import styles from '../styles/DashboardLayout.module.css';
import { useTranslation } from 'next-i18next';

const { Content, Sider } = Layout;

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>();
  const { t } = useTranslation('dashboard');
  useEffect(() => {
    setSelectedKey(router.pathname.split('/').slice(-1)[0]);
  }, [router.pathname]);

  const items = [
    {
      key: 'trips',
      icon: <CalendarOutlined />,
      label: <Link href="/dashboard/trips">{t('trips.label')}</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">{t('profile.label')}</Link>,
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
                <span className={styles.logoutBtnLabel}>{t('logout')}</span>
              </Button>
            </div>
          </Sider>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </div>
    </AppLayout>
  );
};

export default DashboardLayout;
