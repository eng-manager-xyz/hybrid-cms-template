export function readPostIconName(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const icon = value as Record<string, unknown>;
  for (const key of ['value', 'name', 'label', 'icon', 'id', 'slug']) {
    const candidate = icon[key];
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return undefined;
}

export function readPostApiIcon(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  return [
    'get',
    'post',
    'put',
    'delete',
    'head',
    'options',
    'patch',
    'connect',
    'trace',
    'custom',
  ].includes(normalized)
    ? normalized
    : undefined;
}
