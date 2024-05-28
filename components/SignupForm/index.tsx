import { Alert, Button, DatePicker, Divider, Form, Input } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { ReactNode, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useUserApi } from '../../hooks/api/useUserApi';
import { RECAPTCHA_SITE_KEY } from '../../utils/constants';
import ErrorContainer from './ErrorContainer';
import styles from './SignupForm.module.css';

const dateFormats: Record<string, string> = {
  ru: 'DD.MM.YYYY',
};

interface UserFormData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name?: string;
  birth_date: string;
  phone_number: string;
  captcha: string;
}

const SignupForm: React.FC = () => {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const userApi = useUserApi();

  const [form] = Form.useForm<UserFormData>();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ReactNode>(null);

  const onFinish = async (formData: UserFormData) => {
    const { birth_date, password_confirmation, ...data } = formData;
    const birthDateFormatted = dayjs(
      birth_date,
      dateFormats[i18n.language]
    ).format('YYYY-MM-DD');
    setError(null);
    setLoading(true);
    try {
      await userApi.createUser({
        ...data,
        birth_date: birthDateFormatted,
      });
      setSuccess(true);
      form.resetFields();
    } catch (e) {
      setSuccess(false);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setError(
            <ErrorContainer
              text={t('errors.problemsWithFields')}
              fieldsData={e.response?.data}
            />
          );
        } else {
          setError(t('errors.common', { ns: 'common' }) as string);
        }
      }
    }
    setLoading(false);
  };
  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        className={styles.root}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="email"
          label={t('registration.email')}
          rules={[
            { required: true, message: t('errors.enterEmail') as string },
            { type: 'email' },
          ]}
        >
          <Input placeholder={t('registration.email') || ''} />
        </Form.Item>
        <Form.Item
          name="password"
          label={t('registration.password')}
          rules={[
            { required: true, message: t('errors.enterPassword') as string },
            {
              min: 8,
              message: t('errors.shortPassword', { len: 8 }) as string,
            },
          ]}
        >
          <Input.Password placeholder={t('registration.password') || ''} />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label={t('registration.confirmPassword')}
          rules={[
            { required: true, message: t('errors.enterPassword') as string },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('errors.passwordsDoNotMatch') as string)
                );
              },
            }),
          ]}
          dependencies={['password']}
        >
          <Input.Password placeholder={t('registration.password') || ''} />
        </Form.Item>
        <Divider />
        <Form.Item
          name="first_name"
          label={t('registration.firstName')}
          rules={[
            { required: true, message: t('errors.enterName') as string },
            { max: 30, message: t('errors.longName') as string },
          ]}
        >
          <Input placeholder={t('registration.firstName') || ''} />
        </Form.Item>
        <Form.Item
          name="last_name"
          label={t('registration.lastName')}
          rules={[{ max: 30, message: t('errors.longLastName') as string }]}
        >
          <Input placeholder={t('registration.lastName') || ''} />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label={t('registration.phone')}
          rules={[
            { pattern: /\+\d+/, message: t('errors.numberFormat') as string },
            { max: 20, message: t('errors.longNumber') as string },
            { required: true, message: t('errors.enterNumber') as string },
          ]}
        >
          <Input placeholder={t('registration.phone') || ''} />
        </Form.Item>
        <Form.Item
          name="birth_date"
          label={t('registration.birthDate')}
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const date = dayjs(value, dateFormats[i18n.language], true);
                if (!date.isValid()) {
                  return Promise.reject(
                    new Error(
                      `${t('errors.dateFormat')}: ${t('registration.birthDateFormat')}`
                    )
                  );
                }
                const diff = dayjs().diff(date, 'year');
                if (diff < 18) {
                  return Promise.reject(
                    new Error(t('errors.dateValueLow') as string)
                  );
                }
                if (diff > 100) {
                  return Promise.reject(
                    new Error(t('errors.dateValueHigh') as string)
                  );
                }
                return Promise.resolve();
              },
            }),
            { required: true, message: t('errors.enterBirthDate') as string },
          ]}
          validateTrigger={['onBlur']}
        >
          <Input placeholder={t('registration.birthDateFormat') as string} />
        </Form.Item>
        <Form.Item
          name="captcha"
          initialValue={null}
          rules={[
            { required: true, message: t('errors.solveCaptcha') as string },
          ]}
          wrapperCol={{ xs: 24, sm: { offset: 8 } }}
        >
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY as string}
            onChange={(value) => form.setFieldValue('captcha', value)}
            className={styles.captchaContainer}
            hl={i18n.language}
          />
        </Form.Item>
        <Form.Item
          className={styles.submitButtonContainer}
          wrapperCol={{ span: 24 }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('registration.formButtonLabel')}
          </Button>
        </Form.Item>
      </Form>
      {success && (
        <Alert
          className={styles.alert}
          type="success"
          message={t('registration.success')}
        />
      )}
      {error && <Alert className={styles.alert} type="error" message={error} />}
    </>
  );
};

export default SignupForm;
