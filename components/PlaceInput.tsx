import { Select, SelectProps } from 'antd';
import { useTranslation } from 'next-i18next';
import type { DefaultOptionType } from 'antd/es/select';
import { useHereAutocomplete } from '../hooks/useHereAutocomplete';

const PlaceInput: React.FC<SelectProps> = (props) => {
  const { i18n } = useTranslation();
  const { suggestions, getSuggestions } = useHereAutocomplete({
    lang: i18n.language,
  });

  const handleSearch = async (newValue: string) => {
    getSuggestions(newValue);
  };

  return (
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
      {...props}
    />
  );
};

export default PlaceInput;
