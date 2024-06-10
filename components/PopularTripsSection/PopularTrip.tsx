import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import ArrowRight from '../../assets/arrow-right-svgrepo-com.svg';
import Pin from '../../assets/pin-svgrepo-com.svg';
import styles from './PopularTrip.module.css';

interface Props {
  originLabel: string;
  destLabel: string;
  link: string;
}

const PopularTrip: React.FC<Props> = ({ originLabel, destLabel, link }) => {
  const { t } = useTranslation('home');
  return (
    <>
      <div className={styles.destContainer}>
        <div className={styles.origin}>
          <div className={styles.pin}>
            <Pin />
          </div>
          {originLabel}
        </div>
        <div className={styles.arrow}>
          <ArrowRight />
        </div>
        <div>{destLabel}</div>
      </div>
      <div className={styles.btnContainer}>
        <Link href={link} passHref legacyBehavior>
          <Button type="primary">{t('sectionFour.findTrip')}</Button>
        </Link>
      </div>
    </>
  );
};

export default PopularTrip;
