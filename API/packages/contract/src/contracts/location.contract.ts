import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  LocationSchema,
  createLocationSchema,
  locationParamsSchema,
  updateLocationSchema,
} from '../schemas/location.schema';

const c = initContract();

export const locationContract = c.router({
  getAll: {
    method: 'GET',
    path: '/api/locations',
    responses: { 200: z.array(LocationSchema) },
    summary: 'Lister les localisations',
    description: 'Retourne la liste de toutes les localisations Foxhole.',
    metadata: { tags: ['Localisations'] },
  },
  getById: {
    method: 'GET',
    path: '/api/locations/:id',
    pathParams: locationParamsSchema,
    responses: {
      200: LocationSchema,
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Récupérer une localisation par son ID',
    description: 'Retourne une localisation par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Localisations'] },
  },
  create: {
    method: 'POST',
    path: '/api/locations',
    body: createLocationSchema,
    responses: { 201: LocationSchema },
    summary: 'Créer une localisation',
    description: 'Crée une nouvelle localisation et la retourne.',
    metadata: { tags: ['Localisations'] },
  },
  createRange: {
    method: 'POST',
    path: '/api/locations/Range',
    body: createLocationSchema.array(),
    responses: { 201: LocationSchema.array() },
    summary: 'Créer plusieurs localisations',
    description: 'Crée plusieurs localisations en une seule opération.',
    metadata: { tags: ['Localisations'] },
  },
  upsertRange: {
    method: 'POST',
    path: '/api/locations/upsertRange',
    body: createLocationSchema.array(),
    responses: { 200: LocationSchema.array() },
    summary: 'Upsert plusieurs localisations',
    description: 'Crée ou met à jour plusieurs localisations en une transaction, matchées par nom.',
    metadata: { tags: ['Localisations'] },
  },
  update: {
    method: 'PUT',
    path: '/api/locations/:id',
    pathParams: locationParamsSchema,
    body: updateLocationSchema,
    responses: {
      200: LocationSchema,
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Mettre à jour une localisation',
    description: 'Met à jour partiellement une localisation par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Localisations'] },
  },
  delete: {
    method: 'DELETE',
    path: '/api/locations/:id',
    pathParams: locationParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Supprimer une localisation',
    description: 'Supprime une localisation par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Localisations'] },
  },
});
