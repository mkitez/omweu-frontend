import { Form, Button } from 'antd';
import { API_URL } from '../utils/constants';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { FormData } from './TripEditForm';

const TripSearch = () => {
  const onFinish = async (formData: FormData) => {
    const date = formData.date.format('YYYY-MM-DD');

    const response = await fetch(
      `${API_URL}/trips/search/?origin_id=${formData.from.value}&dest_id=${formData.to.value}&date=${date}`
    );
    const responseJson = await response.json();
    console.log(responseJson);
  };

  return (
    <Form onFinish={onFinish} layout="inline" requiredMark={false}>
      <PlaceInput name="from" label="From" />
      <PlaceInput name="to" label="To" />
      <DateTimeInput name="date" label="Date" />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TripSearch;
