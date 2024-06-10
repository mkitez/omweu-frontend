import { Button } from 'antd';
import { DefaultOptionType, RefSelectProps } from 'antd/es/select';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FormEventHandler, useRef, useState } from 'react';

import Calendar from '../../assets/calendar-svgrepo-com.svg';
import Location from '../../assets/circle-xxs-svgrepo-com.svg';
import DateInput from '../DateInput';
import PlaceInputSearch from '../PlaceInput/PlaceInputSearch';
import SwapButton from './SwapButton';
import styles from './TripSearch.module.css';

const TripSearch: React.FC = () => {
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
  const [showSwapBtn, setShowSwapBtn] = useState(!!fromField.value);

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
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={submitForm}>
        <div className={styles.placeInputGroup}>
          <PlaceInputSearch
            icon={<Location width="100%" height="100%" />}
            placeholder={t('from.label')}
            bordered={false}
            onChange={(_, option) => {
              if ((option as DefaultOptionType).value) {
                setShowSwapBtn(true);
              }
              setFromField(option as DefaultOptionType);
            }}
            value={fromField.value ? fromField : undefined}
            defaultValue={fromField.label}
            ref={fromRef}
            swapBtn={
              showSwapBtn && (
                <SwapButton onClick={swapInput} className={styles.swapBtn} />
              )
            }
          />
          <PlaceInputSearch
            icon={<Location width="100%" height="100%" />}
            placeholder={t('to.label')}
            bordered={false}
            onChange={(_, option) => setToField(option as DefaultOptionType)}
            value={toField.value ? toField : undefined}
            defaultValue={toField.label}
            ref={toRef}
          />
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
          <Button type="primary" htmlType="submit" className={styles.searchBtn}>
            {t('search')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TripSearch;
