import { type Message } from '.';
import { useTranslation } from 'next-i18next';

import { User } from '../Trips';
import styles from './Chat.module.css';

interface Props {
  messages: Message[];
  otherUser: User | undefined;
}

const ChatWindow: React.FC<Props> = ({ messages, otherUser }) => {
  const { t } = useTranslation('chat');

  if (messages.length === 0) {
    return <div className={styles.noMessages}>{t('noMessages')}</div>;
  }

  return (
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
  );
};

export default ChatWindow;
