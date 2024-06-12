import DestinationService from '../destination.service';
import { createApiGetter } from './apiFactory';

const getDestinationApi = createApiGetter<DestinationService>(DestinationService);
export { getDestinationApi };
