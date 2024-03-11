import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import AppLayout from './AppLayout';

const { Content, Sider } = Layout;

const FaqLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>();
  useEffect(() => {
    const [key] = router.asPath.split('/').slice(-1);
    setSelectedKey(key);
  }, [router.asPath]);

  const items = [
    {
      key: 'europe',
      label: <Link href="europe">Europe</Link>,
    },
    {
      key: 'russia',
      label: <Link href="russia">Russia</Link>,
    },
  ];
  return (
    <AppLayout>
      <div className="content">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeOutlined />
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
          <Content>{children}</Content>
        </Layout>
      </div>
    </AppLayout>
  );
};

export default FaqLayout;
