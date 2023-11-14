import { useEffect, useState, useMemo } from 'react';
import { Alert, Button, Col, Form, Input, InputNumber, Row } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Destination } from './Trips';
import dayjs from 'dayjs';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import styles from '../styles/TripEditForm.module.css';
import axios from 'axios';

export interface FormData {
  from: DefaultOptionType;
  to: DefaultOptionType;
  routeStops: DefaultOptionType[];
  date: dayjs.Dayjs;
  price: string;
  description: string;
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
  initialRouteStops,
  initialDate,
  initialPrice,
  initialDescription,
  submitValue,
  submit,
  onDelete,
}: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form] = Form.useForm();

  const initialValues = useMemo(
    () => ({
      from: getInitialPlaceValue(initialOrigin),
      to: getInitialPlaceValue(initialDest),
      routeStops: (initialRouteStops || [])
        .map((stop: any) => getInitialPlaceValue(stop))
        .filter((stop: any) => !!stop),
      date: initialDate ? dayjs(initialDate, 'YYYY-MM-DD HH:mm') : null,
      price: initialPrice ?? null,
      description: initialDescription || '',
    }),
    [
      initialDate,
      initialDest,
      initialRouteStops,
      initialOrigin,
      initialPrice,
      initialDescription,
    ]
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
      description: formData.description || '',
      route_stop_ids: formData.routeStops.map((stop) => stop.value),
    };
    setLoading(true);
    try {
      await submit(data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(t('errors.common') as string);
      }
      setLoading(false);
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

  const routeStopRules: Rule[] = [
    { required: true, message: t('errors.noStop') as string },
    ({ getFieldValue }) => ({
      async validator(_, value) {
        if (!value) {
          return;
        }
        const from = getFieldValue('from')?.value;
        const to = getFieldValue('to')?.value;
        if (value.value === from || value.value === to) {
          throw Error(t('errors.sameStopAsOriginDest') as string);
        }
      },
    }),
    ({ getFieldValue }) => ({
      async validator() {
        const stops = getFieldValue('routeStops') as DefaultOptionType[];
        const stopValues = stops.map((stop) => stop.value);
        const stopValuesSet = new Set(stopValues);
        if (stopValues.length !== stopValuesSet.size) {
          throw Error(t('errors.sameStop') as string);
        }
      },
    }),
  ];

  const priceRules: Rule[] = [
    () => ({
      validator: (_, value) =>
        Number(value) > 0
          ? Promise.resolve()
          : Promise.reject(t('errors.noPrice')),
    }),
  ];

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        requiredMark={false}
        onFinish={handleSubmit}
        disabled={(initialDate && dayjs(initialDate) < dayjs()) || loading}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
        className={styles.root}
      >
        <Form.Item name="from" label={t('from.label')} rules={placeInputRules}>
          <PlaceInput placeholder={t('from.placeholder')} />
        </Form.Item>
        <Form.Item name="to" label={t('to.label')} rules={placeInputRules}>
          <PlaceInput placeholder={t('to.placeholder')} />
        </Form.Item>
        <Form.List name="routeStops">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={`${t('stop.label')} ${index + 1}`}
                  required={false}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Form.Item noStyle {...field} rules={routeStopRules}>
                    <PlaceInput placeholder={t('stop.placeholder')} />
                  </Form.Item>
                  <MinusCircleOutlined
                    className={styles.removeStopBtn}
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              {fields.length < 3 && (
                <Form.Item wrapperCol={{ sm: { offset: 5 } }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    {t('addStop')}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
        <DateTimeInput
          name="date"
          label={t('dateTime.label') as string}
          placeholder={t('dateTime.placeholder') as string}
        />
        <Form.Item name="price" label={t('price.label')} rules={priceRules}>
          <InputNumber
            placeholder={t('price.placeholder') as string}
            maxLength={5}
            step={1}
            addonAfter="€"
          />
        </Form.Item>
        <Form.Item name="description" label={t('description.label')}>
          <Input.TextArea
            placeholder={t('description.placeholder') as string}
            maxLength={300}
            rows={3}
            className={styles.desc}
          />
        </Form.Item>
        <Form.Item
          className={styles.btnContainer}
          wrapperCol={{ sm: { offset: 5 } }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitValue}
          </Button>
          <Button
            disabled={false}
            onClick={() => router.push('/dashboard/trips')}
          >
            {t('cancel')}
          </Button>
          {onDelete && (
            <Button type="text" danger onClick={() => onDelete()}>
              {t('delete')}
            </Button>
          )}
        </Form.Item>
      </Form>
      {error && <Alert type="error" message={error} />}
    </>
  );
};

export default TripEditForm;
