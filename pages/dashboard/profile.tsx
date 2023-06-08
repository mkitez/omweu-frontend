import Head from 'next/head';
import type { ReactElement } from 'react';
import useSWR from 'swr';
import { getServerSideProps } from './trips';
import api from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { LoadingOutlined } from '@ant-design/icons';
import { User } from '../../components/Trips';
import UserProfileForm from '../../components/UserProfileForm';
import styles from '../../styles/Profile.module.css';

const Profile = () => {
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useSWR<User>(
    `/users/${session?.user.id}/`,
    async (url) => {
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return response.data;
    }
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
