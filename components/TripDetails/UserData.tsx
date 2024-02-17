import { User } from '../Trips';
import UserAvatar from './UserAvatar';
import styles from './TripDetails.module.css';
import { useTranslation } from 'next-i18next';

type Props = {
  user: User;
};

const UserData: React.FC<Props> = ({ user }) => {
  const { t } = useTranslation('booking');
  const { phone_number, telegram_username } = user;
  const hasContacts = phone_number || telegram_username;

  return (
    <>
      <div className={styles.driver}>
        <UserAvatar user={user} />
        <div className={styles.driverName}>{user.first_name}</div>
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
    </>
  );
};

export default UserData;
