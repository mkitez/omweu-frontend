import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from 'antd';
import { Rule } from 'antd/es/form';
import type { DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { Car } from '../../services/car.service';
import { TripInputData } from '../../services/trip.service';

import { useCarApi } from '../../hooks/api/useCarsApi';
import DateTimeInput from '../DateTimeInput';
import { PlaceInputEdit } from '../PlaceInput';
import { Destination, InlineCar, Trip } from '../Trips';
import styles from './TripEditForm.module.css';

export interface TripFormData {
  from: DefaultOptionType;
  to: DefaultOptionType;
  routeStops: DefaultOptionType[];
  date: dayjs.Dayjs;
  price: string;
  car: DefaultOptionType;
  description: string;
}

type Props = {
  data?: Trip;
  submitValue: string;
  submit: (data: TripInputData) => Promise<void>;
};

const getInitialPlaceValue = (place: Destination): DefaultOptionType | null => {
  if (!place) {
    return null;
  }
  return {
    value: place.place_id,
    label: `${place.name}, ${place.country_name}`,
  };
};

export const getCarValue = (car: Car | InlineCar): DefaultOptionType => ({
  label: `${car.brand.name} ${car.model.name}`,
  value: car.id,
});

const TripEditForm: React.FC<Props> = ({ data, submitValue, submit }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const carApi = useCarApi();
  const [cars, setCars] = useState<Car[]>([]);
  const [form] = Form.useForm();
  const initialValues = useMemo(() => {
    if (!data) {
      return;
    }
    const { origin, dest, route_stops, date, price, car, description } = data;
    return {
      from: getInitialPlaceValue(origin),
      to: getInitialPlaceValue(dest),
      routeStops: route_stops
        .map((stop) => getInitialPlaceValue(stop))
        .filter((stop) => !!stop),
      date: dayjs(date).tz(data.origin.time_zone),
      price,
      car,
      description,
    };
  }, [data]);
  useEffect(() => {
    carApi.getCars().then((response) => {
      setCars(response.data.sort((car: Car) => (car.is_primary ? -1 : 0)));
    });
  }, [carApi, form]);
  useEffect(() => {
    if (data?.car) {
      return;
    }
    const car = cars.find((car) => car.is_primary);
    if (!car) {
      return;
    }
    form.setFieldValue('car', getCarValue(car));
  }, [cars, data?.car, form]);

  const handleSubmit = async (formData: TripFormData) => {
    const date = formData.date.format('YYYY-MM-DDTHH:mm:00');
    const inputData: TripInputData = {
      origin_id: formData.from.value as string,
      dest_id: formData.to.value as string,
      date,
      price: formData.price,
      car_id: Number(formData.car?.value),
      description: formData.description || '',
      route_stop_ids: formData.routeStops.map((stop) => stop.value as string),
    };
    setLoading(true);
    try {
      await submit(inputData);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common'));
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
        const stopValues = stops.map((stop) => stop?.value);
        if (stopValues.includes(undefined)) {
          return;
        }
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

  const isTripInPast = data?.date && dayjs(data.date) < dayjs();
  return (
    <Form
      form={form}
      initialValues={initialValues}
      requiredMark={false}
      onFinish={handleSubmit}
      disabled={isTripInPast || loading}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
      className={styles.root}
    >
      <Form.Item name="from" label={t('from.label')} rules={placeInputRules}>
        <PlaceInputEdit placeholder={t('from.placeholder')} />
      </Form.Item>
      <Form.List name="routeStops">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.length === 0 && !isTripInPast && (
              <Row>
                <Col sm={{ offset: 5 }} className={styles.stopsTooltip}>
                  {t('addStopTooltip')}
                </Col>
              </Row>
            )}
            {fields.map((field, index) => (
              <Form.Item
                key={field.key}
                label={`${t('stop.label')} ${index + 1}`}
                required={false}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
              >
                <Form.Item noStyle {...field} rules={routeStopRules}>
                  <PlaceInputEdit placeholder={t('stop.placeholder')} />
                </Form.Item>
                <MinusCircleOutlined
                  className={styles.removeStopBtn}
                  onClick={isTripInPast ? undefined : () => remove(field.name)}
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
      <Form.Item name="to" label={t('to.label')} rules={placeInputRules}>
        <PlaceInputEdit placeholder={t('to.placeholder')} />
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
      <Form.Item name="car" label={t('car.label')} rules={[{ required: true }]}>
        <Select
          labelInValue
          showArrow={false}
          notFoundContent={null}
          placeholder={t('car.placeholder')}
          options={cars.map((car) => getCarValue(car))}
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
          onClick={() => {
            const url = data?.id ? `/trips/${data.id}` : '/dashboard/trips';
            router.push(url);
          }}
        >
          {t('cancel')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TripEditForm;
