import { Select, Form } from 'antd';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { GOOGLE_API_KEY } from '../utils/constants';

interface Props {
  name: string;
  label?: string;
}

const PlaceInput = ({ name, label }: Props) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: GOOGLE_API_KEY,
      options: {
        types: ['(cities)'],
      },
    });

  const handleSearch = async (newValue: string) => {
    getPlacePredictions({ input: newValue });
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
        loading={isPlacePredictionsLoading}
        defaultActiveFirstOption
        filterOption={false}
        onSearch={handleSearch}
        showArrow={false}
        style={{ width: '200px' }}
        notFoundContent={null}
        options={placePredictions.map((place) => {
          return {
            value: place.place_id,
            label: place.description,
          };
        })}
      />
    </Form.Item>
  );
};

export default PlaceInput;
