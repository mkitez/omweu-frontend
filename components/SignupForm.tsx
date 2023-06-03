import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { ReactNode, useState } from 'react';
import { Button, Form, Input, Alert, Divider } from 'antd';
import AuthService from '../services/auth.service';
import styles from '../styles/SignupForm.module.css';
import { useTranslation } from 'next-i18next';
import { RECAPTCHA_SITE_KEY } from '../utils/constants';

const ErrorBox = ({
  text,
  fieldsData,
}: {
  text: string;
  fieldsData: Record<string, string[]>;
}) => {
  return (
    <>
      <div>{text}</div>
      <ul>
        {Object.values(fieldsData).map((value, index) => (
          <li key={index}>{[value]}</li>
        ))}
      </ul>
    </>
  );
};

interface FormData {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  phone: string;
  captcha: string;
}

const SignupForm = () => {
  const { t, i18n } = useTranslation(['auth', 'common']);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ReactNode>(null);

  const onFinish = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    const { email, password, firstName, phone, captcha } = formData;
    try {
      await AuthService.signUp(
        {
          email,
          password,
          first_name: firstName,
          phone_number: phone,
          captcha,
        },
        i18n.language
      );
      setSuccess(true);
      form.resetFields();
    } catch (e) {
      setSuccess(false);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setError(
            <ErrorBox
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
          name="passwordConfirmation"
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
          name="firstName"
          label={t('registration.firstName')}
          rules={[
            { required: true, message: t('errors.enterName') as string },
            { max: 30, message: t('errors.longName') as string },
          ]}
        >
          <Input placeholder={t('registration.firstName') || ''} />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t('registration.phone')}
          rules={[
            { pattern: /\+\d+/, message: t('errors.numberFormat') as string },
            { max: 20, message: t('errors.longNumber') as string },
          ]}
        >
          <Input
            placeholder={`${t('registration.phone')} (${t(
              'registration.optionalField'
            )})`}
          />
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
