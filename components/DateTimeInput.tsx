import dayjs from 'dayjs';
import { DatePicker, Form } from 'antd';
import { Rule } from 'antd/es/form';

interface Props {
  name: string;
  label?: string;
}

const DateTimeInput = ({ name, label }: Props) => {
  const format = 'DD.MM.YYYY HH:mm';
  const rules: Rule[] = [
    { required: true, message: 'Please select a date' },
    {
      async validator(_, value: dayjs.Dayjs) {
        if (!value) {
          return;
        }
        if (![0, 30].includes(value.minute())) {
          throw Error('Please use a 30 minute interval');
        }
      },
    },
  ];

  return (
    <Form.Item name={name} rules={rules} label={label}>
      <DatePicker
        allowClear={false}
        format={format}
        showTime={{
          minuteStep: 30,
          format: 'HH:mm',
          defaultValue: dayjs().startOf('hour'),
        }}
        showNow={false}
        disabledDate={(current) => current && current < dayjs().startOf('day')}
        placeholder={label}
      />
    </Form.Item>
  );
};

export default DateTimeInput;
