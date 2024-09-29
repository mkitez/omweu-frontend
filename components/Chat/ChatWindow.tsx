import { type Message } from '.';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { User } from '../Trips';
import styles from './Chat.module.css';

const extractDate = (dateStr: string) =>
  new Date(dateStr).toISOString().split('T')[0];

interface Props {
  messages: Message[];
  otherUser: User | undefined;
}

const ChatWindow: React.FC<Props> = ({ messages, otherUser }) => {
  const { t, i18n } = useTranslation('chat');

  if (messages.length === 0) {
    return <div className={styles.noMessages}>{t('noMessages')}</div>;
  }

  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, message) => {
      const dateKey = extractDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    },
    {}
  );

  return (
    <div className={styles.chat}>
      {Object.entries(groupedMessages).map(([date, messages]) => {
        return (
          <>
            {messages.map((message) => (
              <div
                className={`${styles.msgWrapper} ${message.from_user === otherUser?.id ? '' : styles.userMsgWrapper}`}
                key={message.id}
              >
                <div className={styles.msg}>{message.content}</div>
              </div>
            ))}
            <div className={styles.dateWrapper}>
              <div className={styles.date}>
                {dayjs(date).locale(i18n.language).format('D MMMM')}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ChatWindow;
