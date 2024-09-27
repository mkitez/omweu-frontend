import BaseService from './baseService';

interface StartChatInputData {
  user_id: string
}

class ChatService extends BaseService {
  startChat(data: StartChatInputData) {
    return this.api.post(`/conversations/start/`, data)
  }

  getChat(chatId: string) {
    return this.api.get(`/conversations/${chatId}/`);
  }
}

export default ChatService;
