import { useEffect, useState, useMemo } from 'react';
import { Button, Form, Row, Col, InputNumber } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
import { Destination } from './Trips';
import dayjs from 'dayjs';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export interface FormData {
  from: DefaultOptionType;
  to: DefaultOptionType;
  date: dayjs.Dayjs;
  price: string;
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
  initialPrice,
  submitValue,
  submit,
  onDelete,
}: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      from: getInitialPlaceValue(initialOrigin),
      to: getInitialPlaceValue(initialDest),
      date: initialDate ? dayjs(initialDate, 'YYYY-MM-DD HH:mm') : null,
      price: initialPrice ?? 0,
    }),
    [initialDate, initialDest, initialOrigin, initialPrice]
  );
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const handleSubmit = async (formData: FormData) => {
    const date = formData.date.format('YYYY-MM-DDTHH:mm:00');

    const data = {
      origin_id: formData.from.value,
      dest_id: formData.to.value,
      date,
      price: formData.price,
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
      form={form}
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
        <Col xs={24} md={12}>
          <Form.Item
            name="price"
            label={t('price.label')}
            rules={[{ required: true, message: t('errors.noPrice') as string }]}
          >
            <InputNumber
              placeholder={t('price.placeholder') as string}
              maxLength={5}
              step={1}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col>
          <Button type="primary" htmlType="submit">
            {submitValue}
          </Button>
        </Col>
        <Col>
          <Button disabled={false} onClick={() => router.back()}>
            {t('cancel')}
          </Button>
        </Col>
        {onDelete && (
          <Col>
            <Button type="text" danger onClick={() => onDelete()}>
              {t('delete')}
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default TripEditForm;
