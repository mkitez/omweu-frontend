import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './BookingDetails.module.css';
import { useState } from 'react';

type Props = {
  booking: Booking;
};

const DriverActions: React.FC<Props> = ({ booking }) => {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const api = useBookingApi();
  const [isLoading, setLoading] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const getActionHandler = (callback: () => Promise<void>) => {
    return async () => {
      setLoading(true);
      await callback();
      refreshData();
      setLoading(false);
    };
  };

  return (
    <div className={styles.driverActions}>
      {(() => {
        if (booking.is_confirmed) {
          return (
            <div className={styles.confirmed}>
              <CheckCircleOutlined /> {t('status_driver.confirmed')}
            </div>
          );
        }
        if (booking.response_timestamp) {
          return (
            <div className={styles.rejected}>
              <CloseCircleOutlined /> {t('status_driver.rejected')}
            </div>
          );
        }
        return (
          <>
            <Button
              type="primary"
              loading={isLoading}
              icon={<CheckCircleOutlined />}
              onClick={getActionHandler(() =>
                api.confirmBooking(booking.booking_id)
              )}
            >
              {t('actions.confirm')}
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              loading={isLoading}
              onClick={getActionHandler(() =>
                api.rejectBooking(booking.booking_id)
              )}
            >
              {t('actions.reject')}
            </Button>
          </>
        );
      })()}
    </div>
  );
};

export default DriverActions;
