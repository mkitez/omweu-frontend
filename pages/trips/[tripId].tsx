import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Descriptions } from 'antd';
import api from '../../services/api';

const Trip = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url);
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data) {
    return (
      <Descriptions title={`${data.origin.name} - ${data.dest.name}`}>
        <Descriptions.Item label="Trip date">{data.date}</Descriptions.Item>
      </Descriptions>
    );
  }
};

export default Trip;
