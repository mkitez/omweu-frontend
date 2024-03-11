import Head from 'next/head';
import Markdown from 'react-markdown';
import cmsApi from '../../services/cmsApi';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from 'next-i18next';
import { REVALIDATE_INTERVAL } from '../../utils/constants';

const FAQ = ({
  title,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="container">
      <Head>
        <title>{`${title} | EUbyCar.com`}</title>
      </Head>
      <h1>{title}</h1>
      <Markdown>{content}</Markdown>
    </div>
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
