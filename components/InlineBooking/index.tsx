import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { CalendarOutlined } from '@ant-design/icons';
import {
  StatusConfirmed,
  StatusPending,
  StatusRejected,
} from '../BookingStatus';
import styles from './InlineBooking.module.css';

type Props = {
  tripId: number;
};

const InlineBooking: React.FC<Props> = ({ tripId }) => {
  const api = useBookingApi();
  const { t } = useTranslation('booking');
  const fetcher = useAuthorizedFetcher();
  const {
    data: booking,
    error,
    isLoading,
    mutate,
  } = useSWR<Booking>(`/trips/${tripId}/booking/`, fetcher);

  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading || error) {
    return null;
  }

  const bookingSubmitHandler = async () => {
    setBookingSubmitLoading(true);
    const bookingData = await api.submitBookingForTrip(tripId);
    setModalOpen(false);
    await mutate(bookingData);
    setBookingSubmitLoading(false);
  };

  return (
    <div className={styles.root}>
      {booking ? (
        <>
          {booking.state === 'CONFIRMED' && <StatusConfirmed />}
          {booking.state === 'REJECTED' && <StatusRejected />}
          {booking.state === 'PENDING' && <StatusPending />}
          <div className={styles.bookingLink}>
            <Link href={`/bookings/${booking.booking_id}`}>
              <CalendarOutlined /> {t('view_booking_details')}
            </Link>
          </div>
        </>
      ) : (
        <Button
          icon={<CalendarOutlined />}
          type="primary"
          disabled={bookingSubmitLoading}
          onClick={() => setModalOpen(true)}
        >
          {t('book_trip')}
        </Button>
      )}
      <Modal
        open={modalOpen}
        title={t('modals.book.title')}
        okText={t('response.yes', { ns: 'common' })}
        cancelText={t('response.no', { ns: 'common' })}
        onOk={bookingSubmitHandler}
        confirmLoading={bookingSubmitLoading}
        onCancel={() => setModalOpen(false)}
      >
        {t('modals.book.body')}
      </Modal>
    </div>
  );
};

export default InlineBooking;
