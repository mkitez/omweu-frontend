import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  BodyType,
  Car,
  CarColor,
  CarInputData,
} from '../../services/car.service';

import { useCarApi } from '../../hooks/api/useCarsApi';
import CarBrandSelect from './CarBrandSelect';
import styles from './CarEditForm.module.css';
import CarModelSelect from './CarModelSelect';
import { colorMappings } from './colorMappings';

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
  hideCancelButton?: boolean;
  hideIsPrimary?: boolean;
  submitValue: string;
  submit: (data: CarInputData) => Promise<void>;
};

const CarEditForm: React.FC<Props> = ({
  data,
  hideCancelButton,
  hideIsPrimary,
  submitValue,
  submit,
}) => {
  const { t } = useTranslation(['car', 'common']);
  const router = useRouter();
  const [form] = Form.useForm<CarFormData>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useCarApi();
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
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setDeleteModalOpen(false);
    try {
      await api.deleteCar(data?.id as number);
      message.success(t('notifications.car_deleted'));
      router.push('/dashboard/profile');
    } catch (e) {
      setLoading(false);
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
        <CarBrandSelect
          onChange={() => form.setFieldValue('model', null)}
          placeholder={t('placeholders.brand')}
        />
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
            <CarModelSelect
              brandId={form.getFieldValue('brand')?.value}
              placeholder={t('placeholders.model')}
            />
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
              placeholder={t('placeholders.body_type')}
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
              placeholder={t('placeholders.color')}
              options={Object.values(CarColor).map((color) => ({
                label: (
                  <div className={styles.colorInputContainer}>
                    <span
                      className={styles.colorPreview}
                      style={colorMappings[color]}
                    />
                    {t(`colors.${color.toString().toLowerCase()}`)}
                  </div>
                ),
                value: color,
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
            <InputNumber
              step={1}
              min={1990}
              max={new Date().getFullYear()}
              placeholder={t('placeholders.year') as string}
            />
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
            <InputNumber
              min={1}
              max={20}
              placeholder={t('placeholders.passenger_seats') as string}
            />
          </Form.Item>
        </Col>
      </Row>
      {!hideIsPrimary && (
        <Form.Item
          name="is_primary"
          label={t('is_primary')}
          valuePropName="checked"
        >
          <Checkbox disabled={data?.is_primary === true} />
        </Form.Item>
      )}
      <Row gutter={[10, 10]}>
        <Col lg={{ offset: 6 }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {submitValue}
            </Button>
          </Form.Item>
        </Col>
        {!hideCancelButton && (
          <Col>
            <Button onClick={() => router.push('/dashboard/profile')}>
              {t('cancel')}
            </Button>
          </Col>
        )}
        {data && (
          <Col>
            <Button danger type="text" onClick={() => setDeleteModalOpen(true)}>
              {t('delete')}
            </Button>
            <Modal
              open={deleteModalOpen}
              title={t('delete_modal.title')}
              okText={t('delete')}
              cancelText={t('cancel')}
              onOk={handleDelete}
              confirmLoading={loading}
              onCancel={() => setDeleteModalOpen(false)}
            >
              {t('delete_modal.body')}
            </Modal>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default CarEditForm;
