import Link from 'next/link';
import { ExportOutlined } from '@ant-design/icons';
import styles from './BookingDetails.module.css';
import { useTranslation } from 'next-i18next';

type Props = {
  tripId: number;
};

const TripLink: React.FC<Props> = ({ tripId }) => {
  const { t } = useTranslation('booking');

  const tripPath = `/trips/${tripId}`;
  return (
    <div className={styles.tripLinkContainer}>
      <Link href={tripPath}>
        <ExportOutlined /> {t('go_to_trip')}
      </Link>
    </div>
  );
};

export default TripLink;
