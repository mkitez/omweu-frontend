import Head from 'next/head';
import { GetServerSideProps } from 'next';
import type { InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from './api/auth/[...nextauth]';
import { SSRConfig, Trans, useTranslation } from 'next-i18next';
import styles from '../styles/AddContacts.module.css';
import api from '../services/api';
import { User } from '../components/Trips';
import ContactDetailsForm from '../components/ContactDetailsForm';
import Link from 'next/link';
import { Alert } from 'antd';

const AddContacts = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(['dashboard', 'common']);

  const shouldUpdateEmail = user?.email === '';
  const awaitingEmailConfirmation = user?.email && !user.is_email_confirmed;
  return (
    <div className="container">
      <Head>
        <title>{`${t('addContacts.title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('addContacts.title')}</h1>
        {awaitingEmailConfirmation ? (
          <Alert
            type="info"
            message={t('addContacts.emailNotConfirmedTitle')}
            description={t('addContacts.emailNotConfirmedBody')}
            showIcon
          />
        ) : (
          <>
            <div className={styles.info}>
              <p>
                <Trans
                  components={[
                    <Link key={0} href="/dashboard/profile">
                      x
                    </Link>,
                  ]}
                >
                  {t('addContacts.infoTextOne')}
                </Trans>
              </p>
              {shouldUpdateEmail && <p>{t('addContacts.infoTextTwo')}</p>}
            </div>
            <ContactDetailsForm updateEmail={shouldUpdateEmail} />
          </>
        )}
      </div>
    </div>
  );
};

export default AddContacts;

type Props = {
  user?: User;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return { redirect: { destination: '/' }, props: {} };
  }

  const userResponse = await api.get(`/users/${session.user.id}/`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Accept-Language': locale,
    },
  });
  const userData = userResponse.data as User;
  if (
    (userData.phone_number || userData.telegram_username) &&
    userData.is_email_confirmed
  ) {
    return {
      redirect: { destination: '/newtrip' },
      props: {},
    };
  }

  const translations = await serverSideTranslations(locale as string, [
    'dashboard',
    'common',
  ]);

  return {
    props: {
      ...translations,
      user: userData,
    },
  };
};
