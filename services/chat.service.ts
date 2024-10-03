import { Message } from '../components/Chat';
import { Trip, User } from '../components/Trips';
import BaseService from './baseService';

export interface Chat {
  id: string;
  trip: Trip;
  participants: User[];
  last_message: Message;
  unread_messages: number;
}

interface StartChatInputData {
  user_id: number;
  trip_id: number;
}

class ChatService extends BaseService {
  startChat(data: StartChatInputData) {
    return this.api.post(`/conversations/start/`, data)
  }

  getChats() {
    return this.api.get('/conversations/');
  }

  getChat(chatId: string) {
    return this.api.get(`/conversations/${chatId}/`);
  }
}

export default ChatService;
