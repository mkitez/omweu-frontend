import { Button, Input } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import { useChatWebSocket } from '../../hooks/useChatWebsocket';
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
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
      console.log(response.data);
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
            className={styles.message}
            style={{
              textAlign:
                Number(session?.user.id) === message.from_user
                  ? 'right'
                  : undefined,
            }}
            key={message.id}
          >
            {message.from_user}: {message.content}
          </div>
        ))}
      </div>
      <div>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button
          onClick={() => {
            sendJsonMessage({ message: input });
            setInput('');
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
