import { useTranslation } from 'next-i18next';
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import styles from './BookingStatus.module.css';

type Props = {
  mode?: 'short' | 'driver';
};

export const StatusPending: React.FC<Props> = ({ mode }) => {
  const { t } = useTranslation('booking');

  const translationKey = `status${mode ? `_${mode}` : ''}.pending`;
  return (
    <div className={styles.pending}>
      <QuestionCircleOutlined /> {t(translationKey)}
    </div>
  );
};

export const StatusConfirmed: React.FC<Props> = ({ mode }) => {
  const { t } = useTranslation('booking');

  const translationKey = `status${mode ? `_${mode}` : ''}.confirmed`;
  return (
    <div className={styles.confirmed}>
      <CheckCircleOutlined /> {t(translationKey)}
    </div>
  );
};

export const StatusRejected: React.FC<Props> = ({ mode }) => {
  const { t } = useTranslation('booking');

  const translationKey = `status${mode ? `_${mode}` : ''}.rejected`;
  return (
    <div className={styles.rejected}>
      <CloseCircleOutlined /> {t(translationKey)}
    </div>
  );
};

export const StatusCancelled: React.FC<Props> = ({ mode }) => {
  const { t } = useTranslation('booking');

  const translationKey = `status${mode ? `_${mode}` : ''}.cancelled`;
  return (
    <div className={styles.cancelled}>
      <CloseCircleOutlined /> {t(translationKey)}
    </div>
  );
};
