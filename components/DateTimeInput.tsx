import dayjs from 'dayjs';
import { DatePicker, Form } from 'antd';
import { Rule } from 'antd/es/form';

interface Props {
  name: string;
  label?: string;
  showTime?: boolean;
}

const DateTimeInput = ({ name, label, showTime }: Props) => {
  const format = showTime ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD';
  const rules: Rule[] = [{ required: true, message: 'Please select a date' }];
  if (showTime) {
    rules.push({
      async validator(_, value: dayjs.Dayjs) {
        if (![0, 30].includes(value.minute())) {
          throw Error('Please use a 30 minute interval');
        }
      },
    });
  }

  return (
    <Form.Item name={name} label={label} rules={rules}>
      <DatePicker
        allowClear={false}
        format={format}
        showTime={
          showTime
            ? {
                minuteStep: 30,
                format: 'HH:mm',
                defaultValue: dayjs().startOf('hour'),
              }
            : false
        }
        showNow={false}
        disabledDate={(current) => current && current < dayjs().startOf('day')}
      />
    </Form.Item>
  );
};

export default DateTimeInput;
