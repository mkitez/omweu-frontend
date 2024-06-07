import SubscriptionService from '../../services/subscription.service';

import { createApiHook } from './hookFactory';

const useSubscriptionApi = createApiHook<SubscriptionService>(SubscriptionService);
export { useSubscriptionApi };
