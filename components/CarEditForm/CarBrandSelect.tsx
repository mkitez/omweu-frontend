import { Select } from 'antd';
import { Spin } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import { useEffect, useState } from 'react';

import { useCarApi } from '../../hooks/api/useCarsApi';

interface Brand {
  id: number;
  name: string;
}

const CarBrandSelect: React.FC<SelectProps> = ({ ...props }) => {
  const carApi = useCarApi();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
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

  const filterOption = (input: string, option?: DefaultOptionType) =>
    (option?.label ?? '')
      .toString()
      .toLowerCase()
      .includes(input.toLowerCase());

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
