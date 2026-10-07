import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Median } from 'cms-renderer';
import { getCmsConfig } from '../src/lib/cms-config.server';

const output = './src/generated/cms-schemas.ts';

const { apiKey, datasetEndpoint, websiteId } = getCmsConfig();
if (!websiteId || !apiKey || !datasetEndpoint) {
  console.error(
    '[generate-schemas] Set MEDIAN_WEBSITE_ID, MEDIAN_API_KEY and DATASET_ENDPOINT in .env first.'
  );
  process.exit(1);
}

const median = new Median({ apiKey, datasetEndpoint, websiteId, registry: {} });
const schemas = await median.schemas();
await mkdir(dirname(output), { recursive: true });
await writeFile(output, await median.generateSchemas(schemas), 'utf-8');
console.log(`[generate-schemas] Wrote ${schemas.length} component schemas to ${output}`);
