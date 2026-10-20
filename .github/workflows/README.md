# CI/CD Pipeline

Numbered reusable workflows, one responsibility each, numbered by dependency
order. The number sorts them in the file tree and documents the cascade. The
chain follows the shared `00`–`04` architecture; this repo uses the first three.

```text
00-install-deps  ← primes the pnpm store cache (keyed on pnpm-lock.yaml)
01-ci            ← format, lint, type-check, audit, tests + coverage gate, build
02-tag-sync      ← orchestrator: CI gate → immutable vX.Y.Z tag
```

There is no `03-publish` (the app is private, nothing goes to a registry) and
no `04-docs` (no docs site). Vercel deploys `main` through its Git integration,
outside this cascade.

Only `02-tag-sync` (push to `main`), `01-ci` (pull requests) and manual
dispatches start a run. `00-install-deps` is `workflow_call` only.

## Toolchain

- **pnpm**: version read from `packageManager` in `package.json` by
  `pnpm/action-setup` (no `version:` input — passing both fails the action).
- **Node**: version read from `.nvmrc` by `actions/setup-node`.
- **Install**: always `pnpm install --frozen-lockfile`. The store cache is keyed
  on `pnpm-lock.yaml`.

## `01-ci` jobs

| Job          | Command                                         | Gates    |
| ------------ | ----------------------------------------------- | -------- |
| `quality`    | `pnpm format:check`, `pnpm lint`                | yes      |
| `type-check` | `pnpm type-check` (`vue-tsc`, src + tests)      | yes      |
| `security`   | `pnpm audit --audit-level high --prod`          | own lane |
| `test`       | `pnpm test:coverage` (thresholds in vitest cfg) | yes      |
| `build`      | `pnpm build` (Vite → `dist/` artifact)          | yes      |

Together they are `pnpm check` plus the dependency audit and the coverage gate.
`security` reads an external advisory feed, so it never gates the other jobs.

## Release modes

`02-tag-sync` does **not** bump the version — a human writes it in
`package.json`. One `tag_action` drives the release:

| Context                            | `tag_action` | Tag                 |
| ---------------------------------- | ------------ | ------------------- |
| push to `main`, version is new     | `create`     | `vX.Y.Z`            |
| push to `main`, tag already exists | `skip`       | none                |
| `workflow_dispatch` off `main`     | `preview`    | none                |
| pull request                       | —            | none (`01-ci` only) |

## Tag immutability

- **`vX.Y.Z`** — created once, **never force-pushed**. Bump the version to
  release again.
- No floating alias (`vX-latest`): nothing consumes this app by tag, so only
  the release tag exists.

## CI gates everything

`tag-sync` runs `needs: ci`, where `ci: uses: ./01-ci.yml`. A failing format,
lint, type-check, test or build step blocks the tag.

A workflow alone does not block a merge: make the `01 · CI` jobs required
status checks in the branch protection of `main`.

## Local equivalents

```bash
# 01-ci
pnpm check                              # format, lint, type-check, tests, build
pnpm test:coverage                      # coverage thresholds
pnpm audit --audit-level high --prod
```
