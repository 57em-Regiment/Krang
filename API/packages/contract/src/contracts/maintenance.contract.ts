import { initContract } from '@ts-rest/core';
import z from 'zod';

const c = initContract();

export const maintenanceContract = c.router({
  renenutet: {
    method: 'POST',
    path: '/api/maintenance',
    summary: 'Synchro Krang & Renenutet',
    description:
      'Triggers a full synchronisation between Krang and Renenutet: pushes all locations and items by ID to the Renenutet API.',
    body: z.undefined(),
    responses: { 200: z.undefined() },
  },
});
