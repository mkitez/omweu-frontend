import Link from 'next/link';

import { Chat } from '../../services/chat.service';

import styles from './ChatList.module.css';
import InlineChat from './InlineChat';

interface Props {
  data: Chat[];
}

const ChatList: React.FC<Props> = ({ data: chats }) => {
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
