export interface DocsCmsConfig {
  apiKey?: string;
  cmsUrl: string;
  datasetEndpoint?: string;
  websiteId?: string;
}

function readTrimmed(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

/** Read the Median settings from the server environment only (the API key never ships). */
export function getCmsConfig(): DocsCmsConfig {
  return {
    apiKey: readTrimmed(process.env.MEDIAN_API_KEY),
    cmsUrl: readTrimmed(process.env.MEDIAN_CMS_URL) ?? 'https://app.mediancms.com',
    datasetEndpoint: readTrimmed(process.env.DATASET_ENDPOINT),
    websiteId: readTrimmed(process.env.MEDIAN_WEBSITE_ID),
  };
}
