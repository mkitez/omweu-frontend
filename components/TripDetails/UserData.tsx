import Link from 'next/link';

import PhoneIcon from '../../assets/phone-svgrepo-com.svg';
import TelegramIcon from '../../assets/telegram-svgrepo-com.svg';
import WhatsappIcon from '../../assets/whatsapp-color-svgrepo-com.svg';
import { User } from '../Trips';
import styles from './TripDetails.module.css';
import UserAvatar from './UserAvatar';

type Props = {
  user: User;
};

const UserData: React.FC<Props> = ({ user }) => {
  const { phone_number, telegram_username, whatsapp_number } = user;
  const hasContacts = phone_number || telegram_username || whatsapp_number;

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
                <a href={`tel:${phone_number}`}>
                  <div className={styles.contact}>
                    <div className={styles.contactIcon}>
                      <PhoneIcon height="100%" width="100%" />
                    </div>
                    {phone_number}
                  </div>
                </a>
              </li>
            )}
            {whatsapp_number && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={styles.contact}>
                    <div className={styles.contactIcon}>
                      <WhatsappIcon height="100%" width="100%" />
                    </div>
                    {whatsapp_number}
                  </div>
                </a>
              </li>
            )}
            {telegram_username && (
              <li>
                <a
                  href={`https://t.me/${telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={styles.contact}>
                    <div className={styles.contactIcon}>
                      <TelegramIcon height="100%" width="100%" />
                    </div>
                    @{telegram_username}
                  </div>
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
