import Link from 'next/link';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import styles from './InlineBooking.module.css';

type Props = {
  bookingId: string;
};

const BookingLink: React.FC<Props> = ({ bookingId }) => {
  const { t } = useTranslation('booking');

  return (
    <div className={styles.bookingLink}>
      <Link href={`/bookings/${bookingId}`}>
        <CalendarOutlined /> {t('view_booking_details')}
      </Link>
    </div>
  );
};

export default BookingLink;
