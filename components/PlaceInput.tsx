import { Select, Form } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { useHereAutocomplete } from '../hooks/useHereAutocomplete';

interface Props {
  name: string;
  label?: string;
}

const PlaceInput = ({ name, label }: Props) => {
  const { suggestions, getSuggestions } = useHereAutocomplete();

  const handleSearch = async (newValue: string) => {
    getSuggestions(newValue);
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: 'Please select a place' }]}
    >
      <Select
        showSearch
        placeholder={label}
        defaultActiveFirstOption
        filterOption={false}
        onSearch={handleSearch}
        showArrow={false}
        style={{ width: '200px' }}
        notFoundContent={null}
        labelInValue={true}
        options={suggestions.map(
          (place): DefaultOptionType => ({
            value: place.id,
            label: place.address.label,
          })
        )}
      />
    </Form.Item>
  );
};

export default PlaceInput;
