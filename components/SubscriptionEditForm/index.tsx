import { App, Button, Col, DatePicker, Form, message, Row } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useSubscriptionApi } from '../../hooks/api/useSubscriptionsApi';
import { PlaceInputEdit } from '../PlaceInput';
import styles from './SubscriptionEditForm.module.css';

interface SubscriptionFormData {
  origin: DefaultOptionType;
  destination: DefaultOptionType;
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
}

const SubscriptionEditForm: React.FC<{}> = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const router = useRouter();
  const [form] = Form.useForm<SubscriptionFormData>();
  const api = useSubscriptionApi();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: SubscriptionFormData) => {
    const { origin, destination, start_date, end_date } = data;
    if (!origin.value || !destination.value) {
      return;
    }
    setLoading(true);
    const dateFormat = 'YYYY-MM-DD';
    try {
      await api.createSubscription({
        origin_id: String(origin.value),
        destination_id: String(destination.value),
        start_date: start_date.format(dateFormat),
        end_date: end_date.format(dateFormat),
      });
      message.success(t('notifications.new_subscription'));
      router.push('/dashboard/subscriptions');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.helpText}>{t('subscriptions.creation_help')}</div>
      <Form
        form={form}
        requiredMark={false}
        onFinish={handleSubmit}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="origin"
          label={t('subscriptions.labels.origin')}
          rules={[{ required: true }]}
        >
          <PlaceInputEdit placeholder={t('subscriptions.labels.origin')} />
        </Form.Item>
        <Form.Item
          name="destination"
          label={t('subscriptions.labels.destination')}
          rules={[{ required: true }]}
        >
          <PlaceInputEdit placeholder={t('subscriptions.labels.destination')} />
        </Form.Item>
        <Form.Item
          name="start_date"
          label={t('subscriptions.labels.start_date')}
          rules={[{ required: true }]}
        >
          <DatePicker
            allowClear={false}
            inputReadOnly
            disabledDate={(current) =>
              current &&
              (current < dayjs().startOf('day') ||
                current > dayjs().add(1, 'year'))
            }
            format="ll"
          />
        </Form.Item>
        <Form.Item
          name="end_date"
          label={t('subscriptions.labels.end_date')}
          rules={[{ required: true }]}
        >
          <DatePicker
            allowClear={false}
            inputReadOnly
            disabledDate={(current) => {
              if (!current) {
                return false;
              }
              const startDate = form.getFieldValue('start_date');
              return (
                current < startDate ||
                current > startDate.add(3, 'day').startOf('day')
              );
            }}
            format="ll"
          />
        </Form.Item>
        <Row gutter={[10, 10]}>
          <Col lg={{ offset: 4 }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('subscriptions.create')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default SubscriptionEditForm;
