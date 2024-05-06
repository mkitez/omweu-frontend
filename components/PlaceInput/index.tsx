import { ReactNode, forwardRef } from 'react';
import { Select, SelectProps } from 'antd';
import { useTranslation } from 'next-i18next';
import type { DefaultOptionType, RefSelectProps } from 'antd/es/select';
import { useHereAutocomplete } from '../../hooks/useHereAutocomplete';
import styles from './PlaceInput.module.css';

interface Props extends SelectProps {
  icon?: ReactNode;
  swapBtn?: ReactNode;
}

const PlaceInput = forwardRef<RefSelectProps, Props>(function PlaceInput(
  props,
  ref
) {
  const { i18n } = useTranslation();
  const { suggestions, getSuggestions } = useHereAutocomplete({
    lang: i18n.language,
  });

  const handleSearch = (newValue: string) => {
    getSuggestions(newValue);
  };

  const { icon, swapBtn, ...restProps } = props;
  let className = styles.input;
  if (swapBtn) {
    className += ` ${styles.inputWithSwap}`;
  }

  return (
    <div className={styles.root}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <Select
        showSearch
        defaultActiveFirstOption
        filterOption={false}
        onSearch={handleSearch}
        showArrow={false}
        notFoundContent={null}
        labelInValue={true}
        options={suggestions.map(
          (place): DefaultOptionType => ({
            value: place.id,
            label: place.address.label,
          })
        )}
        className={className}
        ref={ref}
        {...restProps}
      />
      {swapBtn && <div className={styles.swap}>{swapBtn}</div>}
    </div>
  );
});

export default PlaceInput;
