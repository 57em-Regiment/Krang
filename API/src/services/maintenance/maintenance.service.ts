import { env } from '@/config/env';
import { contract } from '@57eme-regiment/renenutet-api-contract';
import { initClient } from '@ts-rest/core';
import { injectable } from 'tsyringe';
import { ItemRepository } from '../item/item.repository';
import { LocationRepository } from '../location/location.repository';

@injectable()
export class MaintenanceService {
  private renenutetClient = initClient(contract, {
    baseUrl: env.RENENUTET_SERVICE_URL,
  });

  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly itemRepository: ItemRepository,
  ) {}
  async renenutet(): Promise<void> {
    const locations = await this.locationRepository.findAll();
    const locationsBody = locations.map(l => ({ id: l.id }));
    this.renenutetClient.locationRef.drop();
    this.renenutetClient.locationRef.createRange({ body: locationsBody });

    const items = await this.itemRepository.findAll();
    const itemsBody = items.map(i => ({ id: i.id }));
    this.renenutetClient.itemRef.drop();
    this.renenutetClient.itemRef.createRange({ body: itemsBody });
  }
}
