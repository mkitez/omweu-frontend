import { Button, message, Result, Steps } from 'antd';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import type { InferGetServerSidePropsType } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getUserApi } from '../services/serverSide/userApi';

import AddContactsForm from '../components/AddContactsForm';
import CarEditForm from '../components/CarEditForm';
import DriverPreferencesForm from '../components/DriverPreferencesForm';
import { User } from '../components/Trips';
import { useCarApi } from '../hooks/api/useCarsApi';
import styles from '../styles/AddContacts.module.css';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { shouldShowDriverDataPage } from './newtrip';

const getInitialStep = (user: User | undefined) => {
  if (!user) {
    return 0;
  }
  const hasContactData = user.phone_number || user.telegram_username;
  if (!hasContactData || !user.is_email_confirmed) {
    return 0;
  }
  if (user.cars.length === 0) {
    return 1;
  }
  if (!user.driver_preferences) {
    return 2;
  }
  return 3;
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const DriverInfoPage: NextPageWithLayout<PageProps> = ({ user }) => {
  const { t } = useTranslation(['dashboard', 'common', 'car']);
  const [currentStep, setCurrentStep] = useState(getInitialStep(user));
  const carApi = useCarApi();
  useEffect(() => {
    if (!user) {
      return;
    }
    if (currentStep === 1 && user.cars.length > 0) {
      setCurrentStep(2);
    }
    if (currentStep === 2 && user.driver_preferences) {
      setCurrentStep(3);
    }
  }, [currentStep, user]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const items = [
    {
      title: t('driver_data_steps.contacts'),
      content: <AddContactsForm user={user} onSubmit={nextStep} />,
    },
    {
      title: t('driver_data_steps.cars'),
      content: (
        <>
          <h1>{t('create_title', { ns: 'car' })}</h1>
          <div className={styles.info}>
            {t('driver_data_steps.cars_info_text')}
          </div>
          <CarEditForm
            submitValue={t('cars.create_and_continue')}
            hideCancelButton
            hideIsPrimary
            submit={async (data) => {
              try {
                await carApi.createCar(data);
                message.success(t('notifications.car_created', { ns: 'car' }));
                nextStep();
              } catch (e) {
                if (axios.isAxiosError(e)) {
                  message.error(t('errors.common', { ns: 'common' }));
                }
              }
            }}
          />
        </>
      ),
    },
    {
      title: t('driver_data_steps.preferences'),
      content: (
        <>
          <h1>{t('driver_preferences.title')}</h1>
          <DriverPreferencesForm showSubmitButton onSubmit={nextStep} />
        </>
      ),
    },
    {
      title: t('driver_data_steps.done'),
      content: (
        <Result
          status="success"
          title={t('driver_data_steps.done_title')}
          subTitle={t('driver_data_steps.done_subtitle')}
          extra={[
            <Link href="/newtrip" passHref legacyBehavior key="createTrip">
              <Button type="primary">{t('trips.createTrip')}</Button>
            </Link>,
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>{`${t('addContacts.title')} | EUbyCar.com`}</title>
      </Head>
      <div className="container-wd">
        <Steps current={currentStep} items={items} className={styles.steps} />
      </div>
      <div className="container">
        <div className={styles.root}>{items[currentStep].content}</div>
      </div>
    </>
  );
};

export default DriverInfoPage;

type Props = {
  user?: User;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return { redirect: { destination: '/' }, props: { session: null } };
  }

  const userApi = getUserApi(session, locale);
  const userResponse = await userApi.getSelf();
  const user: User = userResponse.data;
  if (!shouldShowDriverDataPage(user)) {
    return {
      redirect: { destination: '/newtrip' },
      props: { session },
    };
  }

  const translations = await serverSideTranslations(locale as string, [
    'dashboard',
    'common',
    'car',
  ]);

  return {
    props: {
      ...translations,
      session,
      user,
    },
  };
};
