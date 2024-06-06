import { Destination } from '../components/Trips';
import BaseService from './baseService';

export interface Subscription {
  id: number;
  origin: Destination;
  destination: Destination;
  start_date: string;
  end_date: string;
}

export interface SubscriptionInputData {
  origin_id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
}

class SubscriptionService extends BaseService {
  getCurrentUserSubscriptions() {
    return this.api.get('/subscriptions/');
  }

  getSubscriptions(subscriptionId: number) {
    return this.api.get(`/subscriptions/${subscriptionId}/`);
  }

  createSubscription(data: SubscriptionInputData) {
    return this.api.post('/subscriptions/', data);
  }

  deleteSubscription(tripId: number) {
    return this.api.delete(`/subscriptions/${tripId}/`);
  }
}

export default SubscriptionService;
