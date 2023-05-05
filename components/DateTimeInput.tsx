import Image from 'next/image';
import dayjs from 'dayjs';
import { DatePicker, Form, Grid } from 'antd';
import { Rule } from 'antd/es/form';
import calendar from '../assets/calendar.svg';
import styles from '../styles/TripSearch.module.css';

interface Props {
  name: string;
  label?: string;
  showTime?: boolean;
}

const { useBreakpoint } = Grid;

const DateTimeInput = ({ name, label, showTime }: Props) => {
  const { xs } = useBreakpoint();

  const format = showTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY';
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
    <Form.Item
      name={name}
      rules={rules}
      label={
        xs ? null : (
          <Image src={calendar} alt="" className={styles.inputFieldIcon} />
        )
      }
      labelCol={{ xs: 5, md: { offset: 1, span: 5 } }}
      wrapperCol={{ xs: 18, md: 18 }}
      style={{ width: '100%' }}
    >
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
        placeholder={label}
        bordered={false}
        suffixIcon={null}
        className={styles.input}
      />
    </Form.Item>
  );
};

export default DateTimeInput;
