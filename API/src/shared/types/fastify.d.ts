import type { AuthorizedUser } from '@57eme-regiment/auth-contracts';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthorizedUser;
  }
}
