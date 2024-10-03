import { SendOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Skeleton, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { Trip, User } from '../Trips';
import BackToChats from './BackToChats';
import styles from './Chat.module.css';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';

export interface Message {
  id: string;
  conversation_id: string;
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

interface ChatData {
  trip: Trip;
  messages: Message[];
  participants: User[];
}

interface Props {
  chatId: string;
}

const Chat: React.FC<Props> = ({ chatId }) => {
  const { t } = useTranslation(['chat', 'common']);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<ChatData>();
  const [input, setInput] = useState('');

  const chatApi = useChatApi();
  const { data: session } = useSession();
  const { sendJsonMessage } = useChatWebSocket(chatId, {
    onMessage: (e) => {
      if (loading) {
        return;
      }
      const messageData = JSON.parse(e.data) as MessageData;
      if (messageData.type === 'chat_message') {
        const { message } = messageData;
        setData((prev) => {
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

  useEffect(() => {
    chatApi
      .getChat(chatId as string)
      .then((response) => {
        const { trip, messages, participants } = response.data;
        setData({ trip, messages, participants });
        setLoading(false);
        sendJsonMessage({ type: 'read_messages' });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            sendJsonMessage({ type: 'read_messages' });
          }
        });
        document.dispatchEvent(new Event('visibilitychange'));
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          setError(t('errors.common', { ns: 'common' }) as string);
        }
      });
  }, [chatApi, chatId, sendJsonMessage, t]);

  const sendMessage = () => {
    sendJsonMessage({ type: 'chat_message', message: input });
    setInput('');
  };

  if (error) {
    return <Alert type="error" message={error} />;
  }

  const otherUser = data?.participants.find(
    (user) => user.id !== Number(session?.user.id)
  );
  const isTripInPast = dayjs(data?.trip.date) < dayjs();
  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('title')} ${otherUser?.first_name} | EUbyCar.com`}</title>
      </Head>
      <BackToChats />
      {loading ? (
        <Skeleton avatar paragraph={{ rows: 5 }} className={styles.loading} />
      ) : (
        <>
          <ChatHeader user={otherUser} trip={data?.trip} />
          <ChatWindow
            messages={data?.messages || []}
            otherUser={otherUser}
            disabled={isTripInPast}
          />
          <Space.Compact className={styles.inputContainer}>
            <Input
              value={input}
              disabled={isTripInPast}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('enterMessage') as string}
              onKeyUp={(e) => {
                if (!input) {
                  return;
                }
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button
              type="primary"
              disabled={!input}
              className={styles.sendBtn}
              onClick={sendMessage}
              icon={<SendOutlined />}
            />
          </Space.Compact>
          <Button onClick={() => sendJsonMessage({ type: 'read_messages' })}>
            Read
          </Button>
        </>
      )}
    </div>
  );
};

export default Chat;
