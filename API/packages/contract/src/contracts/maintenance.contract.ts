import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { initContract } from '@ts-rest/core';
import z from 'zod';

const c = initContract();

export const maintenanceContract = c.router(
  {
    renenutet: c.mutation({
      method: 'POST',
      path: '/',
      body: c.noBody(),
      responses: { 200: z.null() },
      summary: 'Synchro Krang → Renenutet',
      description:
        'Déclenche une synchronisation complète entre Krang et Renenutet : ' +
        "pousse toutes les localisations et items par ID vers l'API Renenutet.",
      metadata: {
        tags: ['Maintenance'],
        permission: PERMISSIONS.KRANG_MAINTENANCE_RENENUTET,
      },
    }),
  },
  { pathPrefix: '/api/maintenance' },
);
