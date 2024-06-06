import { List } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

import { Subscription } from '../../services/subscription.service';

type Props = {
  data: Subscription[];
};

const SubscriptionList: React.FC<Props> = ({ data }) => {
  const { i18n } = useTranslation();

  const getDateRange = useCallback(
    (startDate: string, endDate: string) => {
      let result = dayjs(startDate).locale(i18n.language).format('ll');
      if (startDate !== endDate) {
        const endDateFormatted = dayjs(endDate)
          .locale(i18n.language)
          .format('ll');
        result = `${result} — ${endDateFormatted}`;
      }
      return result;
    },
    [i18n.language]
  );

  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={`${item.origin.name} — ${item.destination.name}`}
            description={getDateRange(item.start_date, item.end_date)}
          />
        </List.Item>
      )}
    />
  );
};

export default SubscriptionList;
