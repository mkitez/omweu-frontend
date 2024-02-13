import Link from 'next/link';
import useSWR from 'swr';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import {
  CalendarOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styles from './InlineBooking.module.css';
import { useState } from 'react';

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
  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false);

  if (isLoading || error) {
    return null;
  }

  const bookingSubmitHandler = async () => {
    setBookingSubmitLoading(true);
    const bookingData = await bookingApi.submitBookingForTrip(tripId);
    await mutate(bookingData);
    setBookingSubmitLoading(false);
  };

  return (
    <div className={styles.root}>
      {(() => {
        if (!booking) {
          return (
            <Button
              icon={<CalendarOutlined />}
              type="primary"
              loading={bookingSubmitLoading}
              onClick={bookingSubmitHandler}
            >
              {t('book_trip')}
            </Button>
          );
        }

        const bookingLink = (
          <Link href={`/bookings/${booking.booking_id}`}>
            <CarryOutOutlined /> {t('view_booking_details')}
          </Link>
        );
        if (booking.is_confirmed) {
          return (
            <>
              <div className={styles.confirmed}>
                <CheckCircleOutlined /> {t('status.confirmed')}
              </div>
              <div className={styles.bookingLink}>{bookingLink}</div>
            </>
          );
        }

        return (
          <>
            {booking.response_timestamp ? (
              <div className={styles.rejected}>
                <CloseCircleOutlined /> {t('status.rejected')}
              </div>
            ) : (
              <div className={styles.pending}>
                <QuestionCircleOutlined /> {t('status.pending')}
              </div>
            )}
            <div className={styles.bookingLink}>{bookingLink}</div>
          </>
        );
      })()}
    </div>
  );
};

export default InlineBooking;
