import Head from 'next/head';
import Markdown from 'react-markdown';
import cmsApi from '../services/cmsApi';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from 'next-i18next';

const Impressum = ({
  title,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="container">
      <Head>
        <title>{`${title} | EUbyCar.com`}</title>
        <meta name="robots" content="noindex" />
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

  const response = await cmsApi.get('impressum', {
    params: { locale },
  });
  const { title, content } = response.data.data.attributes;

  return {
    revalidate: 60,
    props: {
      ...translations,
      title,
      content,
    },
  };
};

export default Impressum;
