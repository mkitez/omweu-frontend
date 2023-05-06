import { useState } from 'react';
import { Button, Form, Row, Col } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
import { Destination } from './Trips';
import dayjs from 'dayjs';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'next-i18next';

export interface FormData {
  from: DefaultOptionType;
  to: DefaultOptionType;
  date: dayjs.Dayjs;
}

const getInitialPlaceValue = (place: Destination): DefaultOptionType | null => {
  if (!place) {
    return null;
  }
  return {
    value: place.place_id,
    label: `${place.name}, ${place.country_name}`,
  };
};

const TripEditForm = ({
  initialOrigin,
  initialDest,
  initialDate,
  submitValue,
  submit,
}: any) => {
  const { t } = useTranslation('common');
  const [error, setError] = useState('');

  const initialValues = {
    from: getInitialPlaceValue(initialOrigin),
    to: getInitialPlaceValue(initialDest),
    date: initialDate ? dayjs(initialDate, 'YYYY-MM-DD HH:mm') : null,
  };

  const handleSubmit = async (formData: FormData) => {
    const date = formData.date.format('YYYY-MM-DDTHH:mm:00');

    const data = {
      origin_id: formData.from.value,
      dest_id: formData.to.value,
      date,
    };
    try {
      await submit(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const placeInputRules: Rule[] = [
    { required: true, message: t('errors.noPlace') as string },
    ({ getFieldValue }) => ({
      async validator() {
        const from = getFieldValue('from')?.value;
        const to = getFieldValue('to')?.value;
        if (!from || !to) {
          return;
        }
        if (from === to) {
          throw Error(t('errors.samePlace') as string);
        }
      },
    }),
  ];

  return (
    <Form
      initialValues={initialValues}
      layout="horizontal"
      requiredMark={false}
      onFinish={handleSubmit}
      disabled={initialDate && dayjs(initialDate) < dayjs()}
    >
      <Row gutter={20}>
        <Col xs={24} md={12}>
          <Form.Item
            name="from"
            label={t('from.label')}
            rules={placeInputRules}
          >
            <PlaceInput placeholder={t('from.placeholder')} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="to" label={t('to.label')} rules={placeInputRules}>
            <PlaceInput placeholder={t('to.placeholder')} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <DateTimeInput
            name="date"
            label={t('dateTime.label') as string}
            placeholder={t('dateTime.placeholder') as string}
          />
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitValue}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TripEditForm;
