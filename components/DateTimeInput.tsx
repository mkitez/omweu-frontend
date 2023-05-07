import dayjs from 'dayjs';
import { DatePicker, Form } from 'antd';
import { Rule } from 'antd/es/form';
import { useTranslation } from 'next-i18next';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
}

const DateTimeInput: React.FC<Props> = ({ name, label, placeholder }) => {
  const { t } = useTranslation('common');

  const format = 'DD.MM.YYYY HH:mm';
  const rules: Rule[] = [
    { required: true, message: t('errors.noDate') as string },
    {
      async validator(_, value: dayjs.Dayjs) {
        if (!value) {
          return;
        }
        if (![0, 30].includes(value.minute())) {
          throw Error(t('errors.badTimeInterval') as string);
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
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default DateTimeInput;
