import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import type { ReactElement } from 'react';

import { Chat } from '../../services/chat.service';
import { getChatApi } from '../../services/serverSide/chatApi';

import ChatList from '../../components/ChatList';
import DashboardLayout from '../../components/DashboardLayout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ChatsPage: NextPageWithLayout<PageProps> = ({ chats }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  return (
    <>
      <Head>
        <title>{`${t('chats.title')} | EUbyCar.com`}</title>
      </Head>
      <h2>{t('chats.title')}</h2>
      {chats === null ? (
        <div>{t('errors.common', { ns: 'common' })}</div>
      ) : (
        <ChatList data={chats} />
      )}
    </>
  );
};

ChatsPage.auth = true;

ChatsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

type Props = {
  session: Session | null;
  chats: Chat[] | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
  ]);
  const api = getChatApi(session, locale);

  let chats: Chat[] | null;
  try {
    const chatsResponse = await api.getChats();
    chats = chatsResponse.data;
  } catch (e) {
    chats = null;
  }

  return {
    props: {
      ...translations,
      chats,
      session,
    },
  };
};

export default ChatsPage;
