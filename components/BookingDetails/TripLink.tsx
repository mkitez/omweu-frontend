import { ExportOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import styles from './BookingDetails.module.css';

type Props = {
  tripSlug: string;
};

const TripLink: React.FC<Props> = ({ tripSlug }) => {
  const { t } = useTranslation('booking');

  const tripPath = `/trips/${tripSlug}`;
  return (
    <div className={styles.tripLinkContainer}>
      <Link href={tripPath}>
        <ExportOutlined /> {t('go_to_trip')}
      </Link>
    </div>
  );
};

export default TripLink;
