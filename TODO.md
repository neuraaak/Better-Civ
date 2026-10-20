# TODO

Items deferred from the October 2026 code review. Each one keeps its review ID.

## CI pipeline

- [x] **01-CONF-003 — Add a CI workflow.** Done: `.github/workflows/` `00-install-deps` →
      `01-ci` (format, lint, `vue-tsc`, `pnpm audit --prod`, `test:coverage`, build) →
      `02-tag-sync` (CI gate, then immutable `vX.Y.Z` + `vX-latest` on a version bump).
      Remaining manual step: mark the `01 · CI` jobs as required status checks on `main`.

## Vercel deployment

- [ ] **01-CONF-009 — Move `vercel.json` off the legacy `builds` / `routes` format.** It
      bypasses framework detection, and `env.NODE_ENV` has no effect on a static build. Target:
      `framework: "vite"`, `buildCommand: "pnpm build"`, `outputDirectory: "dist"`, an SPA
      `rewrites` rule to `/index.html`; drop `functions` and `env`.
- [ ] **01-PERF-004 — Cache hashed assets.** Serve `/assets/*` with
      `Cache-Control: public, max-age=31536000, immutable`. Check that the SPA fallback never
      answers asset requests with `index.html`.
- [ ] **01-QUAL-008 — Add security headers.** `Content-Security-Policy` (allow
      `https://eyefyre.github.io` in `connect-src` and `img-src` for the civvapi data and
      icons), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
      `frame-ancestors 'none'`. Fonts are now self-hosted, so no third-party font origin is
      needed.
- [ ] **01-CONF-008 (deploy part) — Clean up deploy scripts.** `deploy:win` / `deploy:ps` run
      Windows-only scripts in `utils/` that call `npm run build` and a global `vercel` CLI.
      Remove them in favour of `pnpm deploy`, and either declare `vercel` as a devDependency
      or rely on the Vercel Git integration.
