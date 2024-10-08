import { Select, SelectProps } from 'antd';
import type { DefaultOptionType, RefSelectProps } from 'antd/es/select';
import { useTranslation } from 'next-i18next';
import { forwardRef, ReactNode } from 'react';

import { useHereAutocomplete } from '../../hooks/useHereAutocomplete';
import styles from './PlaceInputSearch.module.css';

interface Props extends SelectProps {
  icon?: ReactNode;
  swapBtn?: ReactNode;
}

const PlaceInputSearch = forwardRef<RefSelectProps, Props>(
  function PlaceInput(props, ref) {
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
  }
);

export default PlaceInputSearch;
