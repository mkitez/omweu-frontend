import { useSession } from 'next-auth/react';
import useWebSocket, { Options } from 'react-use-websocket';

export const useChatWebSocket = (chatId: string, options: Options) => {
  const { data: session } = useSession();
  return useWebSocket(
    `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${session?.accessToken}`,
    { shouldReconnect: () => true, ...options }
  );
}