import { Button, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import styles from './BookingDetails.module.css';
import { useState } from 'react';

type Props = {
  booking: Booking;
};

const PassengerActions: React.FC<Props> = ({ booking }) => {
  const api = useBookingApi();
  const router = useRouter();
  const { t } = useTranslation(['booking', 'common']);

  const [modalOpen, setModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const cancelBooking = async () => {
    setCancelLoading(true);
    await api.cancelBooking(booking.booking_id);
    router.push(`/trips/${booking.trip.id}`);
    setCancelLoading(false);
  };

  if (booking.response_timestamp) {
    return null;
  }

  return (
    <div className={styles.cancelBtnContainer}>
      <Button icon={<CloseCircleOutlined />} onClick={() => setModalOpen(true)}>
        {t('actions.cancel')}
      </Button>
      <Modal
        open={modalOpen}
        title={t('modals.cancel.title')}
        okText={t('response.yes', { ns: 'common' })}
        cancelText={t('response.no', { ns: 'common' })}
        onOk={cancelBooking}
        confirmLoading={cancelLoading}
        onCancel={() => setModalOpen(false)}
      >
        {t('modals.cancel.body')}
      </Modal>
    </div>
  );
};

export default PassengerActions;
