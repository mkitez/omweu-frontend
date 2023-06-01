import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'next-i18next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (formData: FormData) => {
    setLoading(true);
    const callbackUrl = (router.query?.callbackUrl as string) || '/dashboard';
    const { email, password } = formData;
    const authResponse = await signIn('email-password', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (authResponse?.ok) {
      router.replace(callbackUrl);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 10 }}
    >
      <Form.Item
        name="email"
        label={t('login.email')}
        rules={[
          { required: true, message: t('errors.enterEmail') as string },
          { type: 'email' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label={t('login.password')}
        rules={[
          { required: true, message: t('errors.enterPassword') as string },
        ]}
      >
        <Input.Password type="password" />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t('login.formButtonLabel')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
