import { Form, message, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import api from '../services/api';

import { useDefaultHeaders } from '../hooks/useDefaultHeaders';
import styles from '../styles/UserProfileForm.module.css';
import DriverPreferencesFormFields, {
  defaultValues,
} from './UserProfileForm/DriverPreferencesFormFields';

type Props = {
  shouldShowModal: boolean;
};

const DriverPreferencesModal: React.FC<Props> = ({ shouldShowModal }) => {
  const { data: session } = useSession();
  const { t } = useTranslation(['dashboard', 'common']);
  const headers = useDefaultHeaders();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setShowModal(shouldShowModal);
  }, [shouldShowModal]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const url = `/users/${session?.user.id}/`;
    try {
      await api.put(url, formData, { headers });
      message.success(t('profile.changes_saved'));
    } catch (e) {
      message.error(t('errors.common', { ns: 'common' }) as string);
    }
    setLoading(false);
    setShowModal(false);
  };

  const initialValues = { driver_preferences: defaultValues };

  return (
    <Modal
      title={t('driver_preferences.title')}
      width={800}
      open={showModal}
      onOk={() => form.submit()}
      onCancel={() => setShowModal(false)}
      okText={t('driver_preferences.modal.ok')}
      cancelText={t('driver_preferences.modal.cancel')}
      okButtonProps={{ loading }}
    >
      <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
        <DriverPreferencesFormFields />
      </Form>
      <div className={styles.helpText}>
        {t('driver_preferences.modal.add_later_text')}
      </div>
    </Modal>
  );
};

export default DriverPreferencesModal;
