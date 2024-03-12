import { ReactElement, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Button, Collapse } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import FaqLayout from '../../components/FaqLayout';
import { REVALIDATE_INTERVAL } from '../../utils/constants';
import { NextPageWithLayout } from '../_app';
import cmsApi from '../../services/cmsApi';
import styles from '../../styles/Faq.module.css';

export type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const FaqCategory: NextPageWithLayout<PageProps> = ({
  faqItems,
  categories,
}) => {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<Category>();
  const { t } = useTranslation('common');
  useEffect(() => {
    const currentCategory = categories?.find(
      (category) => category.slug === router.query.categorySlug
    );
    setCurrentCategory(currentCategory);
  }, [categories, router.query.categorySlug]);

  return (
    <>
      <div className={styles.header}>
        <Link href="/faq" passHref legacyBehavior>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            className={styles.backBtn}
          >
            {t('backToCategories')}
          </Button>
        </Link>
        <h1>{currentCategory?.name}</h1>
      </div>
      <Collapse
        bordered={false}
        className={styles.collapse}
        defaultActiveKey={faqItems[0].id}
      >
        {faqItems.map((faqItem) => (
          <Collapse.Panel
            key={faqItem.id}
            header={<h3>{faqItem.attributes.title}</h3>}
            className={styles.collapsePanel}
          >
            <Markdown>{faqItem.attributes.content}</Markdown>
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

FaqCategory.getLayout = (page: ReactElement, pageProps?: PageProps) => (
  <FaqLayout
    categories={pageProps?.categories || []}
    faqTitle={pageProps?.faqTitle}
  >
    {page}
  </FaqLayout>
);

export type Category = { slug: string; name: string };

type Props = {
  categories: Category[];
  faqTitle: string;
  faqItems: {
    id: number;
    attributes: {
      title: string;
      content: string;
    };
  }[];
} & SSRConfig;

export const getStaticProps: GetStaticProps<Props> = async ({
  locale,
  params,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  const faqResponse = await cmsApi.get('faq', {
    params: { locale },
  });
  const categoriesResponse = await cmsApi.get('categories', {
    params: { locale },
  });
  const categories = categoriesResponse.data.data.map((category: any) => ({
    slug: category.attributes.slug,
    name: category.attributes.name,
  }));

  const faqItemsResponse = await cmsApi.get('faq-items', {
    params: { 'filters[category][slug][$eq]': params?.categorySlug },
  });
  const faqItems = faqItemsResponse.data.data;

  return {
    revalidate: REVALIDATE_INTERVAL,
    props: {
      ...translations,
      faqTitle: faqResponse.data.data.attributes.title,
      categories,
      faqItems,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ defaultLocale }) => {
  const categoriesResponse = await cmsApi.get('categories', {
    params: { locale: defaultLocale },
  });
  return {
    paths: categoriesResponse.data.data.map((category: any) => ({
      params: { categorySlug: category.attributes.slug },
    })),
    fallback: true,
  };
};

export default FaqCategory;
