import { CalendarOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import useSWR from 'swr';

import { useBookingApi } from '../../hooks/api/useBookingApi';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { Booking } from '../../pages/bookings/[bookingId]';
import {
  StatusConfirmed,
  StatusPending,
  StatusRejected,
} from '../BookingStatus';
import BookingLink from './BookingLink';
import styles from './InlineBooking.module.css';

type Props = {
  tripId: number;
  disabled?: boolean;
};

const InlineBooking: React.FC<Props> = ({ tripId, disabled }) => {
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
  const [bookingMessage, setBookingMessage] = useState('');

  if (isLoading || error) {
    return null;
  }

  const bookingSubmitHandler = async () => {
    setBookingSubmitLoading(true);
    const bookingData = await api.submitBookingForTrip(tripId, {
      bookingMessage,
    });
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
          <BookingLink bookingId={booking.booking_id} />
        </>
      ) : (
        <Button
          icon={<CalendarOutlined />}
          type="primary"
          disabled={bookingSubmitLoading || disabled}
          onClick={() => setModalOpen(true)}
        >
          {t('book_trip')}
        </Button>
      )}
      <Modal
        open={modalOpen}
        title={t('modals.book.title')}
        okText={t('modals.book.confirm')}
        cancelText={t('modals.book.dismiss')}
        onOk={bookingSubmitHandler}
        confirmLoading={bookingSubmitLoading}
        onCancel={() => setModalOpen(false)}
      >
        <p>{t('modals.book.body')}</p>
        <Input.TextArea
          value={bookingMessage}
          onChange={(e) => setBookingMessage(e.target.value)}
          placeholder={t('modals.book.placeholder') as string}
          autoSize={{ minRows: 3, maxRows: 5 }}
          maxLength={300}
        />
      </Modal>
    </div>
  );
};

export default InlineBooking;
