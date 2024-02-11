import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';

type Props = {
  booking: Booking;
};

const InlineBookingStatus: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  if (booking.is_confirmed) {
    return <div>{t('status_short.confirmed')}</div>;
  }

  if (booking.response_timestamp) {
    return <div>{t('status_short.rejected')}</div>;
  }

  return <div>{t('status_short.pending')}</div>;
};

export default InlineBookingStatus;
