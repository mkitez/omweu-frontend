import { useState } from 'react';
import { Button, Form } from 'antd';
import PlaceInput from './PlaceInput';
import DateTimeInput from './DateTimeInput';
import type { DefaultOptionType } from 'antd/es/select';
import { Destination } from './Trips';
import dayjs from 'dayjs';

export interface FormData {
  from: DefaultOptionType;
  to: DefaultOptionType;
  date: dayjs.Dayjs;
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
  submitValue,
  submit,
}: any) => {
  const [error, setError] = useState('');

  const initialValues = {
    from: getInitialPlaceValue(initialOrigin),
    to: getInitialPlaceValue(initialDest),
    date: initialDate ? dayjs(initialDate, 'YYYY-MM-DD HH:mm') : null,
  };

  const handleSubmit = async (formData: FormData) => {
    const date = formData.date.format('YYYY-MM-DDTHH:mm:00');

    const data = {
      origin_id: formData.from.value,
      dest_id: formData.to.value,
      date,
    };
    try {
      await submit(data);
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <Form
      initialValues={initialValues}
      layout="inline"
      requiredMark={false}
      onFinish={handleSubmit}
      disabled={initialDate && dayjs(initialDate) < dayjs()}
    >
      <PlaceInput label="From" name="from" />
      <PlaceInput label="To" name="to" />
      <DateTimeInput name="date" label="Date" showTime />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitValue}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TripEditForm;
