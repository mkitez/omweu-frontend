import { useEffect, useState } from 'react';
import { Trip, User } from '../Trips';
import { Message } from '.';
import { useUserApi } from '../../hooks/api/useUserApi';
import { useTripApi } from '../../hooks/api/useTripApi';
import { useChatApi } from '../../hooks/api/useChatApi';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

interface ChatData {
  chatId?: string;
  trip: Trip;
  messages: Message[];
  otherUser: User;
}

interface Params {
  tripSlug: string;
  userId: number;
}

export const useChatData = ({ tripSlug, userId }: Params) => {
  const { t } = useTranslation(['chat', 'common']);
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<ChatData>();

  const userApi = useUserApi();
  const tripApi = useTripApi();
  const chatApi = useChatApi();

  useEffect(() => {
    chatApi
      .getChat(tripSlug, userId)
      .then((response) => {
        if (response.data) {
          const { id, trip, participants, messages } = response.data;
          const otherUser = participants.find(
            (user: User) => user.id !== Number(session?.user.id)
          );
          setData({ chatId: id, trip, messages, otherUser });
          setLoading(false);
        } else {
          return Promise.all([
            userApi.getUser(String(userId)),
            tripApi.getTripBySlug(tripSlug),
          ]);
        }
      })
      .then((responses) => {
        if (!responses) {
          return;
        }
        const [userResponse, tripResponse] = responses;
        setData({
          trip: tripResponse.data,
          messages: [],
          otherUser: userResponse.data,
        });
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          setError(t('errors.common', { ns: 'common' }) as string);
        }
      });
  }, [chatApi, session?.user.id, t, tripApi, tripSlug, userApi, userId]);
  return { loading, data, error, update: setData, setError };
}
