import Image from 'next/image';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import api from '../services/api';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { User } from './Trips';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import DriverPreferencesFormFields from './DriverPreferencesFormFields';
import styles from '../styles/UserProfileForm.module.css';

const { Item } = Form;

interface FormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_username: string;
}

interface Props {
  data: User;
  onSubmit?: () => Promise<unknown>;
}

const UserProfileForm: React.FC<Props> = ({ data, onSubmit }) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setLoading(true);
    const url = `/users/${session?.user.id}/`;
    try {
      await api.put(url, formData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Accept-Language': i18n.language,
        },
      });
    } catch (e) {
      setError(t('errors.common', { ns: 'common' }) as string);
    }
    setLoading(false);
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
        initialValues={data}
        disabled={loading}
        className={styles.root}
      >
        <Row>
          <Col xs={24} lg={12}>
            <Item
              label={t('profile.email')}
              name="email"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input disabled />
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} lg={12}>
            <Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={t('profile.firstName')}
              name="first_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
          </Col>
          <Col xs={24} lg={12}>
            <Item
              label={t('profile.lastName')}
              name="last_name"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input />
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} lg={12}>
            <Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={t('profile.phoneNumber')}
              name="phone_number"
            >
              <Input />
            </Item>
          </Col>
          <Col xs={24} lg={12}>
            <Item
              label={t('profile.telegram')}
              name="telegram_username"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input />
            </Item>
          </Col>
        </Row>
        <h3>{t('driver_preferences.title')}</h3>
        <DriverPreferencesFormFields data={data.driver_preferences} />
        {data?.photo && (
          <Row>
            <Col
              offset={3}
              style={{
                marginBottom: 24,
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            >
              <Image
                src={data.photo}
                alt="user photo"
                width={100}
                height={100}
              />
            </Col>
          </Row>
        )}
        <Row gutter={[10, 10]}>
          <Col>
            <Button htmlType="submit" type="primary">
              {t('save', { ns: 'common' })}
            </Button>
          </Col>
          <Col>
            <Button loading={loading} onClick={() => router.back()}>
              {t('cancel', { ns: 'common' })}
            </Button>
          </Col>
        </Row>
      </Form>
      {error && <Alert type="error" message={error} />}
    </>
  );
};

export default UserProfileForm;
