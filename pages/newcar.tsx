import { App } from 'antd';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import CarEditForm from '../components/CarEditForm';
import { useCarApi } from '../hooks/api/useCarsApi';
import styles from '../styles/NewCar.module.css';
import { authOptions } from './api/auth/[...nextauth]';

const NewCar = () => {
  const { t } = useTranslation('car');
  const router = useRouter();
  const { message } = App.useApp();
  const carApi = useCarApi();

  return (
    <div className="container">
      <Head>
        <title>{`${t('create_title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('create_title')}</h1>
        <CarEditForm
          submitValue={t('create')}
          submit={async (data) => {
            await carApi.createCar(data);
            message.success(t('notifications.car_created'));
            router.push('/dashboard/profile');
          }}
        />
      </div>
    </div>
  );
};

NewCar.auth = true;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'car',
  ]);
  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default NewCar;
