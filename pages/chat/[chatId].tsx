import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import Chat from '../../components/Chat';
import { authOptions } from '../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ChatPage = ({}: PageProps) => {
  const router = useRouter();

  return (
    <div className="container">
      <Chat chatId={router.query.chatId as string} />
    </div>
  );
};

type Props = {
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'chat',
  ]);
  const session = await unstable_getServerSession(req, res, authOptions);

  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default ChatPage;
