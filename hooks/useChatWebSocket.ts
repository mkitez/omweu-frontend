import { useSession } from 'next-auth/react';
import useWebSocket, { Options } from 'react-use-websocket';

export const useChatWebSocket = (chatId: string | null, options: Options) => {
  const { data: session } = useSession();
  return useWebSocket(
    chatId ? `ws://127.0.0.1:8000/ws/chat/${chatId}/?token=${session?.accessToken}` : null,
    { shouldReconnect: () => true, ...options }
  );
}