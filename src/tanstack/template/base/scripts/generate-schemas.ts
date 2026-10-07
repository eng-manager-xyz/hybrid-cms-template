import { mkdir, writeFile } from 'node:fs/promises';
import { Median } from 'cms-renderer';

const output = './src/generated/cms-schemas.ts';
const { MEDIAN_API_KEY, MEDIAN_WEBSITE_ID, DATASET_ENDPOINT } = process.env;

if (!MEDIAN_WEBSITE_ID || !MEDIAN_API_KEY || !DATASET_ENDPOINT) {
  console.error(
    '[generate-schemas] Set MEDIAN_WEBSITE_ID, MEDIAN_API_KEY and DATASET_ENDPOINT in .env first.'
  );
  process.exit(1);
}

const median = new Median({
  apiKey: MEDIAN_API_KEY,
  datasetEndpoint: DATASET_ENDPOINT,
  websiteId: MEDIAN_WEBSITE_ID,
  registry: {},
});
const schemas = await median.schemas();
await mkdir('./src/generated', { recursive: true });
await writeFile(output, await median.generateSchemas(schemas), 'utf-8');
console.log(`[generate-schemas] Wrote ${schemas.length} component schemas to ${output}`);
