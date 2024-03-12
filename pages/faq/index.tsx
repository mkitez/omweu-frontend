import Head from 'next/head';
import Markdown from 'react-markdown';
import cmsApi from '../../services/cmsApi';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig } from 'next-i18next';
import { REVALIDATE_INTERVAL } from '../../utils/constants';
import { Breadcrumb, Card } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Category } from './[categorySlug]';
import Link from 'next/link';
import faqLayoutStyles from '../../styles/FaqLayout.module.css';
import styles from '../../styles/Faq.module.css';

const FAQ: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  title,
  content,
  categories,
}) => {
  return (
    <>
      <div className="content">
        <Breadcrumb className={faqLayoutStyles.breadcrumb}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeFilled />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container">
        <Head>
          <title>{`${title} | EUbyCar.com`}</title>
        </Head>
        <h1>{title}</h1>
        <Markdown>{content}</Markdown>
        <div>
          {categories.map((category) => (
            <Link key={category.slug} href={`/faq/${category.slug}`}>
              <Card hoverable className={styles.categoryCard}>
                {category.name}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

type Props = {
  title: string;
  content: string;
  categories: Category[];
} & SSRConfig;

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);

  const response = await cmsApi.get('faq', {
    params: { locale },
  });
  const { title, content } = response.data.data.attributes;

  const categoriesResponse = await cmsApi.get('categories', {
    params: { locale },
  });
  const categories = categoriesResponse.data.data.map((category: any) => ({
    slug: category.attributes.slug,
    name: category.attributes.name,
  }));

  return {
    revalidate: REVALIDATE_INTERVAL,
    props: {
      ...translations,
      title,
      content,
      categories,
    },
  };
};

export default FAQ;
