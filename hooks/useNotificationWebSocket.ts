import { useSession } from 'next-auth/react';
import useWebSocket, { Options } from 'react-use-websocket';

export const useNotificationWebSocket = (options: Options) => {
  const { data: session } = useSession();
  return useWebSocket(
    session?.user ? `ws://127.0.0.1:8000/ws/notifications/?token=${session?.accessToken}` : null,
    options
  );
}