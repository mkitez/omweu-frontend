import Link from 'next/link';
import useSWR from 'swr';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import {
  CalendarOutlined,
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
      {(() => {
        if (!booking) {
          return (
            <Button
              icon={<CalendarOutlined />}
              type="primary"
              disabled={bookingSubmitLoading}
              onClick={() => setModalOpen(true)}
            >
              {t('book_trip')}
            </Button>
          );
        }

        const bookingLink = (
          <Link href={`/bookings/${booking.booking_id}`}>
            <CalendarOutlined /> {t('view_booking_details')}
          </Link>
        );
        if (booking.state === 'CONFIRMED') {
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
            {booking.state === 'REJECTED' && (
              <div className={styles.rejected}>
                <CloseCircleOutlined /> {t('status.rejected')}
              </div>
            )}
            {booking.state === 'PENDING' && (
              <div className={styles.pending}>
                <QuestionCircleOutlined /> {t('status.pending')}
              </div>
            )}
            <div className={styles.bookingLink}>{bookingLink}</div>
          </>
        );
      })()}
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
