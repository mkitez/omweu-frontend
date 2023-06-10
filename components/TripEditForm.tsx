import { useEffect, useState, useMemo } from 'react';
import { Alert, Button, Form, Input, InputNumber } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
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
      date: initialDate ? dayjs(initialDate, 'YYYY-MM-DD HH:mm') : null,
      price: initialPrice ?? null,
      description: initialDescription || '',
    }),
    [initialDate, initialDest, initialOrigin, initialPrice, initialDescription]
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
      description: formData.description,
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
