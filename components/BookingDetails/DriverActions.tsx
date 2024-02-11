import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useBookingApi } from '../../hooks/api/useBookingApi';

type Props = {
  booking: Booking;
};

const DriverActions: React.FC<Props> = ({ booking }) => {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const bookingApi = useBookingApi();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  if (booking.is_confirmed) {
    return <div>{t('status_driver.confirmed')}</div>;
  }

  if (booking.response_timestamp) {
    return <div>{t('status_driver.rejected')}</div>;
  }

  return (
    <div>
      <Button
        onClick={async () => {
          await bookingApi.confirmBooking(booking.booking_id);
          refreshData();
        }}
      >
        {t('actions.confirm')}
      </Button>
      <Button
        onClick={async () => {
          await bookingApi.rejectBooking(booking.booking_id);
          refreshData();
        }}
      >
        {t('actions.reject')}
      </Button>
    </div>
  );
};

export default DriverActions;
