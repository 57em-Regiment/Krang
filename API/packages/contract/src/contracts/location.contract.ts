import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  LocationNamesSchema,
  LocationSchema,
  createLocationSchema,
  locationParamsSchema,
  updateLocationSchema,
} from '../schemas/location.schema';

const c = initContract();

export const locationContract = c.router(
  {
    getAll: c.query({
      method: 'GET',
      path: '/',
      responses: { 200: z.array(LocationSchema) },
      summary: 'Lister les localisations',
      description: 'Retourne la liste de toutes les localisations Foxhole.',
      metadata: { tags: ['Localisations'] },
    }),
    getById: c.query({
      method: 'GET',
      path: '/:id',
      pathParams: locationParamsSchema,
      responses: {
        200: LocationSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Récupérer une localisation par son ID',
      description:
        'Retourne une localisation par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Localisations'] },
    }),
    getNames: c.query({
      method: 'GET',
      path: '/:id/names',
      pathParams: locationParamsSchema,
      responses: {
        200: LocationNamesSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: "Récupérer les noms d'une localisation",
      description:
        'Retourne les noms associés à une localisation par son UUID.',
      metadata: { tags: ['Localisations'] },
    }),
    create: c.mutation({
      method: 'POST',
      path: '/',
      body: createLocationSchema,
      responses: { 201: LocationSchema },
      summary: 'Créer une localisation',
      description: 'Crée une nouvelle localisation et la retourne.',
      metadata: { tags: ['Localisations'] },
    }),
    createRange: c.mutation({
      method: 'POST',
      path: '/Range',
      body: createLocationSchema.array(),
      responses: { 201: LocationSchema.array() },
      summary: 'Créer plusieurs localisations',
      description: 'Crée plusieurs localisations en une seule opération.',
      metadata: { tags: ['Localisations'] },
    }),
    upsertRange: c.mutation({
      method: 'POST',
      path: '/upsertRange',
      body: createLocationSchema.array(),
      responses: { 200: LocationSchema.array() },
      summary: 'Upsert plusieurs localisations',
      description:
        'Crée ou met à jour plusieurs localisations en une transaction, matchées par nom.',
      metadata: { tags: ['Localisations'] },
    }),
    update: c.mutation({
      method: 'PUT',
      path: '/:id',
      pathParams: locationParamsSchema,
      body: updateLocationSchema,
      responses: {
        200: LocationSchema,
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Mettre à jour une localisation',
      description:
        'Met à jour partiellement une localisation par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Localisations'] },
    }),
    delete: c.mutation({
      method: 'DELETE',
      path: '/:id',
      pathParams: locationParamsSchema,
      body: c.noBody(),
      responses: {
        204: z.null(),
        404: z.object({ message: z.string(), code: z.string() }),
      },
      summary: 'Supprimer une localisation',
      description:
        'Supprime une localisation par son UUID. Retourne 404 si introuvable.',
      metadata: { tags: ['Localisations'] },
    }),
  },
  { pathPrefix: '/api/locations' },
);
