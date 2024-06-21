import { Button, Col, Form, Input, message, Row } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useUserApi } from '../../hooks/api/useUserApi';
import AvatarUpload from '../AvatarUpload';
import { DriverPreferences, User } from '../Trips';
import CarsSection from './CarsSection';
import DriverPreferencesFormFields from './DriverPreferencesFormFields';
import styles from './UserProfileForm.module.css';

const { Item } = Form;

export interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  whatsapp_number: string;
  telegram_username: string;
  driver_preferences: DriverPreferences | null;
  about: string;
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
      <AvatarUpload initialImageUrl={data.photo} onUpload={onSubmit} />
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
            rules={[{ required: true }]}
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
      <Row gutter={10}>
        <Col xs={24} lg={12}>
          <Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label={t('profile.whatsapp')}
            name="whatsapp_number"
          >
            <Input />
          </Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Item
            name="about"
            label={t('profile.about')}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
          >
            <Input.TextArea
              maxLength={300}
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder={t('profile.aboutPlaceholder') as string}
              showCount
              className={styles.aboutInput}
            />
          </Item>
        </Col>
      </Row>
      <h3>{t('driver_preferences.title')}</h3>
      <DriverPreferencesFormFields />
      <CarsSection cars={data.cars} />
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
