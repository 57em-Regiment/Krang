import { env } from '@/config/env';
import { logger } from '@/config/logger';
import '@57eme-regiment/auth-server';
import { createErrorHandler } from '@57eme-regiment/nabu-errors';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import apiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import { itemRoutes } from './services/item/item.route';
import { locationRoutes } from './services/location/location.route';
import { maintenanceRoutes } from './services/maintenance/maintenance.route';
import { regionRoutes } from './services/region/region.route';
import { townRoutes } from './services/town/town.route';

export function buildApp() {
  const app = Fastify({ logger: { level: 'error' }, ignoreTrailingSlash: true });

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
  app.setErrorHandler(createErrorHandler(logger));

  if (env.ALLOWED_HOST) {
    app.addHook('onRequest', (request, reply, done) => {
      const host = request.headers.host ?? '';
      const hostname = host.split(':')[0];
      if (hostname !== env.ALLOWED_HOST) {
        reply.code(404).send();
        return;
      }
      done();
    });
  }

  if (env.NODE_ENV !== 'production') {
    const baseTransform = createJsonSchemaTransform({});
    app.register(fastifySwagger, {
      openapi: {
        info: { title: 'Krang API', version: '1.0.0' },
      },
      transform: document => {
        try {
          return baseTransform(document);
        } catch (err) {
          logger.warn(
            `[swagger] transform failed for ${document.url} — schema hidden. ${err}`,
          );
          return { schema: { hide: true }, url: document.url };
        }
      },
    });
    app.register(apiReference, {
      routePrefix: '/docs',
      configuration: {
        hideClientButton: true,
        hideDarkModeToggle: true,
        hiddenClients: true,
        metaData: {
          title: 'Renenutet API docs',
        },
        operationTitleSource: 'summary',
        persistAuth: true,
      },
    });
  }

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  app.register(itemRoutes);
  app.register(regionRoutes);
  app.register(townRoutes);
  app.register(locationRoutes);
  app.register(maintenanceRoutes);

  app.get('/openapi.json', async (req, res) => {
    return app.swagger();
  });

  return app;
}
