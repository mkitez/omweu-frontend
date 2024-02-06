import { useSession } from 'next-auth/react';
import { User } from '../components/Trips';

export const useIsDriver = (driver?: User | null) => {
  const { data: session } = useSession();
  const isDriver = driver?.id.toString() === session?.user.id;
  return isDriver;
};
