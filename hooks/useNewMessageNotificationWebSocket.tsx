import { notification } from 'antd';
import { useRouter } from 'next/router';

import { Message } from '../components/Chat';
import UserAvatar from '../components/TripDetails/UserAvatar';
import { User } from '../components/Trips';
import { useNotificationWebSocket } from './useNotificationWebSocket';

interface MessageNotificationData {
  type: string;
  from_user: User;
  message: Message;
}

export const useNewMessageNotificationWebSocket = () => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  useNotificationWebSocket({
    onMessage: (e) => {
      const data = JSON.parse(e.data) as MessageNotificationData;
      if (router.query.chatId === data.message.conversation_id) {
        return;
      }
      const { id: key } = data.message;
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
        key,
        duration: 0,
        onClick: () => {
          router.push(`/chat/${data.message.conversation_id}`);
          api.destroy();
        },
      });
    },
  });
  return contextHolder;
};
