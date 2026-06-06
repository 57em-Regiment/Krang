import { LocationRepository } from '@/services/location/location.repository';
import {
  CreateLocation,
  Location,
  UpdateLocation,
} from '@57eme-regiment/krang-api-contract';
import { AppError } from '@57eme-regiment/nabu-errors';
import { LocationNames } from 'packages/contract/dist';
import { injectable } from 'tsyringe';
import { RegionService } from '../region/region.service';
import { TownService } from '../town/town.service';

@injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly townService: TownService,
    private readonly regionService: RegionService,
  ) {}

  async getAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  async getById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location)
      throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
    return location;
  }
  async getNames(id: string): Promise<LocationNames> {
    const location = await this.locationRepository.findById(id);
    if (!location)
      throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');

    const region = await this.regionService.getById(location.regionId);

    const town = await this.townService.getById(location.townId);

    return { ...location, region: { ...region }, town: { ...town } };
  }

  async create(data: CreateLocation): Promise<Location> {
    return this.locationRepository.create(data);
  }

  async createRange(data: CreateLocation[]): Promise<Location[]> {
    return this.locationRepository.createRange(data);
  }

  async upsertRange(data: CreateLocation[]): Promise<Location[]> {
    return this.locationRepository.upsertRange(data);
  }

  async update(id: string, data: UpdateLocation): Promise<Location> {
    await this.getById(id);
    return this.locationRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.locationRepository.delete(id);
  }
}
