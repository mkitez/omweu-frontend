import { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

const PassengerActions: React.FC<Props> = ({ booking }) => {
  const api = useBookingApi();
  const router = useRouter();
  const { t } = useTranslation(['booking', 'common']);

  const [modalOpen, setModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  if (booking.state !== 'PENDING') {
    return null;
  }

  const refreshData = () => {
    return router.replace(router.asPath);
  };

  const cancelBooking = async () => {
    setCancelLoading(true);
    await api.cancelBooking(booking.booking_id, {
      cancellationReason,
    });
    await refreshData();
    setCancelLoading(false);
  };

  return (
    <div className={styles.cancelBtnContainer}>
      <Button icon={<CloseCircleOutlined />} onClick={() => setModalOpen(true)}>
        {t('actions.cancel')}
      </Button>
      <Modal
        open={modalOpen}
        title={t('modals.cancel.title')}
        okText={t('modals.cancel.confirm')}
        cancelText={t('modals.cancel.dismiss')}
        okButtonProps={{ disabled: cancellationReason === '' }}
        onOk={cancelBooking}
        confirmLoading={cancelLoading}
        onCancel={() => setModalOpen(false)}
      >
        <p>{t('modals.cancel.body')}</p>
        <Input.TextArea
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          placeholder={t('modals.cancel.placeholder') as string}
          autoSize={{ minRows: 3, maxRows: 5 }}
          maxLength={300}
        />
      </Modal>
    </div>
  );
};

export default PassengerActions;
