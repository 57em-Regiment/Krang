export * from './contracts/item.contract';
export * from './contracts/location.contract';
export * from './contracts/region.contract';
export * from './contracts/town.contract';
export * from './enums';
export * from './schemas/item.schema';
export * from './schemas/location.schema';
export * from './schemas/region.schema';
export * from './schemas/town.schema';

import { initContract } from '@ts-rest/core';
import { itemContract } from './contracts/item.contract';
import { locationContract } from './contracts/location.contract';
import { maintenanceContract } from './contracts/maintenance.contract';
import { regionContract } from './contracts/region.contract';
import { townContract } from './contracts/town.contract';

const c = initContract();

export const contract = c.router({
  item: itemContract,
  location: locationContract,
  maintenance: maintenanceContract,
  region: regionContract,
  town: townContract,
});
