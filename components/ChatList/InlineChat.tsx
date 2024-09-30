import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

import { Chat } from '../../services/chat.service';

import UserAvatar from '../TripDetails/UserAvatar';
import styles from './ChatList.module.css';

interface Props {
  chat: Chat;
}

const InlineChat: React.FC<Props> = ({ chat }) => {
  const { t } = useTranslation('dashboard');
  const { data: session } = useSession();
  const otherUser = chat.participants.find(
    (participant) => Number(session?.user.id) !== participant.id
  );

  if (!otherUser) {
    return null;
  }

  return (
    <div className={styles.chat}>
      <div className={styles.avatarContainer}>
        <UserAvatar user={otherUser} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.participantName}>{otherUser.first_name}</div>
        <div className={styles.lastMessage}>
          {chat.last_message.from_user === Number(session?.user.id) && (
            <span className={styles.fromMe}>{t('chats.fromMe')}:</span>
          )}
          <span className={styles.messageContent}>
            {chat.last_message.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InlineChat;
