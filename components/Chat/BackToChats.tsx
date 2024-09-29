import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import styles from './Chat.module.css';

const BackToChats = () => {
  const { t } = useTranslation('chat');
  return (
    <div>
      <Link href="/dashboard/chats" passHref legacyBehavior>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          className={styles.backBtn}
        >
          {t('backToChats')}
        </Button>
      </Link>
    </div>
  );
};

export default BackToChats;
