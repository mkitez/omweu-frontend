import { Select, SelectProps } from 'antd';
import { Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('car');
  const carApi = useCarApi();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [fetching, setFetching] = useState(false);

  const otherModelLabel = t('other_model');
  useEffect(() => {
    if (!brandId) {
      return;
    }
    setFetching(true);
    carApi.getBrandModels(brandId).then((response) => {
      setOptions(
        response.data.map((model: Model) => ({
          label: model.name === 'other' ? otherModelLabel : model.name,
          value: model.id,
        }))
      );
      setFetching(false);
    });
  }, [brandId, carApi, otherModelLabel, t]);

  const filterOption = (input: string, option?: DefaultOptionType) =>
    (option?.label ?? '')
      .toString()
      .toLowerCase()
      .includes(input.toLowerCase()) || option?.label === otherModelLabel;

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
