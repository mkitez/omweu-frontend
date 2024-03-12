import { ReactElement } from 'react';
import FaqLayout from '../../components/FaqLayout';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { REVALIDATE_INTERVAL } from '../../utils/constants';
import { SSRConfig } from 'next-i18next';
import { NextPageWithLayout } from '../_app';

export type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const FaqCategory: NextPageWithLayout<PageProps> = () => {
  return <div>Content</div>;
};

FaqCategory.getLayout = (page: ReactElement, pageProps?: PageProps) => (
  <FaqLayout categories={pageProps?.categories || []}>{page}</FaqLayout>
);

type Props = {
  categories: string[];
} & SSRConfig;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  return {
    revalidate: REVALIDATE_INTERVAL,
    props: {
      ...translations,
      categories: ['europe', 'russia'],
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      {
        params: {
          categoryId: 'europe',
        },
      },
      {
        params: {
          categoryId: 'russia',
        },
      },
    ],
    fallback: true,
  };
};

export default FaqCategory;
