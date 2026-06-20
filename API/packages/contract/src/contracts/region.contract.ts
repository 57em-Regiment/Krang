import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  RegionSchema,
  createRegionSchema,
  regionParamsSchema,
  updateRegionSchema,
} from '../schemas/region.schema';

const c = initContract();

export const regionContract = c.router(
  {
    getAll: c.query({
      method: 'GET',
      path: '/',
      responses: { 200: z.array(RegionSchema) },
      summary: 'Lister les régions',
      description: 'Retourne la liste de toutes les régions Foxhole.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_READ,
      },
    }),
    getById: c.query({
      method: 'GET',
      path: '/:id',
      pathParams: regionParamsSchema,
      responses: {
        200: RegionSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Récupérer une région par son ID',
      description:
        'Retourne une région par son UUID. Retourne 404 si introuvable.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_READ,
      },
    }),
    create: c.mutation({
      method: 'POST',
      path: '/',
      body: createRegionSchema,
      responses: { 201: RegionSchema },
      summary: 'Créer une région',
      description: 'Crée une nouvelle région et la retourne.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_CREATE,
      },
    }),
    createRange: c.mutation({
      method: 'POST',
      path: '/range',
      body: createRegionSchema.array(),
      responses: { 201: RegionSchema.array() },
      summary: 'Créer plusieurs régions',
      description: 'Crée plusieurs régions en une seule opération.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_CREATE,
      },
    }),
    upsert: c.mutation({
      method: 'POST',
      path: '/upsert',
      body: createRegionSchema,
      responses: { 200: RegionSchema },
      summary: 'Upsert une région',
      description:
        "Crée la région si elle n'existe pas, sinon la met à jour (matchée par nom).",
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_UPDATE,
      },
    }),
    upsertRange: c.mutation({
      method: 'POST',
      path: '/upsertRange',
      body: createRegionSchema.array(),
      responses: { 200: RegionSchema.array() },
      summary: 'Upsert plusieurs régions',
      description:
        'Crée ou met à jour plusieurs régions en une transaction, matchées par nom.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_UPDATE,
      },
    }),
    update: c.mutation({
      method: 'PUT',
      path: '/:id',
      pathParams: regionParamsSchema,
      body: updateRegionSchema,
      responses: {
        200: RegionSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Mettre à jour une région',
      description:
        'Met à jour partiellement une région par son UUID. Retourne 404 si introuvable.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_UPDATE,
      },
    }),
    delete: c.mutation({
      method: 'DELETE',
      path: '/:id',
      pathParams: regionParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Supprimer une région',
      description:
        'Supprime une région par son UUID. Retourne 404 si introuvable.',
      metadata: {
        tags: ['Régions'],
        permission: PERMISSIONS.KRANG_REGIONS_DELETE,
      },
    }),
  },
  { pathPrefix: '/api/regions' },
);
