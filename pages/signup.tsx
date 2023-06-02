import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { ReactNode, useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import AuthService from '../services/auth.service';
import styles from '../styles/Register.module.css';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
  captcha: string;
}

const Register = () => {
  const { t, i18n } = useTranslation(['auth', 'common']);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ReactNode>(null);

  const onFinish = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    const { email, password, captcha } = formData;
    try {
      await AuthService.signUp({ email, password, captcha }, i18n.language);
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
        }
      } else {
        setError(t('errors.common', { ns: 'common' }) as string);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.root}>
        <h1>{t('registration.title')}</h1>
        <Form
          form={form}
          onFinish={onFinish}
          className={styles.form}
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
            <Input />
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
            <Input.Password type="password" />
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
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="captcha"
            initialValue={null}
            rules={[
              { required: true, message: t('errors.solveCaptcha') as string },
            ]}
            wrapperCol={{ xs: 24, sm: { offset: 8, span: 16 } }}
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
        {error && (
          <Alert className={styles.alert} type="error" message={error} />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'auth',
    'common',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default Register;
