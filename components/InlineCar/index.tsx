import { theme } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Car } from '../../services/car.service';

import styles from './InlineCar.module.css';

type Props = {
  car: Car;
  isClickable?: boolean;
};

const InlineCar: React.FC<Props> = ({ car, isClickable }) => {
  const { t } = useTranslation('car');
  const { token } = theme.useToken();
  const rootElement = (
    <div
      className={`${styles.root}${car.is_primary ? ` ${styles.primary}` : ''}`}
      style={
        car.is_primary
          ? {
              border: `1px solid ${token.colorPrimary}`,
            }
          : undefined
      }
    >
      <div className={styles.topRow}>
        {car.brand.name} {car.model.name}
      </div>
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
