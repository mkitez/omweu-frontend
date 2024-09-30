import ChatService from '../chat.service';
import { createApiGetter } from './apiFactory';

const getChatApi = createApiGetter<ChatService>(ChatService);
export { getChatApi };
