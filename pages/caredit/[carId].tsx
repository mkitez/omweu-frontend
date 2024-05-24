import { App } from 'antd';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Car } from '../../services/car.service';
import { getCarApi } from '../../services/serverSide/carApi';

import CarEditForm from '../../components/CarEditForm';
import { useCarApi } from '../../hooks/api/useCarsApi';
import styles from '../../styles/CarEdit.module.css';
import { authOptions } from '../api/auth/[...nextauth]';

const CarEditPage = ({
  car,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('car');
  const carApi = useCarApi();
  const { message } = App.useApp();
  const router = useRouter();

  if (car === null) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <Head>
        <title>{`${t('edit_title')} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <h1>{t('edit_title')}</h1>
          <CarEditForm
            data={car}
            submitValue={t('update')}
            submit={async (data) => {
              await carApi.updateCar(Number(router.query.carId), data);
              message.success(t('notifications.car_updated'));
              router.push('/dashboard/profile');
            }}
          />
        </div>
      </div>
    </>
  );
};

type Props = {
  car: Car | null;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
  params,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'car',
  ]);
  const session = await unstable_getServerSession(req, res, authOptions);
  const api = getCarApi(session, locale);

  let notFound = false;
  let car: Car | null = null;
  try {
    const response = await api.getCar(Number(params?.carId));
    car = response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status && [403, 404].includes(e.response?.status))
        notFound = true;
    }
  }

  return {
    notFound,
    props: {
      ...translations,
      session,
      car,
    },
  };
};

export default CarEditPage;
