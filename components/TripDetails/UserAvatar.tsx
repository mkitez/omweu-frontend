import Image from 'next/image';
import { User } from '../Trips';
import styles from './TripDetails.module.css';

type Props = {
  user: User;
};

const UserAvatar: React.FC<Props> = ({ user }) => {
  return (
    <div className={styles.imgContainer}>
      {user.photo ? (
        <Image src={user.photo} width={100} height={100} alt="" />
      ) : (
        user.first_name.charAt(0)
      )}
    </div>
  );
};

export default UserAvatar;
