import type { ReactElement } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { Session } from 'next-auth';
import { Form, Input, Button, Row, Col } from 'antd';
import { getServerSideProps } from './trips';
import withAuth from '../../components/withAuthHOC';
import { API_URL } from '../../utils/constants';
import api from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { useTranslation } from 'next-i18next';

const { Item } = Form;

interface FormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_username: string;
}

const Profile = ({ session }: { session: Session }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/users/${session.user.id}/`,
    async (url) => {
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      return response.data;
    }
  );
  const { t } = useTranslation(['dashboard', 'common']);

  const handleSubmit = async (formData: FormData) => {
    const url = `${API_URL}/users/${session.user.id}/`;
    await api.put(url, formData, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    await mutate();
  };

  if (error) {
    return <div>{t('errors.common', { ns: 'common' })}</div>;
  }

  if (isLoading) {
    return <div>{t('loading', { ns: 'common' })}</div>;
  }

  return (
    <>
      <h2>{t('profile.title')}</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={handleSubmit}
        initialValues={data}
      >
        <Item
          label={t('profile.email')}
          name="email"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 9 }}
        >
          <Input disabled />
        </Item>
        <Row>
          <Col span={12}>
            <Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={t('profile.firstName')}
              name="first_name"
            >
              <Input />
            </Item>
          </Col>
          <Col span={12}>
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
        <Row>
          <Col span={12}>
            <Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label={t('profile.phoneNumber')}
              name="phone_number"
            >
              <Input />
            </Item>
          </Col>
          <Col span={12}>
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
        {data.photo && (
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
        <Button htmlType="submit" type="primary">
          {t('save', { ns: 'common' })}
        </Button>
      </Form>
    </>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export { getServerSideProps };

export default withAuth(Profile);
