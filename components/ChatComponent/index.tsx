import { SendOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import { useChatWebSocket } from '../../hooks/useChatWebsocket';
import { User } from '../Trips';
import styles from './Chat.module.css';

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
  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatApi = useChatApi();
  const { data: session } = useSession();
  const { sendJsonMessage } = useChatWebSocket(chatId, {
    onMessage: (e) => {
      const data = JSON.parse(e.data) as Message;
      setMessages((prev) => [...prev, data]);
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

  return (
    <div>
      <div className={styles.chat}>
        {messages.map((message) => (
          <div
            className={`${styles.msgWrapper} ${Number(session?.user.id) === message.from_user ? styles.userMsgWrapper : ''}`}
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
