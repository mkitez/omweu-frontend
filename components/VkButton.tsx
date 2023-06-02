import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { signIn } from 'next-auth/react';
import { Button } from 'antd';
import styles from '../styles/VkButton.module.css';
import { useRouter } from 'next/router';

const VkButton = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  return (
    <div className={styles.root}>
      <Button
        type="text"
        className={styles.btn}
        onClick={() =>
          signIn('vk', {
            callbackUrl: (router.query?.callbackUrl as string) || '/dashboard',
          })
        }
      >
        <Image
          src="https://authjs.dev/img/providers/vk.svg"
          height={32}
          width={32}
          alt=""
        />
        {t('login.vkAuth')}
      </Button>
    </div>
  );
};

export default VkButton;
