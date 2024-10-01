import { MessageOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useChatApi } from '../../hooks/api/useChatApi';
import styles from './ContactUser.module.css';

interface Props {
  userId: number;
  tripId: number;
  label: string;
}

const ContactUser: React.FC<Props> = ({ userId, tripId, label }) => {
  const { t } = useTranslation(['trip', 'common']);
  const [loading, setLoading] = useState(false);
  const chatApi = useChatApi();
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await chatApi.startChat({
        user_id: userId,
        trip_id: tripId,
      });
      router.push(`/chat/${response.data.id}`);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <Button
        loading={loading}
        type="text"
        icon={<MessageOutlined />}
        onClick={handleClick}
        className={styles.btn}
      >
        {label}
      </Button>
    </div>
  );
};

export default ContactUser;
