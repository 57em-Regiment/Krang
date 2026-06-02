# Krang — API

REST API for the Krang project built with Fastify, Prisma, and TypeScript.

---

## @57em-regiment/krang-api-contract

The API contract package provides fully typed schemas and ts-rest contracts for all consumers (frontend, other services).

### Installation

1. Add a `.npmrc` at the root of your project:

```
@57eme-regiment:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN
```

2. Set the `GITHUB_TOKEN` variable with a [Personal Access Token](https://github.com/settings/tokens) that has `read:packages` permission.

3. Install the package:

```bash
pnpm add @57em-regiment/krang-api-contract @ts-rest/core
# or
npm install @57em-regiment/krang-api-contract
```

### Usage

```ts
import { initClient } from '@ts-rest/core';
import { contract } from '@57em-regiment/krang-api-contract';

const api = initClient(contract, {
  baseUrl: 'http://localhost:3000',
  baseHeaders: {},
});

// Fully typed responses
const { body: regions } = await api.region.getAll();
//     ^-- Region[]

const { body: region, status } = await api.region.getById({
  params: { id: '...' },
});
// status 200 → body: Region
// status 404 → body: { message: string, code: string }

const { body: created } = await api.region.create({
  body: { name: 'Deadlands', gameRegionId: 1 },
});
```

### Versioning

| Tag | Description |
|-----|-------------|
| `latest` | Stable release — published on every merge to `main` |
| `beta` | Pre-release — published on every push to any other branch |

Install a beta version:

```bash
pnpm add @57em-regiment/krang-api-contract@beta
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start API + contract in watch mode
pnpm dev:all

# Start API only (requires contract already built)
pnpm dev

# Typecheck
pnpm typecheck

# Build everything
pnpm build
```
