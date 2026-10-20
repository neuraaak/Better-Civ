# Better-Civ

Better-Civ is a Vue 3 application for exploring and comparing the civilizations of Civilization V.

## Installation

```bash
git clone https://github.com/neuraaak/Better-Civ.git
cd Better-Civ
corepack enable
pnpm install --frozen-lockfile
```

## Development

```bash
pnpm dev
```

The development server is available at `http://localhost:5173`.

Use `pnpm preview` to serve the latest production build locally.

## Build

```bash
pnpm build
```

This creates the production bundle in `dist/`.

## Testing

```bash
pnpm test:run
pnpm test:coverage
```

Use `pnpm test` for watch mode and `pnpm test:ui` to open the Vitest interface.

## Quality and Maintenance

```bash
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm format
pnpm format:check
pnpm validate:quick
pnpm check
```

- `pnpm lint` checks JavaScript, TypeScript, Vue, test, and configuration files.
- `pnpm lint:fix` applies automatic lint fixes where possible.
- `pnpm type-check` runs `vue-tsc` on the sources and the tests without emitting files.
- `pnpm format` rewrites supported files with Prettier; use `pnpm format:check` in CI or before committing.
- `pnpm validate:quick` runs linting and type checking.
- `pnpm check` runs formatting checks, linting, type checking, tests, and a production build.

`pnpm install` enables the Husky Git hooks (`prepare` script). The pre-commit hook runs lint-staged, which formats staged files with Prettier and fixes them with ESLint.

For dependency and workspace upkeep:

```bash
pnpm deps:check
pnpm deps:audit
pnpm clean
```

`pnpm deps:check` lists available dependency updates, `pnpm deps:audit` checks known vulnerabilities, and `pnpm clean` removes generated build files. The `deps:update*` scripts update dependency ranges and should be reviewed before use.

## Deployment

```bash
pnpm deploy:dev
pnpm deploy
```

`pnpm deploy:dev` creates a Vercel preview deployment. `pnpm deploy` builds the project and publishes it to production.

## License

This project is released under the MIT License.
