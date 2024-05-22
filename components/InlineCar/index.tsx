import { theme } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { CSSProperties, useCallback } from 'react';

import { Car } from '../../services/car.service';

import type { InlineCar } from '../Trips';
import styles from './InlineCar.module.css';

type Props = {
  car: Car | InlineCar;
  showYear?: boolean;
  showType?: boolean;
  isClickable?: boolean;
};

const InlineCar: React.FC<Props> = ({
  car,
  showYear,
  showType,
  isClickable,
}) => {
  const { t } = useTranslation('car');
  const { token } = theme.useToken();

  let className = styles.root;
  let style: CSSProperties | undefined;
  if ('is_primary' in car && car.is_primary) {
    className += ` ${styles.primary}`;
    style = {
      border: `1px solid ${token.colorPrimary}`,
    };
  }

  const carModel = useCallback(() => {
    if (car.brand.name.toLowerCase() === 'other') {
      return t('unknown_model');
    }
    if (car.model.name.toLocaleLowerCase() === 'other') {
      return car.brand.name;
    }
    return `${car.brand.name} ${car.model.name}`;
  }, [t, car]);

  let bottomRowContent = t(`colors.${car.color}`);
  if (showType) {
    bottomRowContent += ` ${t(`body_types.${car.body_type.toString().toLowerCase()}`).toLowerCase()}`;
  }
  if (showYear) {
    bottomRowContent += ` ${car.year} ${t('year_abbr')}`;
  }

  const rootElement = (
    <div className={className} style={style}>
      <div className={styles.topRow}>{carModel()}</div>
      <div className={styles.bottomRow}>{bottomRowContent}</div>
    </div>
  );

  return isClickable && 'id' in car ? (
    <Link href={`/caredit/${car.id}`} className={styles.link}>
      {rootElement}
    </Link>
  ) : (
    rootElement
  );
};

export default InlineCar;
