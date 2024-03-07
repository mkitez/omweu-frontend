import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Layout, Button, theme, Avatar } from 'antd';
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Logo from '../assets/logo.svg';
import LogoXs from '../assets/logoXs.svg';
import styles from '../styles/AppHeader.module.css';

const { Header } = Layout;

const AppHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { status, data: session } = useSession();
  const { t } = useTranslation('common');

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
        if (status === 'loading') return null;
        if (status === 'unauthenticated' || session?.error)
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
        if (status === 'authenticated')
          return (
            <div className={styles.navButtons}>
              <Link
                href="/newtrip"
                className={styles.offerTripBtn}
                passHref
                legacyBehavior
              >
                <Button type="text">
                  <PlusCircleOutlined />{' '}
                  <span className={styles.offerTripText}>{t('offerTrip')}</span>
                </Button>
              </Link>
              <Link href="/dashboard" className={styles.profileBtn}>
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
              </Link>
            </div>
          );
      })()}
    </Header>
  );
};

export default AppHeader;
