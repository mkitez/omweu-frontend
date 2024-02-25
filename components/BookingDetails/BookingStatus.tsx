import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import {
  StatusPending,
  StatusConfirmed,
  StatusRejected,
  StatusCancelled,
} from '../BookingStatus';
import CancelRejectReason from './CancelRejectReason';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

export const BookingStatus: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  return (
    <div className={styles.status}>
      {booking.state === 'PENDING' && <StatusPending mode="short" />}
      {booking.state === 'CONFIRMED' && <StatusConfirmed />}
      {booking.state === 'REJECTED' && (
        <>
          <StatusRejected />
          <CancelRejectReason
            label={t('rejection_reason.show')}
            title={t('rejection_reason.title')}
            content={booking.rejection_reason}
          />
        </>
      )}
      {booking.state === 'CANCELLED' && (
        <>
          <StatusCancelled />
          <CancelRejectReason
            label={t('cancellation_reason.show')}
            title={t('cancellation_reason.title')}
            content={booking.cancellation_reason}
          />
        </>
      )}
    </div>
  );
};
