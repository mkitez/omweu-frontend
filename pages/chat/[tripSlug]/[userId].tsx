import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { getServerSession, Session } from 'next-auth';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import Chat from '../../../components/Chat';
import { authOptions } from '../../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ChatPage = ({}: PageProps) => {
  const router = useRouter();

  return (
    <div className="container">
      <Chat
        tripSlug={router.query.tripSlug as string}
        userId={Number(router.query.userId)}
      />
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
  const session = await getServerSession(req, res, authOptions);

  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default ChatPage;
