import { Form, Input, Button, Alert } from 'antd';
import api from '../services/api';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import styles from '../styles/ContactDetailsForm.module.css';
import { useRouter } from 'next/router';

const { Item } = Form;

interface FormData {
  phone_number: string;
  telegram_username: string;
}

const ContactDetailsForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { t, i18n } = useTranslation(['dashboard', 'common']);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setLoading(true);
    const entries = Object.entries(formData).filter(([_, value]) => !!value);
    const url = `/users/${session?.user.id}/`;
    try {
      await api.put(url, Object.fromEntries(entries), {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Accept-Language': i18n.language,
        },
      });
      await router.push('/newtrip');
    } catch (e) {
      setError(t('errors.common', { ns: 'common' }) as string);
      setLoading(false);
    }
  };

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
        <Item
          label={t('profile.phoneNumber')}
          name="phone_number"
          dependencies={['telegram_username']}
          rules={[
            { pattern: /\+\d+/, message: t('errors.numberFormat') as string },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value || getFieldValue('telegram_username')) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('errors.enterContacts') as string)
                );
              },
            }),
          ]}
        >
          <Input placeholder={t('profile.phoneNumber') as string} />
        </Item>
        <Item label={t('profile.telegram')} name="telegram_username">
          <Input placeholder={t('profile.telegramPlaceholder') as string} />
        </Item>
        <Item wrapperCol={{ span: 24 }} className={styles.btnContainer}>
          <Button htmlType="submit" type="primary" loading={loading}>
            {t('addContacts.saveAndContinue')}
          </Button>
        </Item>
      </Form>
      {error && <Alert type="error" message={error} />}
    </>
  );
};

export default ContactDetailsForm;
