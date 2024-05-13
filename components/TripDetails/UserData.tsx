import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { User } from '../Trips';
import styles from './TripDetails.module.css';
import UserAvatar from './UserAvatar';

type Props = {
  user: User;
};

const UserData: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation('booking');
  const { phone_number, telegram_username } = user;
  const hasContacts = phone_number || telegram_username;

  return (
    <div className={styles.userData}>
      <div className={styles.driver}>
        <UserAvatar user={user} />
        <div className={styles.driverName}>
          <Link href={`/users/${user.id}`}>{user.first_name}</Link>
        </div>
      </div>
      {hasContacts && (
        <div className={styles.contacts}>
          <ul>
            {phone_number && (
              <li>
                {t('phone')}:{' '}
                <a className={styles.contactValue} href={`tel:${phone_number}`}>
                  {phone_number}
                </a>
              </li>
            )}
            {telegram_username && (
              <li>
                Telegram:{' '}
                <a
                  href={`https://t.me/${telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactValue}
                >
                  @{telegram_username}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserData;
