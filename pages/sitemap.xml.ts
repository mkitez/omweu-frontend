import { AxiosBasicCredentials } from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';

import cmsApi from '../services/cmsApi';
import { getDestinationApi } from '../services/serverSide/destinationApi';
import { getTripApi } from '../services/serverSide/tripApi';

import { Destination, Trip } from '../components/Trips';
import { STAFF_USER_EMAIL, STAFF_USER_PASSWORD } from '../utils/constants';

const BASE_URL = 'https://eubycar.com';

const escapeHtml = (toEscape: string) => {
  return toEscape
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

type Route = [Destination, Destination];

const getRouteCombinations = (destinations: Destination[]) => {
  const routes: Route[] = [];
  destinations.forEach((start, i) => {
    const currentDestinations = destinations.slice(i + 1);
    const currentRoutes: Route[] = currentDestinations.map((end) => [
      start,
      end,
    ]);
    routes.push(...currentRoutes);
  });
  return routes;
};

const getRouteUrl = (route: Route, date: string) => {
  const [from, to] = route;
  const fromInput = `${from.name}, ${from.country_name}`;
  const toInput = `${to.name}, ${to.country_name}`;

  const url = `${BASE_URL}/search?date=${date}&from=${from.place_id}&to=${to.place_id}&from_input=${fromInput}&to_input=${toInput}`;
  return encodeURI(url);
};

const getEntriesForDate = (routes: Route[], date: dayjs.Dayjs) => {
  return routes.map((route) => {
    const routeUrl = getRouteUrl(route, date.format('YYYY-MM-DD'));
    const escapedUrl = escapeHtml(routeUrl);
    return `
      <url>
        <loc>${escapedUrl}</loc>
      </url>
    `;
  });
};

const generateSiteMap = (
  trips: Trip[],
  destinations: Destination[],
  categorySlugs: string[]
) => {
  const routes = getRouteCombinations(destinations);
  const returnRoutes = routes.map(([start, end]) => [end, start] as Route);

  const days = Array.from({ length: 15 }, (_, i) => dayjs().add(i * 2, 'day'));

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
     </url>
     <url>
       <loc>${BASE_URL}/auth/signin</loc>
     </url>
     <url>
       <loc>${BASE_URL}/auth/signup</loc>
     </url>
     <url>
       <loc>${BASE_URL}/faq</loc>
     </url>
     ${categorySlugs
       .map(
         (slug) => `
         <url>
           <loc>${`${BASE_URL}/faq/${slug}`}</loc>
         </url>
       `
       )
       .join('')}
     ${trips
       .map(
         ({ slug, last_updated }) => `
       <url>
         <loc>${`${BASE_URL}/trips/${slug}`}</loc>
         <lastmod>${last_updated}</lastmod>
       </url>
     `
       )
       .join('')}
      ${days.map((day) => getEntriesForDate(routes, day)).join('')}
      ${days.map((day) => getEntriesForDate(returnRoutes, day)).join('')}
   </urlset>
 `;
};

const SiteMap = () => {};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  locale,
}) => {
  const tripApi = getTripApi(null, locale);
  const destApi = getDestinationApi(null, locale);
  const auth: AxiosBasicCredentials = {
    username: STAFF_USER_EMAIL || '',
    password: STAFF_USER_PASSWORD || '',
  };

  let trips: Trip[] = [];
  try {
    const tripsResponse = await tripApi.getTripsForNextMonth(auth);
    trips = tripsResponse.data;
  } catch (e) {
    console.error('Failed to fetch trips for the next month');
  }

  let destinations: Destination[] = [];
  try {
    const destResponse = await destApi.getAllDestinations(auth);
    destinations = destResponse.data;
  } catch (e) {
    console.error('Failed to fetch destinations');
  }

  let categorySlugs: string[] = [];
  try {
    const categoriesResponse = await cmsApi.get('categories', {
      params: { locale },
    });
    categorySlugs = categoriesResponse.data.data.map(
      (category: any) => category.attributes.slug
    );
  } catch (e) {
    console.error('Failed to fetch FAQ categories');
  }

  const sitemap = generateSiteMap(trips, destinations, categorySlugs);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
