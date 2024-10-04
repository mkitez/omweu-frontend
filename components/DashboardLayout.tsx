import {
  BellOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Grid, Layout, Menu, Modal, theme } from 'antd';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';

import UnreadChatsContext from '../contexts/UnreadChatsContext';
import styles from '../styles/DashboardLayout.module.css';
import AppLayout from './AppLayout';

const { Content, Sider } = Layout;

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const {
    token: { borderRadius },
  } = theme.useToken();
  const { md } = Grid.useBreakpoint();

  const [selectedKey, setSelectedKey] = useState<string>();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const unreadChats = useContext(UnreadChatsContext);
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
      key: 'chats',
      icon: (
        <Badge dot={unreadChats.size > 0} offset={md ? undefined : [0, 10]}>
          <MessageOutlined />
        </Badge>
      ),
      label: <Link href="/dashboard/chats">{t('chats.label')}</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">{t('profile.label')}</Link>,
    },
    {
      key: 'subscriptions',
      icon: <BellOutlined />,
      label: (
        <Link href="/dashboard/subscriptions">{t('subscriptions.label')}</Link>
      ),
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
                onClick={() => setLogoutModalOpen(true)}
              >
                <span className={styles.logoutBtnLabel}>{t('logout')}</span>
              </Button>
            </div>
          </Sider>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </div>
      <Modal
        open={logoutModalOpen}
        title={t('modals.logout.title')}
        okText={t('modals.logout.confirm')}
        cancelText={t('modals.logout.dismiss')}
        onOk={() => signOut({ callbackUrl: '/' })}
        onCancel={() => setLogoutModalOpen(false)}
      >
        {t('modals.logout.body')}
      </Modal>
    </AppLayout>
  );
};

export default DashboardLayout;
