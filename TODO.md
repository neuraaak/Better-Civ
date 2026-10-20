# TODO

Items deferred from the October 2026 code review. Each one keeps its review ID.

## CI pipeline

- [x] **01-CONF-003 — Add a CI workflow.** Done: `.github/workflows/` `00-install-deps` →
      `01-ci` (format, lint, `vue-tsc`, `pnpm audit --prod`, `test:coverage`, build) →
      `02-tag-sync` (CI gate, then immutable `vX.Y.Z` tag on a version bump).
      Remaining manual step: mark the `01 · CI` jobs as required status checks on `main`.

## Vercel deployment

- [x] **01-CONF-009 — Move `vercel.json` off the legacy `builds` / `routes` format.** Done:
      `framework: "vite"`, `installCommand` with `--frozen-lockfile`, `buildCommand`,
      `outputDirectory`; `functions` and `env` dropped. No SPA `rewrites`: the app has no
      router, so unknown paths answer a real 404.
- [x] **01-PERF-004 — Cache hashed assets.** Done: `/assets/*` served with
      `Cache-Control: public, max-age=31536000, immutable`. With no fallback, an asset request
      can never receive `index.html`.
- [ ] **01-QUAL-008 — Add security headers.** `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy` are enforced. The CSP (including `frame-ancestors 'none'`) ships
      as `Content-Security-Policy-Report-Only`. Remaining: check the browser console on a
      deployment for CSP reports, then rename the header to `Content-Security-Policy`.
- [x] **01-CONF-008 (deploy part) — Clean up deploy scripts.** Done: `utils/deploy.*` and
      the `deploy*` scripts removed; Vercel deploys through its Git integration.
