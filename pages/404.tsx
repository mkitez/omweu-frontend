import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import styles from '../styles/404.module.css';

const Custom404Page = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`${t('errors.notFound')} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <h1>{t('errors.notFound')}</h1>
          <div>{t('errors.notFoundDetails')}</div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  return {
    props: {
      ...translations,
    },
  };
};

export default Custom404Page;
