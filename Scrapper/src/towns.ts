import {
  type CreateTown,
  type Region,
} from '@57eme-regiment/krang-api-contract';
import { fetchTownsInRegions } from '../api/war/warApi.api.js';
import type { ApiClient } from './api.js';

export const scrapTowns = async (
  api: ApiClient,
  regions: Region[],
): Promise<void> => {
  console.log(`[Towns] Processing ${regions.length} regions...`);

  for (const region of regions) {
    console.log(`[Towns] ${region.name} — fetching...`);
    const response = await fetchTownsInRegions(region.gameName);

    await api.region.upsert({
      body: {
        name: region.name,
        gameRegionId: response.regionId,
        gameName: region.gameName,
      },
    });

    const body = response.mapTextItems.map(
      t =>
        ({
          name: t.text,
          longitude: t.x,
          latitude: t.y,
          mapMarkerType: t.mapMarkerType,
          regionId: region.id,
        }) satisfies CreateTown,
    );

    const res = await api.town.upsertRange({ body });
    if (res.status !== 200)
      throw new Error(`Town upsert failed for region ${region.name}`, {
        cause: res,
      });

    console.log(` ${res.body.length} towns\n`);
  }

  console.log('[Towns] Done\n');
};
