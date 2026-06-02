import { ItemController } from '@/services/item/item.controller';
import { ItemRepository } from '@/services/item/item.repository';
import { ItemService } from '@/services/item/item.service';
import { LocationController } from '@/services/location/location.controller';
import { LocationRepository } from '@/services/location/location.repository';
import { LocationService } from '@/services/location/location.service';
import { MaintenanceController } from '@/services/maintenance/maintenance.controller';
import { MaintenanceService } from '@/services/maintenance/maintenance.service';
import { RegionController } from '@/services/region/region.controller';
import { RegionRepository } from '@/services/region/region.repository';
import { RegionService } from '@/services/region/region.service';
import { TownController } from '@/services/town/town.controller';
import { TownRepository } from '@/services/town/town.repository';
import { TownService } from '@/services/town/town.service';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Database } from './database';

container.registerSingleton(Database);

container.registerSingleton(ItemRepository);
container.registerSingleton(ItemService);
container.registerSingleton(ItemController);

container.registerSingleton(RegionRepository);
container.registerSingleton(RegionService);
container.registerSingleton(RegionController);

container.registerSingleton(TownRepository);
container.registerSingleton(TownService);
container.registerSingleton(TownController);

container.registerSingleton(LocationRepository);
container.registerSingleton(LocationService);
container.registerSingleton(LocationController);

container.registerSingleton(MaintenanceService);
container.registerSingleton(MaintenanceController);

export { container };
