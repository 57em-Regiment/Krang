import {
  type CreateLocation,
  type Region,
} from '@57eme-regiment/krang-api-contract';
import { fetchLocationsInRegions } from '../api/war/warApi.api.js';
import type { ApiClient } from './api.js';
import { getNearestTownId, type DynamicResponse } from './helpers.js';
import {
  IconTypeMap,
  imageBaseUrl,
  LocationTypeByIconMap,
} from './iconTypeMapper.js';

export const scrapLocations = async (
  api: ApiClient,
  regions: Region[],
): Promise<void> => {
  console.log('[Locations] Fetching all towns...');
  const allTownsRes = await api.town.getAll();
  if (allTownsRes.status !== 200)
    throw new Error('Failed to fetch towns', { cause: allTownsRes });
  console.log(`[Locations] Processing ${regions.length} regions...`);

  for (const region of regions) {
    process.stdout.write(`[Locations] ${region.name} — fetching...`);
    const dynamicData = (await fetchLocationsInRegions(
      region.gameName,
    )) as unknown as DynamicResponse;
    const townsInRegion = allTownsRes.body.filter(
      t => t.regionId === region.id,
    );

    const body: CreateLocation[] = [];

    for (const loc of dynamicData.mapItems) {
      body.push({
        type: LocationTypeByIconMap[loc.iconType] ?? 'HOME_BASE',
        faction:
          loc.teamId == 'NONE'
            ? 'NEUTRAL'
            : loc.teamId == 'COLONIALS'
              ? 'COLONIAL'
              : 'WARDEN',
        iconType: loc.iconType,
        icon:
          IconTypeMap[loc.iconType] != null
            ? imageBaseUrl + IconTypeMap[loc.iconType]
            : null,
        flags: loc.flags,
        viewDirection: loc.viewDirection,
        longitude: loc.x,
        latitude: loc.y,
        regionId: region.id,
        townId: getNearestTownId(townsInRegion, loc.x, loc.y),
      } satisfies CreateLocation);
    }

    if (body.length > 0) {
      const res = await api.location.upsertRange({ body });
      if (res.status !== 200)
        throw new Error(`Location upsert failed for region ${region.gameName}`, {
          cause: res,
        });
      process.stdout.write(` ${res.body.length} locations\n`);
    } else {
      process.stdout.write(` 0 locations\n`);
    }
  }

  console.log('[Locations] Done\n');
};
