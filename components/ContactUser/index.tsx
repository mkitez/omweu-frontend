import { MessageOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

import styles from './ContactUser.module.css';

interface Props {
  userId: number;
  tripSlug: string;
  label: string;
}

const ContactUser: React.FC<Props> = ({ userId, tripSlug, label }) => {
  return (
    <div className={styles.root}>
      <Link href={`/chat/${tripSlug}/${userId}`} passHref legacyBehavior>
        <Button type="text" icon={<MessageOutlined />} className={styles.btn}>
          {label}
        </Button>
      </Link>
    </div>
  );
};

export default ContactUser;
