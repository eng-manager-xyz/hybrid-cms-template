import { Median } from 'cms-renderer';
import { registry } from './registry';

/** The CMS origin that frames draft previews; their edit messages go only there. */
export const cmsUrl = process.env.MEDIAN_CMS_URL || 'https://app.mediancms.com';

/**
 * The site's Median client, or `null` until MEDIAN_WEBSITE_ID and DATASET_ENDPOINT are set.
 * Server-only: it holds the API key.
 */
export const median =
  process.env.MEDIAN_WEBSITE_ID && process.env.DATASET_ENDPOINT
    ? new Median({
        apiKey: process.env.MEDIAN_API_KEY,
        datasetEndpoint: process.env.DATASET_ENDPOINT,
        websiteId: process.env.MEDIAN_WEBSITE_ID,
        registry,
        // Published pages are read once per build; draft reads are never cached.
        revalidate: false,
      })
    : null;

/** The URL path of an optional catch-all route's segments. */
export const pathOf = (slug: string[] = []) => `/${slug.map(decodeURIComponent).join('/')}`;
