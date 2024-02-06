import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { Button } from 'antd';

type Props = {
  booking: Booking;
};

const DriverActions: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  if (booking.is_confirmed) {
    return <div>{t('status_driver.confirmed')}</div>;
  }

  if (booking.response_timestamp) {
    return <div>{t('status_driver.rejected')}</div>;
  }

  return (
    <div>
      <Button>{t('actions.confirm')}</Button>
      <Button>{t('actions.reject')}</Button>
    </div>
  );
};

export default DriverActions;
