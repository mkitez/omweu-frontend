import { Alert, Button, Form, Input, message } from 'antd';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { useUserApi } from '../hooks/api/useUserApi';
import styles from '../styles/ContactDetailsForm.module.css';

const { Item } = Form;

interface UpdateUserFormData {
  email?: string;
  phone_number: string;
  whatsapp_number: string;
  telegram_username: string;
}

type Props = {
  updateEmail?: boolean;
  onSubmit?: () => void;
};

const ContactDetailsForm: React.FC<Props> = ({ updateEmail, onSubmit }) => {
  const userApi = useUserApi();
  const [form] = Form.useForm<UpdateUserFormData>();
  const { t } = useTranslation(['dashboard', 'common']);

  const [loading, setLoading] = useState(false);
  const [showEmailSentAlert, setShowEmailSentAlert] = useState(false);

  const handleSubmit = async (formData: UpdateUserFormData) => {
    setLoading(true);
    const entries = Object.entries(formData).filter(([_, value]) => !!value);
    const data = Object.fromEntries(entries);
    try {
      await userApi.updateSelf(data);
      if (updateEmail) {
        setShowEmailSentAlert(true);
      } else {
        onSubmit && onSubmit();
      }
    } catch (e) {
      message.error(t('errors.common', { ns: 'common' }));
    }
    setLoading(false);
  };

  if (showEmailSentAlert) {
    return (
      <Alert
        type="success"
        showIcon
        message={t('addContacts.emailUpdatedTitle')}
        description={t('addContacts.emailUpdatedBody')}
      />
    );
  }

  return (
    <>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmit}
        disabled={loading}
        className={styles.root}
        form={form}
      >
        {updateEmail && (
          <Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input placeholder="Email" />
          </Item>
        )}
        <Item
          label={t('profile.phoneNumber')}
          name="phone_number"
          dependencies={['telegram_username']}
          rules={[
            { required: true },
            { pattern: /\+\d+/, message: t('errors.numberFormat') as string },
          ]}
        >
          <Input placeholder={t('profile.phoneNumber') as string} />
        </Item>
        <Item label={t('profile.telegram')} name="telegram_username">
          <Input placeholder={t('profile.telegramPlaceholder') as string} />
        </Item>
        <Item label={t('profile.whatsapp')} name="whatsapp_number">
          <Input placeholder={t('profile.whatsapp') as string} />
        </Item>
        <Item wrapperCol={{ span: 24 }} className={styles.btnContainer}>
          <Button htmlType="submit" type="primary" loading={loading}>
            {t('addContacts.saveAndContinue')}
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default ContactDetailsForm;
