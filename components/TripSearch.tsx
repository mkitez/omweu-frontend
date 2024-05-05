import dayjs from 'dayjs';
import { FormEventHandler, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button } from 'antd';
import { DefaultOptionType, RefSelectProps } from 'antd/es/select';
import PlaceInput from './PlaceInput';
import SwapButton from './SwapButton';
import DateInput from './DateInput';
import Location from '../assets/circle-xxs-svgrepo-com.svg';
import Calendar from '../assets/calendar-svgrepo-com.svg';
import styles from '../styles/TripSearch.module.css';

const TripSearch = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const { from_input, to_input, from, to, date } = router.query;
  const [fromField, setFromField] = useState<DefaultOptionType>({
    label: from_input,
    value: from as string | undefined,
  });
  const [toField, setToField] = useState<DefaultOptionType>({
    label: to_input,
    value: to as string | undefined,
  });
  const [dateValue, setDateValue] = useState<dayjs.Dayjs>(
    date ? dayjs(date as string, 'YYYY-MM-DD') : dayjs()
  );

  const fromRef = useRef<RefSelectProps>(null);
  const toRef = useRef<RefSelectProps>(null);

  const submitForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!fromField.value) {
      return fromRef?.current?.focus();
    }
    if (!toField.value) {
      return toRef?.current?.focus();
    }
    const formattedDate = dateValue.format('YYYY-MM-DD');
    router.push(
      `/search?from=${fromField.value}&to=${toField.value}&date=${formattedDate}&from_input=${fromField.label}&to_input=${toField.label}`,
      undefined,
      { shallow: router.pathname === '/search' }
    );
  };

  const swapInput = () => {
    if (!toField.value && !fromField.value) {
      return;
    }
    const [newFrom, newTo] = [toField, fromField];
    setFromField(newFrom);
    setToField(newTo);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={submitForm}>
          <div className={styles.placeInputGroup}>
            <div className={styles.fromInput}>
              <PlaceInput
                icon={<Location width="100%" height="100%" />}
                placeholder={t('from.label')}
                bordered={false}
                onChange={(_, option) =>
                  setFromField(option as DefaultOptionType)
                }
                value={fromField.value ? fromField : undefined}
                defaultValue={fromField.label}
                ref={fromRef}
              />
              <SwapButton onClick={swapInput} className={styles.swapBtn} />
            </div>
            <div className={styles.toInput}>
              <PlaceInput
                icon={<Location width="100%" height="100%" />}
                placeholder={t('to.label')}
                bordered={false}
                onChange={(_, option) =>
                  setToField(option as DefaultOptionType)
                }
                value={toField.value ? toField : undefined}
                defaultValue={toField.label}
                ref={toRef}
              />
            </div>
          </div>
          <div className={styles.dateInput}>
            <DateInput
              icon={<Calendar width="100%" height="100%" />}
              onChange={(value) => {
                if (!value) {
                  return;
                }
                setDateValue(value);
              }}
              defaultValue={dateValue}
            />
          </div>
          <div className={styles.search}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.searchBtn}
            >
              {t('search')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripSearch;
