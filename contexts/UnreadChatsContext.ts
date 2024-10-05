import { createContext } from 'react';

const UnreadChatsContext = createContext<Set<string>>(new Set());

export default UnreadChatsContext;
