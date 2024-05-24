import { Form, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import styles from '../styles/UserProfileForm.module.css';
import DriverPreferencesForm from './DriverPreferencesForm';

type Props = {
  shouldShowModal: boolean;
};

const DriverPreferencesModal: React.FC<Props> = ({ shouldShowModal }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setShowModal(shouldShowModal);
  }, [shouldShowModal]);

  const onSubmit = () => {
    setLoading(false);
    setShowModal(false);
  };

  return (
    <Modal
      title={t('driver_preferences.title')}
      width={800}
      open={showModal}
      onOk={() => {
        setLoading(true);
        form.submit();
      }}
      onCancel={() => setShowModal(false)}
      okText={t('driver_preferences.modal.ok')}
      cancelText={t('driver_preferences.modal.cancel')}
      okButtonProps={{ loading }}
    >
      <DriverPreferencesForm
        form={form}
        onSubmit={onSubmit}
        onError={onSubmit}
      />
      <div className={styles.helpText}>
        {t('driver_preferences.modal.add_later_text')}
      </div>
    </Modal>
  );
};

export default DriverPreferencesModal;
