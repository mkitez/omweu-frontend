import { useSession } from 'next-auth/react';
import useWebSocket, { Options } from 'react-use-websocket';

import { HOSTNAME } from '../utils/constants';

export const useChatWebSocket = (chatId: string | null, options: Options) => {
  const { data: session } = useSession();
  return useWebSocket(
    chatId
      ? `wss://${HOSTNAME}/ws/chat/${chatId}/?token=${session?.accessToken}`
      : null,
    { shouldReconnect: () => true, ...options }
  );
};
