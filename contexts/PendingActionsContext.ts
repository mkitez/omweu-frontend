import { createContext } from 'react';
import { PendingActionsState } from '../components/NotificationProvider';

const PendingActionsContext = createContext<PendingActionsState>({ chats: new Set(), bookings: new Set() });

export default PendingActionsContext;
