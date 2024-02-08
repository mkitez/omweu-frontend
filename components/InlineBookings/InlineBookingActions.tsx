import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

type Props = {
  booking: Booking;
};

const InlineBookingActions: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  if (booking.is_confirmed) {
    return <div>{t('status.confirmed')}</div>;
  }

  if (booking.response_timestamp) {
    return <div>{t('status.rejected')}</div>;
  }

  return (
    <div>
      <Button>
        <CheckCircleOutlined />
      </Button>{' '}
      <Button>
        <CloseCircleOutlined />
      </Button>
    </div>
  );
};

export default InlineBookingActions;
