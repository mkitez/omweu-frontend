import { useState } from 'react';
import { Button, Form, Row, Col } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
import { Destination } from './Trips';
import dayjs from 'dayjs';
import { Rule } from 'antd/es/form';

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
    { required: true, message: 'Please select a place' },
    ({ getFieldValue }) => ({
      async validator() {
        const from = getFieldValue('from')?.value;
        const to = getFieldValue('to')?.value;
        if (!from || !to) {
          return;
        }
        if (from === to) {
          throw Error('Please select different places');
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
          <Form.Item name="from" label="From" rules={placeInputRules}>
            <PlaceInput placeholder="From" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="to" label="To" rules={placeInputRules}>
            <PlaceInput placeholder="To" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <DateTimeInput name="date" label="Date and time" />
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
