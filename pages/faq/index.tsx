import Head from 'next/head';
import Markdown from 'react-markdown';
import cmsApi from '../../services/cmsApi';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from 'next-i18next';
import { REVALIDATE_INTERVAL } from '../../utils/constants';
import { Breadcrumb, Card } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import Link from 'next/link';
import styles from '../../styles/FaqLayout.module.css';

const FAQ = ({
  title,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <div className="content">
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeFilled />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/faq">{title}</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container">
        <Head>
          <title>{`${title} | EUbyCar.com`}</title>
        </Head>
        <h1>{title}</h1>
        <Markdown>{content}</Markdown>
        <div>
          <Link href="/faq/europe">
            <Card hoverable>Europe</Card>
          </Link>
          <Link href="/faq/russia">
            <Card hoverable>Russia</Card>
          </Link>
        </div>
      </div>
    </>
  );
};

type Props = {
  title: string;
  content: string;
} & SSRConfig;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  const response = await cmsApi.get('faq', {
    params: { locale },
  });
  const { title, content } = response.data.data.attributes;

  return {
    revalidate: REVALIDATE_INTERVAL,
    props: {
      ...translations,
      title,
      content,
    },
  };
};

export default FAQ;
