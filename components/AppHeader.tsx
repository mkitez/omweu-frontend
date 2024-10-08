import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Layout, Skeleton, theme } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect } from 'react';

import Logo from '../assets/logo.svg';
import LogoXs from '../assets/logoXs.svg';
import PendingActionsContext from '../contexts/PendingActionsContext';
import styles from '../styles/AppHeader.module.css';

const { Header } = Layout;

const AppHeader = () => {
  const { t } = useTranslation('common');
  const { status, data: session } = useSession();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pendingActions = useContext(PendingActionsContext);

  useEffect(() => {
    if (session?.error) {
      signOut({ callbackUrl: '/' });
    }
  }, [session]);

  return (
    <Header
      style={{ backgroundColor: colorBgContainer }}
      className={styles.container}
    >
      <div className={styles.logo}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className={styles.logoXs}>
        <Link href="/">
          <LogoXs />
        </Link>
      </div>
      {(() => {
        if (status === 'loading') {
          return (
            <div className={styles.skeletonContainer}>
              <Skeleton.Avatar size="large" active />
            </div>
          );
        }
        if (status === 'unauthenticated' || session?.error) {
          return (
            <div className={styles.authButtons}>
              <Button
                type="primary"
                onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
              >
                {t('signIn')}
              </Button>
              <Link href="/auth/signup" passHref legacyBehavior>
                <Button>{t('signUp')}</Button>
              </Link>
            </div>
          );
        }
        if (status === 'authenticated') {
          const { chats, bookings } = pendingActions;
          return (
            <div className={styles.navButtons}>
              <Link
                href="/newtrip"
                className={styles.offerTripBtn}
                passHref
                legacyBehavior
              >
                <Button type="text" icon={<PlusCircleOutlined />} shape="round">
                  <span className={styles.offerTripText}>{t('offerTrip')}</span>
                </Button>
              </Link>
              <Link href="/dashboard" className={styles.profileBtn}>
                <Badge
                  dot={chats.size > 0 || bookings.size > 0}
                  offset={[-5, 5]}
                >
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={
                      session.user.image && (
                        <Image
                          src={session.user.image}
                          alt="user photo"
                          height={100}
                          width={100}
                        />
                      )
                    }
                  />
                </Badge>
              </Link>
            </div>
          );
        }
      })()}
    </Header>
  );
};

export default AppHeader;
