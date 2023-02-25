import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Form, Button } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { FormData } from './TripEditForm';

const TripSearch = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const onFinish = async (formData: FormData) => {
    const date = formData.date.format('YYYY-MM-DD');
    router.push(
      `/search?from=${formData.from.value}&to=${formData.to.value}&date=${date}`
    );
  };

  return (
    <Form onFinish={onFinish} layout="inline" requiredMark={false}>
      <PlaceInput name="from" label="From" />
      <PlaceInput name="to" label="To" />
      <DateTimeInput name="date" label="Date" />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('search')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TripSearch;
