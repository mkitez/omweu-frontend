import { useState } from 'react';
import { Alert, Button, Col, Form, Input, Row } from 'antd';
import { useTranslation, Trans } from 'next-i18next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginForm.module.css';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onFinish = async (formData: FormData) => {
    setError('');
    setLoading(true);
    const callbackUrl = (router.query?.callbackUrl as string) || '/dashboard';
    const { email, password } = formData;
    const authResponse = await signIn('email-password', {
      email,
      password,
      redirect: false,
    });
    if (authResponse?.ok) {
      router.replace(callbackUrl);
      return;
    }
    setLoading(false);
    if (authResponse?.status === 401) {
      setError(t('errors.badCredentials') as string);
    } else {
      setError(t('errors.common', { ns: 'common' }) as string);
    }
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        className={styles.root}
      >
        <Form.Item
          name="email"
          label={t('login.email')}
          rules={[
            { required: true, message: t('errors.enterEmail') as string },
            { type: 'email' },
          ]}
        >
          <Input placeholder={t('login.email') || ''} />
        </Form.Item>
        <Form.Item
          name="password"
          label={t('login.password')}
          rules={[
            { required: true, message: t('errors.enterPassword') as string },
          ]}
        >
          <Input.Password
            type="password"
            placeholder={t('login.password') || ''}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} className={styles.btnContainer}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('login.formButtonLabel')}
          </Button>
          <div className={styles.signup}>
            <Trans
              components={[
                <Link key={0} href="/signup">
                  x
                </Link>,
              ]}
            >
              {t('login.noAccount')}
            </Trans>
          </div>
        </Form.Item>
      </Form>
      {error && (
        <Row>
          <Col md={{ span: 16, offset: 4 }}>
            <Alert type="error" message={error} className={styles.error} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default LoginForm;
