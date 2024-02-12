import { useTranslation } from 'next-i18next';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Booking } from '../../pages/bookings/[bookingId]';

type Props = {
  booking: Booking;
};

export const BookingStatus: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  if (booking.is_confirmed) {
    return (
      <div>
        <CheckCircleOutlined /> {t('status.confirmed')}
      </div>
    );
  }

  if (booking.response_timestamp) {
    return (
      <div>
        <CloseCircleOutlined /> {t('status.rejected')}
      </div>
    );
  }

  return (
    <div>
      <QuestionCircleOutlined /> {t('status.pending')}
    </div>
  );
};
