import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { PageProps } from '../pages/faq/[categoryId]';
import { HomeFilled } from '@ant-design/icons';
import AppLayout from './AppLayout';
import styles from '../styles/FaqLayout.module.css';

const { Content, Sider } = Layout;

const FaqLayout: React.FC<PropsWithChildren & PageProps> = ({
  children,
  categories,
}) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>();
  useEffect(() => {
    setSelectedKey(router.query.categoryId as string);
  }, [router.query.categoryId]);

  const items = categories.map((category) => ({
    key: category,
    label: <Link href={category}>{category}</Link>,
  }));
  return (
    <AppLayout>
      <div className="content">
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeFilled />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/faq">FAQ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href={selectedKey || ''}>{selectedKey}</Link>
          </Breadcrumb.Item>
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
              selectedKeys={selectedKey ? [selectedKey] : []}
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
