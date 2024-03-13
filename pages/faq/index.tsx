import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Breadcrumb, Card } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Category } from './[categorySlug]';
import { REVALIDATE_INTERVAL } from '../../utils/constants';
import cmsApi from '../../services/cmsApi';
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
        <div className={styles.categories}>
          {categories.map((category) => (
            <Link key={category.slug} href={`/faq/${category.slug}`}>
              <Card hoverable className={styles.categoryCard}>
                <Card.Meta
                  avatar={
                    <Image
                      src={category.imageUrl}
                      alt="category-image"
                      width={24}
                      height={24}
                    />
                  }
                  title={category.name}
                />
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
    imageUrl: category.attributes.imageUrl,
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
