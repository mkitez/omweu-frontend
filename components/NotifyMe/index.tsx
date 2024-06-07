import { BellOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './NotifyMe.module.css';

const NotifyMe: React.FC = () => {
  const { t } = useTranslation('trip');
  const router = useRouter();

  const { from, from_input, to_input, date } = router.query;
  const url = `/new-subscription?from=${from}&from_input=${from_input}&to=${to_input}&to_input=${to_input}&start_date=${date}&end_date=${date}`;

  return (
    <div className={styles.root}>
      <Link href={url} passHref legacyBehavior>
        <Button
          className={styles.button}
          type="text"
          shape="round"
          icon={<BellOutlined className={styles.icon} />}
        >
          {t('notify_me')}
        </Button>
      </Link>
    </div>
  );
};

export default NotifyMe;
