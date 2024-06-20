import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  FormItemProps,
  Input,
  message,
  Row,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useUserApi } from '../../hooks/api/useUserApi';
import { calculateAge } from '../../utils/commonUtils';
import { RECAPTCHA_SITE_KEY } from '../../utils/constants';
import styles from './SignupForm.module.css';
import ValidationHelpMessage from './ValidationHelpMessage';

const dateFormats: Record<string, string> = {
  ru: 'DD.MM.YYYY',
};

interface UserFormData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name?: string;
  birth_date: string;
  phone_number: string;
  whatsapp_number: string;
  telegram_username: string;
  captcha: string;
}

type ValidationErrors = Partial<Record<keyof UserFormData, string[]>>;

type Props = {
  onSuccess: () => void;
};

const SignupForm: React.FC<Props> = ({ onSuccess }) => {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const userApi = useUserApi();

  const [form] = Form.useForm<UserFormData>();

  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();

  const getValidationProps = useCallback(
    (fieldName: keyof UserFormData): FormItemProps => {
      const errors = validationErrors?.[fieldName];
      if (!errors) {
        return {};
      }
      return {
        validateStatus: 'error',
        help: <ValidationHelpMessage errors={errors} />,
      };
    },
    [validationErrors]
  );

  const onFinish = async (formData: UserFormData) => {
    const { birth_date, password_confirmation, ...data } = formData;
    const birthDateFormatted = dayjs(
      birth_date,
      dateFormats[i18n.language]
    ).format('YYYY-MM-DD');
    setLoading(true);
    try {
      await userApi.createUser({
        ...data,
        birth_date: birthDateFormatted,
      });
      onSuccess();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setValidationErrors(e.response.data);
        } else {
          message.error(t('errors.common', { ns: 'common' }));
        }
      }
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className={styles.root}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        name="email"
        label={t('registration.email')}
        rules={[
          { required: true, message: t('errors.enterEmail') || '' },
          { type: 'email', message: t('errors.invalidEmail') || '' },
        ]}
        validateTrigger={['onBlur']}
        {...getValidationProps('email')}
      >
        <Input
          placeholder={t('registration.email') || ''}
          onFocus={() =>
            setValidationErrors((errors) => ({ ...errors, email: undefined }))
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        label={t('registration.password')}
        rules={[
          { required: true, message: t('errors.enterPassword') as string },
          {
            min: 8,
            message: t('errors.shortPassword', { len: 8 }) as string,
          },
        ]}
        {...getValidationProps('password')}
      >
        <Input.Password
          placeholder={t('registration.password') || ''}
          onFocus={() =>
            setValidationErrors((errors) => ({
              ...errors,
              password: undefined,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        name="password_confirmation"
        label={t('registration.confirmPassword')}
        rules={[
          { required: true, message: t('errors.enterPassword') as string },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('errors.passwordsDoNotMatch') as string)
              );
            },
          }),
        ]}
        dependencies={['password']}
      >
        <Input.Password placeholder={t('registration.password') || ''} />
      </Form.Item>
      <Divider />
      <Form.Item
        name="first_name"
        label={t('registration.firstName')}
        rules={[
          { required: true, message: t('errors.enterName') as string },
          { max: 30, message: t('errors.longName') as string },
        ]}
      >
        <Input placeholder={t('registration.firstName') || ''} />
      </Form.Item>
      <Form.Item
        name="last_name"
        label={t('registration.lastName')}
        rules={[{ max: 30, message: t('errors.longLastName') as string }]}
      >
        <Input placeholder={t('registration.lastName') || ''} />
      </Form.Item>
      <Form.Item
        name="birth_date"
        label={t('registration.birthDate')}
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.resolve();
              }
              const date = dayjs(value, dateFormats[i18n.language], true);
              if (!date.isValid()) {
                return Promise.reject(
                  new Error(
                    `${t('errors.dateFormat')}: ${t('registration.birthDateFormat')}`
                  )
                );
              }
              const age = calculateAge(value);
              if (age < 18) {
                return Promise.reject(
                  new Error(t('errors.dateValueLow') as string)
                );
              }
              if (age > 100) {
                return Promise.reject(
                  new Error(t('errors.dateValueHigh') as string)
                );
              }
              return Promise.resolve();
            },
          }),
          { required: true, message: t('errors.enterBirthDate') as string },
        ]}
        validateTrigger={['onBlur']}
      >
        <Input placeholder={t('registration.birthDateFormat') as string} />
      </Form.Item>
      <Divider />
      <Form.Item
        name="phone_number"
        label={t('registration.phone')}
        rules={[
          { pattern: /\+\d+/, message: t('errors.numberFormat') as string },
          { max: 20, message: t('errors.longNumber') as string },
          { required: true, message: t('errors.enterNumber') as string },
        ]}
        {...getValidationProps('phone_number')}
      >
        <Input
          placeholder={t('registration.phone') || ''}
          onFocus={() =>
            setValidationErrors((errors) => ({
              ...errors,
              phone_number: undefined,
            }))
          }
        />
      </Form.Item>
      {showExtraFields ? (
        <>
          <Form.Item
            name="whatsapp_number"
            label={t('registration.whatsapp')}
            rules={[
              {
                pattern: /\+\d+/,
                message: t('errors.numberFormat') as string,
              },
              { max: 20, message: t('errors.longNumber') as string },
            ]}
            {...getValidationProps('whatsapp_number')}
          >
            <Input
              placeholder={t('registration.whatsapp') || ''}
              onFocus={() =>
                setValidationErrors((errors) => ({
                  ...errors,
                  whatsapp_number: undefined,
                }))
              }
            />
          </Form.Item>
          <Form.Item
            name="telegram_username"
            label={t('registration.telegram')}
            {...getValidationProps('telegram_username')}
          >
            <Input
              placeholder={t('registration.telegram_placeholder') || ''}
              onFocus={() =>
                setValidationErrors((errors) => ({
                  ...errors,
                  telegram_username: undefined,
                }))
              }
            />
          </Form.Item>
        </>
      ) : (
        <Row>
          <Col sm={{ offset: 8 }}>
            <Form.Item>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setShowExtraFields(true)}
              >
                {t('registration.show_extra_contacts')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item
        name="captcha"
        initialValue={null}
        rules={[
          { required: true, message: t('errors.solveCaptcha') as string },
        ]}
        wrapperCol={{ xs: 24, sm: { offset: 8 } }}
        {...getValidationProps('captcha')}
      >
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY as string}
          onChange={(value) => form.setFieldValue('captcha', value)}
          className={styles.captchaContainer}
          hl={i18n.language}
        />
      </Form.Item>
      <Form.Item
        className={styles.submitButtonContainer}
        wrapperCol={{ span: 24 }}
      >
        <Button type="primary" htmlType="submit" loading={loading}>
          {t('registration.formButtonLabel')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
