import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, List, message, Modal, Tag, Tooltip } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Subscription } from '../../services/subscription.service';

import { useSubscriptionApi } from '../../hooks/api/useSubscriptionsApi';
import styles from './SubscriptionList.module.css';

type Props = {
  data: Subscription[];
};

const SubscriptionList: React.FC<Props> = ({ data }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const router = useRouter();
  const api = useSubscriptionApi();
  const [loading, setLoading] = useState(false);
  const [subToDelete, setSubToDelete] = useState<number | null>(null);

  const getDateRange = (startDate: string, endDate: string) => {
    let result = dayjs(startDate).locale(i18n.language).format('ll');
    if (startDate !== endDate) {
      const endDateFormatted = dayjs(endDate)
        .locale(i18n.language)
        .format('ll');
      result = `${result} — ${endDateFormatted}`;
    }
    return result;
  };

  const handleDelete = async () => {
    if (subToDelete === null) {
      return;
    }
    setLoading(true);
    try {
      await api.deleteSubscription(subToDelete);
      message.success(t('notifications.subscription_delete'));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
    }
    setLoading(false);
    setSubToDelete(null);
    await router.replace(router.asPath);
  };

  return (
    <>
      <div className={styles.description}>{t('subscriptions.description')}</div>
      <div className={styles.main}>
        {data.length > 0 ? (
          <List
            dataSource={data.sort((a, b) =>
              dayjs(b.start_date).diff(dayjs(a.start_date))
            )}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Tooltip key="delete" title={t('subscriptions.delete')}>
                    <Button
                      icon={<DeleteOutlined className={styles.deleteIcon} />}
                      type="text"
                      danger
                      shape="circle"
                      onClick={() => setSubToDelete(item.id)}
                    />
                  </Tooltip>,
                ]}
                className={styles.listItem}
              >
                <List.Item.Meta
                  title={`${item.origin.name} — ${item.destination.name}`}
                  description={getDateRange(item.start_date, item.end_date)}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className={styles.noContent}>
            {t('subscriptions.no_content')}
          </div>
        )}
      </div>
      <div className={styles.btnContainer}>
        <Link href="/new-subscription" passHref legacyBehavior>
          <Button icon={<PlusCircleOutlined />}>
            {t('subscriptions.create')}
          </Button>
        </Link>
      </div>
      <Modal
        open={subToDelete !== null}
        title={t('subscriptions.delete_modal.title')}
        okText={t('subscriptions.delete_modal.ok')}
        cancelText={t('subscriptions.delete_modal.cancel')}
        onOk={handleDelete}
        confirmLoading={loading}
        onCancel={() => setSubToDelete(null)}
      >
        {t('subscriptions.delete_modal.body')}
      </Modal>
    </>
  );
};

export default SubscriptionList;
