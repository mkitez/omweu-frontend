import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Category, PageProps } from '../pages/faq/[categorySlug]';
import AppLayout from './AppLayout';
import styles from '../styles/FaqLayout.module.css';

const { Content, Sider } = Layout;

const FaqLayout: React.FC<PropsWithChildren & Partial<PageProps>> = ({
  children,
  categories,
  faqTitle,
}) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const router = useRouter();
  const [selectedCategory, setSelectedKey] = useState<Category>();
  useEffect(() => {
    const currentCategory = categories?.find(
      (category) => category.slug === router.query.categorySlug
    );
    setSelectedKey(currentCategory);
  }, [categories, router.query.categorySlug]);

  const items = categories?.map((category) => ({
    key: category.slug,
    label: <Link href={category.slug}>{category.name}</Link>,
  }));
  const title = `${faqTitle} - ${selectedCategory?.name} | EUbyCar.com`;
  return (
    <AppLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="content">
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeFilled />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/faq">{faqTitle}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{selectedCategory?.name}</Breadcrumb.Item>
        </Breadcrumb>
        <Layout hasSider>
          <Sider
            breakpoint="md"
            collapsedWidth="0"
            theme="light"
            zeroWidthTriggerStyle={{ display: 'none' }}
          >
            <Menu
              mode="inline"
              selectedKeys={selectedCategory ? [selectedCategory.slug] : []}
              items={items}
              style={{ borderRadius }}
            />
          </Sider>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </div>
    </AppLayout>
  );
};

export default FaqLayout;
