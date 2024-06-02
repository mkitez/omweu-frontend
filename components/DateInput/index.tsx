import { DatePicker, Grid } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';

import styles from './DateInput.module.css';

type Props = (typeof DatePicker)['defaultProps'] & {
  icon?: ReactNode;
};

const DateInput: React.FC<Props> = ({ icon, onChange, defaultValue }) => {
  const { t } = useTranslation('common');
  const { xs } = Grid.useBreakpoint();

  return (
    <div className={styles.root}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <DatePicker
        allowClear={false}
        format="ll"
        showNow={true}
        disabledDate={(current) =>
          current < dayjs().startOf('day') ||
          current > dayjs().add(1, 'year').startOf('day')
        }
        placeholder={t('date.label') as string}
        bordered={false}
        suffixIcon={null}
        placement={xs ? 'topRight' : 'bottomLeft'}
        className={styles.input}
        onChange={onChange}
        defaultValue={defaultValue}
        inputReadOnly
      />
    </div>
  );
};

export default DateInput;
