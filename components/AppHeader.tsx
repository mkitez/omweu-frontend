import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Layout, Button, theme } from 'antd';
import { PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { signIn, useSession } from 'next-auth/react';
import styles from '../styles/AppHeader.module.css';
import logo from '../assets/logo.svg';
import logoXs from '../assets/logoXs.svg';

const { Header } = Layout;

const AppHeader = () => {
  const {
    token: { colorPrimary, colorBgContainer },
  } = theme.useToken();
  const { status } = useSession();
  const { t } = useTranslation('common');

  return (
    <Header
      style={{ backgroundColor: colorBgContainer }}
      className={styles.container}
    >
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src={logo}
            alt="eubycar.com logo"
            width={160}
            className={styles.logo}
          />
          <Image
            src={logoXs}
            alt="eubycar.com logo xs"
            className={styles.logoXs}
          />
        </Link>
      </div>
      {(() => {
        if (status === 'loading') return null;
        if (status === 'authenticated')
          return (
            <div className={styles.navButtons}>
              <Link href="/newtrip" className={styles.offerTripBtn}>
                <Button type="text">
                  <PlusCircleOutlined />{' '}
                  <span className={styles.offerTripText}>{t('offerTrip')}</span>
                </Button>
              </Link>
              <Link href="/dashboard" className={styles.profileBtn}>
                <UserOutlined style={{ color: colorPrimary }} />
              </Link>
            </div>
          );
        if (status === 'unauthenticated')
          return (
            <div className={styles.authButtons}>
              <Button
                type="primary"
                onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
              >
                {t('signIn')}
              </Button>
              <Link href="/signup">
                <Button>{t('signUp')}</Button>
              </Link>
            </div>
          );
      })()}
    </Header>
  );
};

export default AppHeader;
