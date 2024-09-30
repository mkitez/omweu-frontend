import Link from 'next/link';

import UserAvatar from '../TripDetails/UserAvatar';
import { User } from '../Trips';
import styles from './Chat.module.css';

interface Props {
  user: User | undefined;
}

const ChatHeader: React.FC<Props> = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className={styles.header}>
      <UserAvatar user={user} />
      <div className={styles.headerUserName}>
        <Link href={`/users/${user.id}`}>{user.first_name}</Link>
      </div>
    </div>
  );
};

export default ChatHeader;
