import { notification } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';

import PendingActionsContext from '../contexts/PendingActionsContext';
import { useChatApi } from '../hooks/api/useChatApi';
import { useUserApi } from '../hooks/api/useUserApi';
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';
import { Message } from './Chat';
import UserAvatar from './TripDetails/UserAvatar';
import { User } from './Trips';

interface MessageNotificationData {
  type: 'message_notification';
  from_user: User;
  message: Message;
}

interface BookingNotificationData {
  type: 'booking_notification';
  action:
    | 'NEW_BOOKING'
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_REJECTED'
    | 'BOOKING_CANCELLED';
  booking_id: string;
}

interface UnreadChatsNotificationData {
  type: 'unread_chats';
  chats: string[];
}

interface PendingBookingsNotificationData {
  type: 'pending_bookings';
  bookings: string[];
}

type NotificationData =
  | MessageNotificationData
  | UnreadChatsNotificationData
  | PendingBookingsNotificationData
  | BookingNotificationData;

export interface PendingActionsState {
  chats: Set<string>;
  bookings: Set<string>;
}

const NotificationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const { status } = useSession();
  const chatApi = useChatApi();
  const userApi = useUserApi();

  const [pendingActions, setPendingActions] = useState<PendingActionsState>({
    chats: new Set(),
    bookings: new Set(),
  });
  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    userApi.getPendingActions().then((response) => {
      const { chats, bookings } = response.data;
      setPendingActions({ chats: new Set(chats), bookings: new Set(bookings) });
    });
  }, [userApi, status]);

  const showMessageNotification = (data: MessageNotificationData) => {
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
      onClick: () => {
        const { conversation, from_user: fromUser, id } = data.message;
        router.push(`/chat/${conversation.trip_slug}/${fromUser}`);
        api.destroy(id);
      },
    });
  };

  const showBookingNotification = (data: BookingNotificationData) => {
    const { booking_id: bookingId, action } = data;
    api.open({
      message: (
        <div className="notification-message">
          {t(`bookingNotifications.${action}`)}
        </div>
      ),
      description: (
        <div className="notification-description">
          {t('bookingNotifications.clickForDetails')}
        </div>
      ),
      placement: 'bottomRight',
      className: 'notification',
      key: bookingId,
      onClick: () => {
        router.push(`/bookings/${bookingId}`);
        api.destroy(bookingId);
      },
    });
  };

  useNotificationWebSocket({
    onMessage: (e) => {
      const data = JSON.parse(e.data) as NotificationData;
      if (data.type === 'message_notification') {
        const { conversation, from_user: fromUser } = data.message;
        setPendingActions((prev) => ({
          ...prev,
          chats: new Set(prev.chats).add(conversation.id),
        }));
        if (router.asPath === `/chat/${conversation.trip_slug}/${fromUser}`) {
          return;
        }
        showMessageNotification(data);
      }
      if (data.type === 'booking_notification') {
        if (data.action === 'NEW_BOOKING') {
          setPendingActions((prev) => ({
            ...prev,
            bookings: new Set(prev.bookings).add(data.booking_id),
          }));
        }
        showBookingNotification(data);
      }
      if (data.type === 'unread_chats') {
        setPendingActions((prev) => ({ ...prev, chats: new Set(data.chats) }));
      }
      if (data.type === 'pending_bookings') {
        setPendingActions((prev) => ({
          ...prev,
          bookings: new Set(data.bookings),
        }));
      }
    },
  });

  return (
    <PendingActionsContext.Provider value={pendingActions}>
      {contextHolder}
      {children}
    </PendingActionsContext.Provider>
  );
};

export default NotificationProvider;
