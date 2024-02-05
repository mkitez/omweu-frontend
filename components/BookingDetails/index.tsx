import { FC } from 'react';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useTranslation } from 'next-i18next';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import TripDetails from '../TripDetails';
import { useSession } from 'next-auth/react';

type Props = {
  booking: Booking;
};

const BookingStatus: FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  if (booking.is_confirmed) {
    return (
      <div>
        <CheckCircleOutlined /> {t('booking_confirmed')}
      </div>
    );
  }

  if (booking.response_timestamp) {
    return (
      <div>
        <CloseCircleOutlined /> {t('booking_rejected')}
      </div>
    );
  }

  return (
    <div>
      <QuestionCircleOutlined /> {t('booking_pending')}
    </div>
  );
};

const BookingDetails: FC<Props> = ({ booking }) => {
  const { data: session } = useSession();
  // TODO: move to custom hook
  const isDriver = booking.trip?.driver?.id === session?.user.id;

  return (
    <div>
      {!isDriver && <BookingStatus booking={booking} />}
      <TripDetails trip={booking.trip} />
    </div>
  );
};

export default BookingDetails;
