import { type Message } from '.';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { Fragment, useCallback } from 'react';

import { User } from '../Trips';
import styles from './Chat.module.css';

const extractDate = (dateStr: string) =>
  new Date(dateStr).toISOString().split('T')[0];

interface Props {
  messages: Message[];
  otherUser: User | undefined;
  disabled?: boolean;
}

const ChatWindow: React.FC<Props> = ({ messages, otherUser, disabled }) => {
  const { t, i18n } = useTranslation('chat');
  const formatDate = useCallback(
    (dateStr: string) => {
      const date = dayjs(dateStr);
      const diff = dayjs(Date.now()).diff(date, 'day');
      if (diff === 0) {
        return t('today');
      }
      if (diff === 1) {
        return t('yesterday');
      }
      return date.locale(i18n.language).format('D MMMM');
    },
    [i18n.language, t]
  );

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
      {disabled && <div className={styles.disabled}>{t('chatDisabled')}</div>}
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <Fragment key={date}>
          {messages.map((message) => {
            let className = styles.msgWrapper;
            if (message.from_user !== otherUser?.id) {
              className += ` ${styles.myMsgWrapper}`;
            }
            if (!message.is_read) {
              className += ` ${styles.unread}`;
            }
            return (
              <div className={className} key={message.id}>
                <div className={styles.msg}>
                  {message.content}{' '}
                  <span className={styles.timestamp}>
                    {dayjs(message.timestamp)
                      .locale(i18n.language)
                      .format('LT')}
                  </span>
                </div>
              </div>
            );
          })}
          <div className={styles.dateWrapper}>
            <div className={styles.date}>{formatDate(date)}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ChatWindow;
