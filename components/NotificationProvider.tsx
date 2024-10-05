import { notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';

import UnreadChatsContext from '../contexts/UnreadChatsContext';
import { useChatApi } from '../hooks/api/useChatApi';
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';
import { Message } from './Chat';
import UserAvatar from './TripDetails/UserAvatar';
import { User } from './Trips';

interface MessageNotificationData {
  type: 'message_notification';
  from_user: User;
  message: Message;
}

interface UnreadChatsCountNotificationData {
  type: 'unread_chats';
  chats: Set<string>;
}

type NotificationData =
  | MessageNotificationData
  | UnreadChatsCountNotificationData;

const NotificationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());
  const { status } = useSession();
  const chatApi = useChatApi();
  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    chatApi
      .getUnreadChats()
      .then((response) => setUnreadChats(new Set(response.data.chats)));
  }, [chatApi, status]);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (data: MessageNotificationData) => {
    api.open({
      message: (
        <div className="notification-message">
          <UserAvatar user={data.from_user} small />
          <div>{data.from_user.first_name}</div>
        </div>
      ),
      description: (
        <div className="notification-description">{data.message.content}</div>
      ),
      placement: 'bottomRight',
      className: 'notification',
      key: data.message.id,
      duration: 0,
      onClick: () => {
        router.push(`/chat/${data.message.conversation_id}`);
        api.destroy();
      },
    });
  };
  useNotificationWebSocket({
    onMessage: (e) => {
      const data = JSON.parse(e.data) as NotificationData;
      if (data.type === 'message_notification') {
        const { conversation_id: chatId } = data.message;
        setUnreadChats((prev) => new Set(prev).add(chatId));
        if (router.query.chatId === chatId) {
          return;
        }
        showNotification(data);
      }
      if (data.type === 'unread_chats') {
        setUnreadChats(data.chats);
      }
    },
  });

  return (
    <UnreadChatsContext.Provider value={unreadChats}>
      {contextHolder}
      {children}
    </UnreadChatsContext.Provider>
  );
};

export default NotificationProvider;
