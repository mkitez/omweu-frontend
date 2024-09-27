import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { User } from '../Trips';
import styles from './Chat.module.css';
import ChatHeader from './ChatHeader';

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  to_user: number;
  from_user: number;
  timestamp: string;
}

interface Props {
  chatId: string;
}

const Chat: React.FC<Props> = ({ chatId }) => {
  const { t } = useTranslation('chat');

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const chatApi = useChatApi();
  const { data: session } = useSession();
  const { sendJsonMessage } = useChatWebSocket(chatId, {
    onMessage: (e) => {
      const data = JSON.parse(e.data) as Message;
      setMessages((prev) => [data, ...prev]);
    },
  });

  useEffect(() => {
    setLoading(true);
    chatApi.getChat(chatId as string).then((response) => {
      setMessages(response.data.messages);
      setUsers(response.data.participants);
      setLoading(false);
    });
  }, [chatApi, chatId]);

  if (loading) {
    return null;
  }

  const otherUser = users.find((user) => user.id !== Number(session?.user.id));
  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('title')} ${otherUser?.first_name} | EUbyCar.com`}</title>
      </Head>
      <div>
        <Link href="/chats" passHref legacyBehavior>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            className={styles.backBtn}
          >
            {t('backToChats')}
          </Button>
        </Link>
      </div>
      <ChatHeader user={otherUser} />
      <div className={styles.chat}>
        {messages.map((message) => (
          <div
            className={`${styles.msgWrapper} ${message.from_user === otherUser?.id ? '' : styles.userMsgWrapper}`}
            key={message.id}
          >
            <div className={styles.msg}>{message.content}</div>
          </div>
        ))}
      </div>
      <Space.Compact className={styles.inputContainer}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('enterMessage') as string}
          onKeyUp={(e) => {
            if (!input) {
              return;
            }
            if (e.key === 'Enter') {
              sendJsonMessage({ message: input });
              setInput('');
            }
          }}
        />
        <Button
          type="primary"
          disabled={!input}
          className={styles.sendBtn}
          onClick={() => {
            sendJsonMessage({ message: input });
            setInput('');
          }}
          icon={<SendOutlined />}
        />
      </Space.Compact>
    </div>
  );
};

export default Chat;
