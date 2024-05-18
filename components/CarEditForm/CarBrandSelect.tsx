import { Select } from 'antd';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import { useCarApi } from '../../hooks/api/useCarsApi';

interface Brand {
  id: number;
  name: string;
}

interface Option {
  label: string;
  value: string;
}

const CarBrandSelect = ({ ...props }) => {
  const carApi = useCarApi();
  const [options, setOptions] = useState<Option[]>([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    setFetching(true);
    carApi.getCarBrands().then((response) => {
      setOptions(
        response.data.map((brand: Brand) => ({
          label: brand.name,
          value: brand.id,
        }))
      );
      setFetching(false);
    });
  }, [carApi]);

  const filterOption = (input: string, option?: Option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      labelInValue
      showSearch
      showArrow={false}
      filterOption={filterOption}
      options={options}
      notFoundContent={fetching ? <Spin /> : null}
      {...props}
    />
  );
};

export default CarBrandSelect;
