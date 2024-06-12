import { GetServerSideProps } from "next";
import { getTripApi } from "../services/serverSide/tripApi";
import { Trip } from "../components/Trips";
import cmsApi from '../services/cmsApi';

const BASE_URL = 'https://eubycar.com'

const generateSiteMap = (trips: Trip[], categorySlugs: string[]) => {
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
      .map((slug) => `
         <url>
           <loc>${`${BASE_URL}/faq/${slug}`}</loc>
         </url>
       `)
      .join('')}
     ${trips
      .map(({ id, last_updated }) => `
       <url>
         <loc>${`${BASE_URL}/trips/${id}`}</loc>
         <lastmod>${last_updated}</lastmod>
       </url>
     `)
      .join('')}
   </urlset>
 `;
}

const SiteMap = () => { }

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  const tripApi = getTripApi(null, locale)

  let trips: Trip[] = [];
  try {
    const tripsResponse = await tripApi.getTripsForNextMonth()
    trips = tripsResponse.data;
  }
  catch (e) {
    console.error('Failed to fetch trips for the next month')
  }

  const categoriesResponse = await cmsApi.get('categories', {
    params: { locale },
  });
  const categorySlugs = categoriesResponse.data.data.map((category: any) => category.attributes.slug);

  const sitemap = generateSiteMap(trips, categorySlugs);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
