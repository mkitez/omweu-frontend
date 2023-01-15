import Link from 'next/link';
import { Layout, Menu, Button, theme } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';

const { Header } = Layout;

const getItems = (status: string) => {
  const defaultItems = [{ key: 'home', label: <Link href="/">Home</Link> }];
  if (status === 'loading') {
    return defaultItems;
  }
  if (status === 'authenticated') {
    return [
      ...defaultItems,
      {
        key: 'dashboard',
        label: <Link href="/dashboard">Dashboard</Link>,
      },
      {
        key: 'signout',
        label: <Button onClick={() => signOut()}>Sign out</Button>,
      },
    ];
  }
  if (status === 'unauthenticated') {
    return [
      ...defaultItems,
      {
        key: 'signin',
        label: (
          <Button
            type="primary"
            onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
          >
            Sign in
          </Button>
        ),
      },
      {
        key: 'signup',
        label: <Link href="/signup">Sign up</Link>,
      },
    ];
  }
};

const AppHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { status } = useSession();

  const items = getItems(status);
  return (
    <Header style={{ backgroundColor: colorBgContainer }}>
      <Menu theme="light" mode="horizontal" items={items} />
    </Header>
  );
};

export default AppHeader;
