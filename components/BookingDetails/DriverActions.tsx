import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  StatusCancelled,
  StatusConfirmed,
  StatusRejected,
} from '../BookingStatus';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

const DriverActions: React.FC<Props> = ({ booking }) => {
  const api = useBookingApi();
  const router = useRouter();
  const { t } = useTranslation('booking');

  const [isLoading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const refreshData = () => {
    return router.replace(router.asPath);
  };

  const getActionHandler = (callback: () => Promise<void>) => {
    return async () => {
      setLoading(true);
      await callback();
      await refreshData();
      setLoading(false);
    };
  };
  const confirmHandler = getActionHandler(() =>
    api.confirmBooking(booking.booking_id)
  );
  const rejectHandler = getActionHandler(() =>
    api.rejectBooking(booking.booking_id)
  );

  return (
    <div className={styles.driverActions}>
      {(() => {
        if (booking.state === 'CONFIRMED') {
          return <StatusConfirmed mode="driver" />;
        }
        if (booking.state === 'REJECTED') {
          return <StatusRejected mode="driver" />;
        }
        if (booking.state === 'CANCELLED') {
          return <StatusCancelled mode="driver" />;
        }
        return (
          <>
            <Button
              type="primary"
              disabled={isLoading}
              icon={<CheckCircleOutlined />}
              onClick={() => setConfirmModalOpen(true)}
            >
              {t('actions.confirm')}
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              disabled={isLoading}
              onClick={() => setRejectModalOpen(true)}
            >
              {t('actions.reject')}
            </Button>
            <Modal
              open={confirmModalOpen}
              title={t('modals.confirm.title')}
              okText={t('response.yes', { ns: 'common' })}
              cancelText={t('response.no', { ns: 'common' })}
              onOk={confirmHandler}
              confirmLoading={isLoading}
              onCancel={() => setConfirmModalOpen(false)}
            >
              {t('modals.confirm.body')}
            </Modal>
            <Modal
              open={rejectModalOpen}
              title={t('modals.reject.title')}
              okText={t('response.yes', { ns: 'common' })}
              cancelText={t('response.no', { ns: 'common' })}
              onOk={rejectHandler}
              confirmLoading={isLoading}
              onCancel={() => setRejectModalOpen(false)}
            >
              {t('modals.reject.body')}
            </Modal>
          </>
        );
      })()}
    </div>
  );
};

export default DriverActions;
