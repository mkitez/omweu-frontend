import { useSession } from 'next-auth/react';
import useWebSocket, { Options } from 'react-use-websocket';

import { HOSTNAME } from '../utils/constants';

export const useNotificationWebSocket = (options: Options) => {
  const { data: session } = useSession();
  return useWebSocket(
    session?.user
      ? `wss://${HOSTNAME}/ws/notifications/?token=${session?.accessToken}`
      : null,
    { shouldReconnect: () => true, share: true, ...options }
  );
};
