import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  TownSchema,
  createTownSchema,
  townParamsSchema,
  updateTownSchema,
} from '../schemas/town.schema';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';

const c = initContract();

export const townContract = c.router(
  {
    getAll: c.query({
      method: 'GET',
      path: '/',
      responses: { 200: z.array(TownSchema) },
      summary: 'Lister les villes',
      description: 'Retourne la liste de toutes les villes Foxhole.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_READ },
    }),
    getById: c.query({
      method: 'GET',
      path: '/:id',
      pathParams: townParamsSchema,
      responses: {
        200: TownSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Récupérer une ville par son ID',
      description:
        'Retourne une ville par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_READ },
    }),
    create: c.mutation({
      method: 'POST',
      path: '/',
      body: createTownSchema,
      responses: { 201: TownSchema },
      summary: 'Créer une ville',
      description: 'Crée une nouvelle ville et la retourne.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_CREATE },
    }),
    createRange: c.mutation({
      method: 'POST',
      path: '/Range',
      body: createTownSchema.array(),
      responses: { 201: TownSchema.array() },
      summary: 'Créer plusieurs villes',
      description: 'Crée plusieurs villes en une seule opération.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_CREATE },
    }),
    upsertRange: c.mutation({
      method: 'POST',
      path: '/upsertRange',
      body: createTownSchema.array(),
      responses: { 200: TownSchema.array() },
      summary: 'Upsert plusieurs villes',
      description:
        'Crée ou met à jour plusieurs villes en une transaction, matchées par nom.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_UPDATE },
    }),
    update: c.mutation({
      method: 'PUT',
      path: '/:id',
      pathParams: townParamsSchema,
      body: updateTownSchema,
      responses: {
        200: TownSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Mettre à jour une ville',
      description:
        'Met à jour partiellement une ville par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_UPDATE },
    }),
    delete: c.mutation({
      method: 'DELETE',
      path: '/:id',
      pathParams: townParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Supprimer une ville',
      description:
        'Supprime une ville par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Villes'], permission: PERMISSIONS.KRANG_TOWNS_DELETE },
    }),
  },
  { pathPrefix: '/api/towns' },
);
