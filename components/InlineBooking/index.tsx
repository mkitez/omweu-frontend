import Link from 'next/link';
import useSWR from 'swr';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { useBookingApi } from '../../hooks/api/useBookingApi';

type Props = {
  tripId: number;
};

const InlineBooking: React.FC<Props> = ({ tripId }) => {
  const { t } = useTranslation('booking');
  const fetcher = useAuthorizedFetcher();
  const {
    data: booking,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking>(`/trips/${tripId}/booking/`, fetcher);
  const bookingApi = useBookingApi();

  if (isLoading || error) {
    return null;
  }

  if (!booking) {
    return (
      <Button
        type="primary"
        onClick={async () => {
          const bookingData = await bookingApi.submitBookingForTrip(tripId);
          mutate(bookingData);
        }}
      >
        {t('book_trip')}
      </Button>
    );
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
        <Button
          onClick={async () => {
            const bookingData = await bookingApi.cancelBooking(
              booking.booking_id
            );
            mutate(bookingData);
          }}
        >
          {t('actions.cancel')}
        </Button>
      )}
      <div>{bookingLink}</div>
    </div>
  );
};

export default InlineBooking;
