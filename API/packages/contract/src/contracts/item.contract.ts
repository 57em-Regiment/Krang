import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  ItemSchema,
  createItemSchema,
  itemParamsSchema,
  updateItemSchema,
} from '../schemas/item.schema';

const c = initContract();

export const itemContract = c.router({
  getAll: {
    method: 'GET',
    path: '/api/items',
    responses: { 200: z.array(ItemSchema) },
    summary: 'Lister les items',
    description: 'Retourne la liste de tous les items Foxhole.',
    metadata: { tags: ['Items'] },
  },
  getById: {
    method: 'GET',
    path: '/api/items/:id',
    pathParams: itemParamsSchema,
    responses: {
      200: ItemSchema,
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Récupérer un item par son ID',
    description: 'Retourne un item par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Items'] },
  },
  create: {
    method: 'POST',
    path: '/api/items',
    body: createItemSchema,
    responses: { 201: ItemSchema },
    summary: 'Créer un item',
    description: 'Crée un nouvel item et le retourne.',
    metadata: { tags: ['Items'] },
  },
  upsert: {
    method: 'POST',
    path: '/api/items/upsert',
    body: createItemSchema,
    responses: { 200: ItemSchema },
    summary: 'Upsert un item',
    description: 'Crée l\'item s\'il n\'existe pas (matché par nom), sinon le met à jour. Retourne l\'item résultant.',
    metadata: { tags: ['Items'] },
  },
  upsertRange: {
    method: 'POST',
    path: '/api/items/upsertRange',
    body: createItemSchema.array(),
    responses: { 200: ItemSchema.array() },
    summary: 'Upsert plusieurs items',
    description: 'Crée ou met à jour plusieurs items en une transaction, matchés par nom. Retourne les items résultants.',
    metadata: { tags: ['Items'] },
  },
  update: {
    method: 'PUT',
    path: '/api/items/:id',
    pathParams: itemParamsSchema,
    body: updateItemSchema,
    responses: {
      200: ItemSchema,
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Mettre à jour un item',
    description: 'Met à jour partiellement un item par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Items'] },
  },
  delete: {
    method: 'DELETE',
    path: '/api/items/:id',
    pathParams: itemParamsSchema,
    body: c.noBody(),
    responses: {
      204: z.null(),
      404: z.object({ message: z.string(), code: z.string() }),
    },
    summary: 'Supprimer un item',
    description: 'Supprime un item par son UUID. Retourne 404 si introuvable.',
    metadata: { tags: ['Items'] },
  },
});
