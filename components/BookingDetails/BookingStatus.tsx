import { useTranslation } from 'next-i18next';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Booking } from '../../pages/bookings/[bookingId]';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

export const BookingStatus: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  return (
    <div className={styles.status}>
      {booking.state === 'CONFIRMED' && (
        <div className={styles.confirmed}>
          <CheckCircleOutlined /> {t('status.confirmed')}
        </div>
      )}
      {booking.state === 'REJECTED' && (
        <div className={styles.rejected}>
          <CloseCircleOutlined /> {t('status.rejected')}
        </div>
      )}
      {booking.state === 'PENDING' && (
        <div className={styles.pending}>
          <QuestionCircleOutlined /> {t('status_short.pending')}
        </div>
      )}
      {booking.state === 'CANCELLED' && (
        <div className={styles.cancelled}>
          <CloseCircleOutlined /> {t('status.cancelled')}
        </div>
      )}
    </div>
  );
};
