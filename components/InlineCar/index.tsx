import { theme } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useCallback } from 'react';

import { Car } from '../../services/car.service';

import styles from './InlineCar.module.css';

type Props = {
  car: Car;
  isClickable?: boolean;
};

const InlineCar: React.FC<Props> = ({ car, isClickable }) => {
  const { t } = useTranslation('car');
  const { token } = theme.useToken();

  const className = `${styles.root}${car.is_primary ? ` ${styles.primary}` : ''}`;
  const style = car.is_primary
    ? {
        border: `1px solid ${token.colorPrimary}`,
      }
    : undefined;

  const carModel = useCallback(() => {
    if (car.brand.name.toLowerCase() === 'other') {
      return t('unknown_model');
    }
    if (car.model.name.toLocaleLowerCase() === 'other') {
      return car.brand.name;
    }
    return `${car.brand.name} ${car.model.name}`;
  }, [t, car]);

  const rootElement = (
    <div className={className} style={style}>
      <div className={styles.topRow}>{carModel()}</div>
      <div className={styles.bottomRow}>
        {t(`colors.${car.color}`)} {car.year} {t('year_abbr')}
      </div>
    </div>
  );

  return isClickable ? (
    <Link href={`/caredit/${car.id}`}>{rootElement}</Link>
  ) : (
    rootElement
  );
};

export default InlineCar;
