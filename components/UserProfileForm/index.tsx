import { Button, Col, Form, Input, message, Row } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useUserApi } from '../../hooks/api/useUserApi';
import AvatarUpload from '../AvatarUpload';
import DriverPreferencesFormFields from '../DriverPreferencesFormFields';
import { DriverPreferences, User } from '../Trips';
import styles from './UserProfileForm.module.css';

const { Item } = Form;

export interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_username: string;
  driver_preferences: DriverPreferences | null;
}

interface Props {
  data: User;
  onSubmit?: () => Promise<unknown>;
}

const UserProfileForm: React.FC<Props> = ({ data, onSubmit }) => {
  const router = useRouter();
  const api = useUserApi();
  const { t } = useTranslation(['dashboard', 'common']);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: UserFormData) => {
    const { email: _, ...dataToSubmit } = formData;
    setLoading(true);
    try {
      await api.updateSelf(dataToSubmit);
      message.success(t('profile.changes_saved'));
    } catch (e) {
      message.error(t('errors.common', { ns: 'common' }));
    }
    setLoading(false);
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
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
      <AvatarUpload initialImageUrl={data.photo} onUpload={onSubmit} />
      <h3>{t('driver_preferences.title')}</h3>
      <DriverPreferencesFormFields />
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
  );
};

export default UserProfileForm;
