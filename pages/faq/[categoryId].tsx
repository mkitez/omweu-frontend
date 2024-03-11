import { ReactElement } from 'react';
import FaqLayout from '../../components/FaqLayout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { REVALIDATE_INTERVAL } from '../../utils/constants';

const FaqCategory = () => {
  return <div>Content</div>;
};

FaqCategory.getLayout = (page: ReactElement) => <FaqLayout>{page}</FaqLayout>;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  return {
    revalidate: REVALIDATE_INTERVAL,
    props: {
      ...translations,
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
