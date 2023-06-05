import { FC } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Location from '../../assets/location.svg';
import styles from '../../styles/PopularTrip.module.css';
import { useTranslation } from 'next-i18next';

interface Props {
  originLabel: string;
  destLabel: string;
  link: string;
}

const PopularTrip: FC<Props> = ({ originLabel, destLabel, link }) => {
  const { t } = useTranslation('home');
  return (
    <div className={styles.root}>
      <div className={styles.destContainer}>
        <div className={styles.location}>
          <Location height="100%" />
        </div>
        {originLabel}
        <div className={styles.arrow}>
          <ArrowRightOutlined />
        </div>
        {destLabel}
      </div>
      <div className={styles.btnContainer}>
        <Link href={link} passHref legacyBehavior>
          <Button type="primary">{t('sectionFour.findTrip')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default PopularTrip;
