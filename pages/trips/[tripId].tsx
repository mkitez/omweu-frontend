import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Descriptions } from 'antd';
import { Session } from 'next-auth';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { getServerSideProps } from '../dashboard/trips';

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
    return <div>{t('loading', { ns: 'common' })}</div>;
  }

  if (error) {
    return <div>{t('errors.common', { ns: 'common' })}</div>;
  }

  return (
    <div className="content">
      <h1>{t('tripDetails')}</h1>
      <Descriptions title={`${data.origin.name} - ${data.dest.name}`}>
        <Descriptions.Item>
          {new Date(data.date).toLocaleString(i18n.language)}
        </Descriptions.Item>
        <Descriptions.Item>
          <Image
            src={data.driver.photo}
            width={20}
            height={20}
            alt="driver photo"
          />{' '}
          {data.driver.first_name}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export { getServerSideProps };

export default Trip;
