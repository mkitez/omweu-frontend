import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Form, Button } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { FormData } from './TripEditForm';
import SwapButton from './SwapButton';
import dayjs from 'dayjs';

const TripSearch = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [form] = Form.useForm();

  const { from_input, to_input, from, to, date } = router.query;
  const initialValues = {
    from: from_input ? { label: from_input, value: from } : undefined,
    to: to_input ? { label: to_input, value: to } : undefined,
    date: date ? dayjs(date as string, 'YYYY-MM-DD') : undefined,
  };

  const onFinish = async (formData: FormData) => {
    const { from, to, date } = formData;
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

  return (
    <div style={{ marginBottom: 15 }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        requiredMark={false}
        initialValues={initialValues}
      >
        <PlaceInput name="from" label="From" />
        <SwapButton onClick={swapInput} />
        <PlaceInput name="to" label="To" />
        <DateTimeInput name="date" label="Date" />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('search')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TripSearch;
