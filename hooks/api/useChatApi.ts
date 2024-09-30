import ChatService from '../../services/chat.service';

import { createApiHook } from './hookFactory';

const useChatApi = createApiHook<ChatService>(ChatService);
export { useChatApi };
