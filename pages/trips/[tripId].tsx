import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Descriptions } from 'antd';
import { Session } from 'next-auth';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { getServerSideProps } from '../dashboard/trips';
import styles from '../../styles/Trip.module.css';

const Trip = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation(['trip', 'common']);
  const { data, error, isLoading } = useSWR(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url, {
        headers: {
          ...AuthService.getAuthHeaders(session.accessToken as string),
          'Accept-Language': i18n.language,
        },
      });
      return response.data;
    }
  );

  if (isLoading) {
    return <div className="content">{t('loading', { ns: 'common' })}</div>;
  }

  if (error) {
    return (
      <div className="content">{t('errors.common', { ns: 'common' })}</div>
    );
  }

  return (
    <div className={`content ${styles.root}`}>
      <h1>{t('tripDetails')}</h1>
      <Descriptions
        title={
          <>
            {data.origin.name} &mdash; {data.dest.name}
          </>
        }
        layout="vertical"
      >
        <Descriptions.Item label={t('tripDate')}>
          {new Date(data.date).toLocaleString(i18n.language)}
        </Descriptions.Item>
        <Descriptions.Item label={t('driver')}>
          <div className={styles.driver}>
            <div className={styles.imgContainer}>
              <Image
                src={data.driver.photo}
                width={100}
                height={100}
                alt="driver photo"
              />
            </div>
            <div>{data.driver.first_name}</div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t('contacts')}>
          <div>
            {data.driver.phone_number && (
              <>
                <span>
                  {t('phone')}: {data.driver.phone_number}
                </span>
                <br />
              </>
            )}
            {data.driver.telegram_username && (
              <span>Telegram: {data.driver.telegram_username}</span>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t('price')}>
          &euro;{data.price}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

Trip.auth = true;

export { getServerSideProps };

export default Trip;
