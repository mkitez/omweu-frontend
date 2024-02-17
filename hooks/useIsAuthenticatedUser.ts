import { useSession } from 'next-auth/react';
import { User } from '../components/Trips';

export const useIsAuthenticatedUser = (driver?: User | null) => {
  const { data: session } = useSession();
  const isDriver = driver?.id.toString() === session?.user.id?.toString();
  return isDriver;
};
