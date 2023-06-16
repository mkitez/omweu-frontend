import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as contentful from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { SSRConfig } from 'next-i18next';

const TermsAndConditions = ({
  title,
  body,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="container">
      <Head>
        <title>{`${title} | EUbyCar.com`}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
};

type Props = {
  title: string;
  body: string;
} & SSRConfig;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  });

  const entry = await client.getEntry('4TB1EQgO6beJwdnZFY3Rgc', { locale });
  return {
    revalidate: 60,
    props: {
      ...translations,
      title: entry.fields.title as string,
      body: documentToHtmlString(entry.fields.body as Document),
    },
  };
};

export default TermsAndConditions;
