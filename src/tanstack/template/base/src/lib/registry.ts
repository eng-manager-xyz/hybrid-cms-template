import type { BlockComponentRegistry } from 'cms-renderer';

/**
 * CMS UI element name → the React component that renders it. Each component
 * receives `content` (the block's fields), `layout`, `routeParams` and `path`:
 *
 *   import Hero from '@/components/Hero';
 *   export const registry = { hero: Hero };
 *
 * Run `bun run generate-schemas` for typed content (src/generated/cms-schemas.ts).
 */
export const registry: Partial<BlockComponentRegistry> = {};
