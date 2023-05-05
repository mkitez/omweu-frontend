import Image from 'next/image';
import { Select, Form, Grid } from 'antd';
import { useTranslation } from 'next-i18next';
import type { DefaultOptionType } from 'antd/es/select';
import { useHereAutocomplete } from '../hooks/useHereAutocomplete';
import location from '../assets/location.svg';
import styles from '../styles/TripSearch.module.css';

interface Props {
  name: string;
  label?: string;
}

const { useBreakpoint } = Grid;

const PlaceInput = ({ name, label }: Props) => {
  const { i18n } = useTranslation();
  const { suggestions, getSuggestions } = useHereAutocomplete({
    lang: i18n.language,
  });
  const { xs } = useBreakpoint();

  const handleSearch = async (newValue: string) => {
    getSuggestions(newValue);
  };

  return (
    <Form.Item
      name={name}
      rules={[
        { required: true, message: 'Please select a place' },
        ({ getFieldValue }) => ({
          async validator() {
            const from = getFieldValue('from')?.value;
            const to = getFieldValue('to')?.value;
            if (!from || !to) {
              return;
            }
            if (from === to) {
              throw Error('Please select different places');
            }
          },
        }),
      ]}
      label={
        xs ? null : (
          <Image src={location} alt="" className={styles.inputFieldIcon} />
        )
      }
      labelCol={{ xs: 5, md: 3 }}
      wrapperCol={{ xs: 18, md: 21 }}
      style={{ margin: 0 }}
    >
      <Select
        bordered={false}
        showSearch
        placeholder={label}
        defaultActiveFirstOption
        filterOption={false}
        onSearch={handleSearch}
        showArrow={false}
        className={styles.input}
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
