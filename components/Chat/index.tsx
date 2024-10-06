import { SendOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Skeleton, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { User } from '../Trips';
import BackToChats from './BackToChats';
import styles from './Chat.module.css';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import { useChatData } from './useChatData';
import { useReadMessagesHandler } from './useReadMessagesHandler';

export interface Message {
  id: string;
  conversation: { id: string; trip_slug: string };
  content: string;
  to_user: number;
  from_user: number;
  timestamp: string;
  is_read: boolean;
}

interface MessageData {
  type: 'chat_message' | 'read_messages';
  message: Message;
  user_id: number;
}

interface Props {
  tripSlug: string;
  userId: number;
}

const Chat: React.FC<Props> = ({ tripSlug, userId }) => {
  const { t } = useTranslation(['chat', 'common']);
  const { data: session } = useSession();

  const chatApi = useChatApi();

  const [input, setInput] = useState('');
  const [chatCreating, setChatCreating] = useState(false);

  const { data, loading, error, update, setError } = useChatData({
    tripSlug,
    userId,
  });
  const { sendJsonMessage } = useChatWebSocket(data?.chatId || null, {
    onMessage: (e) => {
      if (loading) {
        return;
      }
      const messageData = JSON.parse(e.data) as MessageData;
      if (messageData.type === 'chat_message') {
        const { message } = messageData;
        update((prev) => {
          if (!prev?.messages) {
            return prev;
          }
          return { ...prev, messages: [message, ...prev.messages] };
        });
      }
      if (messageData.type == 'read_messages') {
        data?.messages
          .filter((message) => message.to_user === messageData.user_id)
          .forEach((message) => {
            message.is_read = true;
          });
      }
    },
  });

  const readMessagesCallback = useCallback(
    () => sendJsonMessage({ type: 'read_messages' }),
    [sendJsonMessage]
  );
  useReadMessagesHandler(data?.chatId ? readMessagesCallback : null);

  const sendMessage = data?.chatId
    ? () => {
        sendJsonMessage({ type: 'chat_message', message: input });
        setInput('');
      }
    : async () => {
        setChatCreating(true);
        try {
          const response = await chatApi.startChat({
            user_id: userId,
            trip_slug: tripSlug,
            message: input,
          });
          const { id, trip, participants, messages } = response.data;
          const otherUser = participants.find(
            (user: User) => user.id !== Number(session?.user.id)
          );
          update({ chatId: id, trip, messages, otherUser });
        } catch (e) {
          if (axios.isAxiosError(e)) {
            setError(t('errors.common', { ns: 'common' }) as string);
          }
        }
        setChatCreating(false);
        setInput('');
      };

  if (error) {
    return <Alert type="error" message={error} />;
  }

  const isTripInPast = dayjs(data?.trip.date) < dayjs();
  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('title')} ${data?.otherUser.first_name} | EUbyCar.com`}</title>
      </Head>
      <BackToChats />
      <Skeleton
        avatar
        paragraph={{ rows: 5 }}
        className={styles.loading}
        loading={loading}
      >
        <ChatHeader user={data?.otherUser} trip={data?.trip} />
        <ChatWindow
          messages={data?.messages || []}
          otherUser={data?.otherUser}
          disabled={isTripInPast}
        />
        <Space.Compact className={styles.inputContainer}>
          <Input
            value={input}
            disabled={isTripInPast}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('enterMessage') as string}
            onKeyUp={(e) => {
              if (!input || chatCreating) {
                return;
              }
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button
            type="primary"
            disabled={!input || chatCreating}
            className={styles.sendBtn}
            onClick={sendMessage}
            icon={<SendOutlined />}
          />
        </Space.Compact>
      </Skeleton>
    </div>
  );
};

export default Chat;
