import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Form, Button, Row, Col, Grid, DatePicker } from 'antd';
import PlaceInput from './PlaceInput';
import type { FormData } from './TripEditForm';
import SwapButton from './SwapButton';
import dayjs from 'dayjs';
import styles from '../styles/TripSearch.module.css';
import Location from '../assets/location.svg';
import Calendar from '../assets/calendar.svg';

const TripSearch = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const { xs } = Grid.useBreakpoint();

  const { from_input, to_input, from, to, date } = router.query;
  const initialValues = {
    from: from_input ? { label: from_input, value: from } : undefined,
    to: to_input ? { label: to_input, value: to } : undefined,
    date: date ? dayjs(date as string, 'YYYY-MM-DD') : undefined,
  };

  const onFinish = async (formData: FormData) => {
    const { from, to, date } = formData;
    if (!from || !to || !date) {
      return;
    }
    const formattedDate = date.format('YYYY-MM-DD');
    router.push(
      `/search?from=${from.value}&to=${to.value}&date=${formattedDate}&from_input=${from.label}&to_input=${to.label}`,
      undefined,
      { shallow: router.pathname === '/search' }
    );
  };

  const swapInput = () => {
    form.setFieldsValue({
      to: form.getFieldValue('from'),
      from: form.getFieldValue('to'),
    });
  };

  const placeInputProps: React.ComponentProps<typeof Form.Item> = {
    label: xs ? null : <Location width="100%" />,
    labelCol: { xs: 5, md: 3 },
    wrapperCol: { xs: 18, md: 21 },
    style: { margin: 0 },
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="inline"
          requiredMark={false}
          initialValues={initialValues}
          colon={false}
        >
          <Row style={{ width: '100%' }}>
            <Col xs={21} md={7}>
              <Form.Item name="from" {...placeInputProps}>
                <PlaceInput
                  placeholder={t('from.label')}
                  bordered={false}
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col xs={3} md={1}>
              <SwapButton onClick={swapInput} className={styles.swapBtn} />
            </Col>
            <Col xs={21} md={7}>
              <Form.Item name="to" {...placeInputProps}>
                <PlaceInput
                  placeholder={t('to.label')}
                  bordered={false}
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col xs={21} md={5}>
              <Form.Item
                name="date"
                label={xs ? null : <Calendar width="100%" />}
                labelCol={{ xs: 5, md: { offset: 1, span: 5 } }}
                wrapperCol={{ xs: 18, md: 18 }}
                style={{ width: '100%' }}
              >
                <DatePicker
                  allowClear={false}
                  format="DD.MM.YYYY"
                  showNow={false}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf('day')
                  }
                  placeholder={t('date.label') as string}
                  bordered={false}
                  suffixIcon={null}
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item style={{ margin: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.searchBtn}
                >
                  {t('search')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default TripSearch;
