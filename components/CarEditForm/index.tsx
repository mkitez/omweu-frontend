import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  message,
  Row,
  Select,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import {
  BodyType,
  Car,
  CarColor,
  CarInputData,
} from '../../services/car.service';

import CarBrandSelect from './CarBrandSelect';
import CarModelSelect from './CarModelSelect';

interface CarFormData {
  brand: DefaultOptionType;
  model: DefaultOptionType;
  color: CarColor;
  year: number;
  body_type: BodyType;
  passenger_seats: number;
  is_primary: boolean;
}

type Props = {
  data?: Car;
  submitValue: string;
  submit: (data: CarInputData) => Promise<void>;
};

const CarEditForm: React.FC<Props> = ({ data, submitValue, submit }) => {
  const { t } = useTranslation(['car', 'common']);
  const router = useRouter();
  const [form] = Form.useForm<CarFormData>();
  useEffect(() => {
    if (!data) {
      return;
    }
    const brand: DefaultOptionType = {
      label: data.brand.name === 'other' ? t('other_brand') : data.brand.name,
      value: data.brand.id,
    };
    const model: DefaultOptionType = {
      label: data.model.name === 'other' ? t('other_model') : data.model.name,
      value: data.model.id,
    };
    form.setFieldsValue({ ...data, brand, model });
  }, [data, form, t]);

  const handleSubmit = async (data: CarFormData) => {
    const { brand, model, ...rest } = data;
    const dataToSubmit = { model_id: model.value as number, ...rest };
    try {
      await submit(dataToSubmit);
      router.push('/dashboard/profile');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
    }
  };

  return (
    <Form
      form={form}
      requiredMark={false}
      onFinish={handleSubmit}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item name="brand" label={t('brand')} rules={[{ required: true }]}>
        <CarBrandSelect onChange={() => form.setFieldValue('model', null)} />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) =>
          prevValues.brand !== curValues.brand
        }
      >
        {() => (
          <Form.Item
            name="model"
            label={t('model')}
            rules={[{ required: true }]}
          >
            <CarModelSelect brandId={form.getFieldValue('brand')?.value} />
          </Form.Item>
        )}
      </Form.Item>
      <Row>
        <Col xs={24} lg={14}>
          <Form.Item
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            name="body_type"
            label={t('body_type')}
            rules={[{ required: true }]}
          >
            <Select
              showArrow={false}
              options={Object.values(BodyType)
                .filter((v) => isNaN(Number(v)))
                .map((type) => ({
                  label: t(`body_types.${type.toString().toLowerCase()}`),
                  value: type,
                }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={10}>
          <Form.Item
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            name="color"
            label={t('color')}
            rules={[{ required: true }]}
          >
            <Select
              showArrow={false}
              options={Object.values(CarColor)
                .filter((v) => isNaN(Number(v)))
                .map((type) => ({
                  label: t(`colors.${type.toString().toLowerCase()}`),
                  value: type,
                }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} lg={12}>
          <Form.Item
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            name="year"
            label={t('year')}
            rules={[{ required: true }]}
          >
            <InputNumber step={1} min={1990} max={new Date().getFullYear()} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            name="passenger_seats"
            label={t('passenger_seats')}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={20} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="is_primary"
        label={t('is_primary')}
        valuePropName="checked"
      >
        <Checkbox disabled={data?.is_primary === true} />
      </Form.Item>
      <Row gutter={[10, 10]}>
        <Col lg={{ offset: 6 }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {submitValue}
            </Button>
          </Form.Item>
        </Col>
        <Col>
          <Button onClick={() => router.push('/dashboard/profile')}>
            {t('cancel')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CarEditForm;
