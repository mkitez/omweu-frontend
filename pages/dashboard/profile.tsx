import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import type { ReactElement } from 'react';
import useSWR from 'swr';

import DashboardLayout from '../../components/DashboardLayout';
import { User } from '../../components/Trips';
import UserProfileForm from '../../components/UserProfileForm';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import styles from '../../styles/Profile.module.css';
import { getServerSideProps } from './trips';

const Profile = () => {
  const fetcher = useAuthorizedFetcher();
  const { data, error, isLoading, mutate } = useSWR<User>(
    '/users/self/',
    fetcher
  );
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('profile.title')} | EUbyCar.com`}</title>
      </Head>
      <h2>{t('profile.title')}</h2>
      {(() => {
        if (isLoading) {
          return (
            <div className={styles.errorLoadingContainer}>
              <LoadingOutlined style={{ fontSize: '2rem' }} />
            </div>
          );
        }
        if (error) {
          return (
            <div className={styles.errorLoadingContainer}>
              {t('errors.common', { ns: 'common' })}
            </div>
          );
        }
        return <UserProfileForm data={data as User} onSubmit={mutate} />;
      })()}
    </div>
  );
};

Profile.auth = true;

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export { getServerSideProps };

export default Profile;
