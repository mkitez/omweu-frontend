import SubscriptionService from '../subscription.service';
import { createApiGetter } from './apiFactory';

const getSubscriptionApi = createApiGetter<SubscriptionService>(SubscriptionService);
export { getSubscriptionApi };
