import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Chat } from '../../services/chat.service';

import { formatDate } from '../../utils/formatDate';
import styles from './ChatList.module.css';
import InlineChat from './InlineChat';

interface Props {
  data: Chat[];
}

const ChatList: React.FC<Props> = ({ data: chats }) => {
  const { t, i18n } = useTranslation('dashboard');

  if (chats.length === 0) {
    return (
      <div className={styles.noChats}>
        <p>{t('chats.noChats')}</p>
        <p>
          <Link href="/?search=true" legacyBehavior passHref>
            <Button icon={<SearchOutlined />}>{t('chats.searchTrips')}</Button>
          </Link>
        </p>
      </div>
    );
  }

  const chatsByTrip = chats.reduce(
    (chatGroups: Record<number, Chat[]>, chat) => {
      const dataKey = chat.trip.id;
      if (!chatGroups[dataKey]) {
        chatGroups[dataKey] = [];
      }
      chatGroups[dataKey].push(chat);
      return chatGroups;
    },
    {}
  );

  return (
    <div className={styles.root}>
      {Object.entries(chatsByTrip).map(([tripId, chats]) => {
        const [{ trip }] = chats;
        const formattedDate = formatDate(
          new Date(trip.date),
          i18n.language,
          trip.origin.time_zone
        );
        const groupTitle = `${trip.origin.name} – ${trip.dest.name} ${formattedDate}`;
        return (
          <div key={tripId} className={styles.chatGroup}>
            <h3>{groupTitle}</h3>
            {chats.map((chat) => (
              <Link
                href={`/chat/${chat.id}`}
                key={chat.id}
                className={styles.link}
              >
                <InlineChat chat={chat} />
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
