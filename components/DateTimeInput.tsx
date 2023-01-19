import { DatePicker, Form } from 'antd';

interface Props {
  name: string;
  label?: string;
  showTime?: boolean;
}

const DateTimeInput = ({ name, label, showTime }: Props) => {
  const format = showTime ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD';
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: 'Please select a date' }]}
    >
      <DatePicker
        allowClear={false}
        format={format}
        showTime={showTime ? { minuteStep: 15, format: 'HH:mm' } : false}
      />
    </Form.Item>
  );
};

export default DateTimeInput;
