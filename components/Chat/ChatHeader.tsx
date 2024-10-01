import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { formatDate } from '../../utils/formatDate';
import UserAvatar from '../TripDetails/UserAvatar';
import { Trip, User } from '../Trips';
import styles from './Chat.module.css';

interface Props {
  user: User | undefined;
  trip: Trip | undefined;
}

const ChatHeader: React.FC<Props> = ({ user, trip }) => {
  const { i18n } = useTranslation('chat');

  if (!user || !trip) {
    return null;
  }

  const formattedDate = formatDate(
    new Date(trip.date),
    i18n.language,
    trip.origin.time_zone
  );
  const tripName = `${trip.origin.name} – ${trip.dest.name} ${formattedDate}`;

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        <UserAvatar user={user} />
      </div>
      <div className={styles.headerUserName}>
        <Link href={`/users/${user.id}`}>{user.first_name}</Link>
      </div>
      <div className={styles.tripName}>
        <Link href={`/trips/${trip.slug}`}>{tripName}</Link>
      </div>
    </div>
  );
};

export default ChatHeader;
