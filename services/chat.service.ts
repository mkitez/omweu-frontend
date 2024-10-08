import { Message } from '../components/Chat';
import { Trip, User } from '../components/Trips';
import BaseService from './baseService';

export interface Chat {
  id: string;
  trip: Trip;
  participants: User[];
  last_message: Message;
  unread_count: number;
}

interface StartChatInputData {
  user_id: number;
  trip_slug: string;
  message: string;
}

class ChatService extends BaseService {
  startChat(data: StartChatInputData) {
    return this.api.post(`/conversations/start/`, data)
  }

  getChats() {
    return this.api.get('/conversations/');
  }

  getChat(tripSlug: string, userId: number) {
    return this.api.get(`/trips/${tripSlug}/chat/${userId}/`);
  }
}

export default ChatService;
