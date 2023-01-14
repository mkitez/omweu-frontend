import { DatePicker, Form } from 'antd';

interface Props {
  name: string;
  label?: string;
}

const DateTimeInput = ({ name, label }: Props) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: 'Please select a date' }]}
    >
      <DatePicker allowClear={false} format="YYYY/MM/DD" />
    </Form.Item>
  );
};

export default DateTimeInput;
