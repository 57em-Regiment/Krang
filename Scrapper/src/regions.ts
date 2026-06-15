import {
  type CreateRegion,
  type Region,
} from '@57eme-regiment/krang-api-contract';
import { fetchRegions } from '../api/war/warApi.api.js';
import type { ApiClient } from './api.js';

export const scrapRegions = async (api: ApiClient): Promise<Region[]> => {
  console.log('[Regions] Fetching from war API...');
  const names = await fetchRegions();
  console.log(`[Regions] Found ${names.length} regions`);

  const formatName = (name: string) =>
    name
      .replace(/Hex$/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();

  const body = names.map(
    name => ({ name: formatName(name), gameName: name }) satisfies CreateRegion,
  );

  const res = await api.region.upsertRange({ body });
  if (res.status !== 200)
    throw new Error('Region upsert failed', { cause: res });

  console.log(`[Regions] Done — ${res.body.length} regions upserted\n`);
  return res.body;
};
