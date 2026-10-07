import { Median } from 'cms-renderer';
import { docsBlockRegistry } from './block-registry';
import { getCmsConfig } from './cms-config.server';

let median: Median | undefined;

/** The docs' Median client. Server-only: it holds the API key. */
export function getMedian(): Median {
  if (!median) {
    const { apiKey, datasetEndpoint, websiteId } = getCmsConfig();
    if (!websiteId || !datasetEndpoint) {
      throw new Error('MEDIAN_WEBSITE_ID and DATASET_ENDPOINT must be set to read the docs.');
    }
    median = new Median({
      apiKey,
      datasetEndpoint,
      websiteId,
      registry: docsBlockRegistry,
      // Published pages are read once per build; draft reads are never cached.
      revalidate: false,
    });
  }
  return median;
}
