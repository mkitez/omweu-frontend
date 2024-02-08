import useSWR from 'swr';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import api from '../../services/api';
import { Button } from 'antd';
import Link from 'next/link';

type Props = {
  tripId: number;
};

const InlineBooking: React.FC<Props> = ({ tripId }) => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation('booking');
  const {
    data: booking,
    error,
    isLoading,
  } = useSWR<Booking>(`/trips/${tripId}/booking/`, async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  });

  if (isLoading || error) {
    return null;
  }

  if (!booking) {
    return <Button type="primary">{t('book_trip')}</Button>;
  }

  const bookingLink = (
    <Link href={`/bookings/${booking.booking_id}`}>
      {t('view_booking_details')}
    </Link>
  );
  if (booking.is_confirmed) {
    return (
      <div>
        {t('status.confirmed')}
        <div>{bookingLink}</div>
      </div>
    );
  }

  return (
    <div>
      {booking.response_timestamp ? (
        <div>{t('status.rejected')}</div>
      ) : (
        <Button>{t('actions.cancel')}</Button>
      )}
      <div>{bookingLink}</div>
    </div>
  );
};

export default InlineBooking;
