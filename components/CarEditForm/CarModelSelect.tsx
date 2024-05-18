import { Select, SelectProps } from 'antd';
import { Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';

import { useCarApi } from '../../hooks/api/useCarsApi';

interface Model {
  id: number;
  name: string;
}

type Props = {
  brandId: number | null;
} & SelectProps;

const CarModelSelect: React.FC<Props> = ({ brandId, ...rest }) => {
  const carApi = useCarApi();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!brandId) {
      return;
    }
    setFetching(true);
    carApi.getBrandModels(brandId).then((response) => {
      setOptions(
        response.data.map((brand: Model) => ({
          label: brand.name,
          value: brand.id,
        }))
      );
      setFetching(false);
    });
  }, [brandId, carApi]);

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
      {...rest}
    />
  );
};

export default CarModelSelect;
