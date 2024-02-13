import Image from 'next/image';
import { User } from '../Trips';
import styles from './TripDetails.module.css';

type Props = {
  user: User;
  small?: boolean;
};

const UserAvatar: React.FC<Props> = ({ user, small }) => {
  const classNames = [styles.imgContainer];
  if (small) {
    classNames.push(styles.imgContainerSmall);
  }
  return (
    <div className={classNames.join(' ')}>
      {user.photo ? (
        <Image src={user.photo} width={100} height={100} alt="" />
      ) : (
        user.first_name.charAt(0)
      )}
    </div>
  );
};

export default UserAvatar;
