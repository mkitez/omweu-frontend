import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Chat } from '../../services/chat.service';

import styles from './ChatList.module.css';
import InlineChat from './InlineChat';

interface Props {
  data: Chat[];
}

const ChatList: React.FC<Props> = ({ data: chats }) => {
  const { t } = useTranslation('dashboard');

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

  return (
    <div>
      {chats.map((chat) => (
        <Link href={`/chat/${chat.id}`} key={chat.id} className={styles.link}>
          <InlineChat chat={chat} />
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
