import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { errorHandler } from '@/shared/errors/errorHandler';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import Fastify from 'fastify';
import { itemRoutes } from './services/item/item.route';
import { locationRoutes } from './services/location/location.route';
import { maintenanceRoutes } from './services/maintenance/maintenance.route';
import { regionRoutes } from './services/region/region.route';
import { townRoutes } from './services/town/town.route';

export function buildApp() {
  const app = Fastify({ logger: { level: 'error' } });

  app.addHook('onRequest', (req, _reply, done) => {
    logger.info(
      `→ reqId:"${req.id}" ${req.method} ${req.url} from:${req.host} user:${req.user ? req.user.username : 'no user'} msg:"incoming request"`,
    );
    done();
  });

  app.addHook('onResponse', (req, reply, done) => {
    logger.info(
      `← reqId:"${req.id}" ${req.method} ${req.url} ${reply.statusCode} ${reply.elapsedTime.toFixed(2)}ms msg:"request completed"`,
    );
    done();
  });

  app.register(cors, {
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  app.register(itemRoutes, { prefix: '/api/items' });
  app.register(regionRoutes, { prefix: '/api/regions' });
  app.register(townRoutes, { prefix: '/api/towns' });
  app.register(locationRoutes, { prefix: '/api/locations' });
  app.register(maintenanceRoutes, { prefix: '/api/maintenance' });

  return app;
}
