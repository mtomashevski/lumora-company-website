# Phase 1: validated server foundation

Scope: approved architecture/repository/environment preparation only. No Phase 2 CMS migration, database, authentication, booking, PayPal integration or email service has been implemented. Existing public content/assets and production Pages workflow are preserved. Main and origin/main remain at `2500bceec670a92ee2336f5fdaf155f6a96bb025`.

## What was validated

The isolated `v2/` app proves React Router framework SSR with Vite, hydration, reusable V1 visual components, server-only modules, locale route parameters, server metadata and a resource route. The entry page chooses stored locale only after hydration; explicit locale URLs always win. HTML rendered without JavaScript contains real EN/MK tour content and the logo. IT/TR routes show English with an explicit fallback notice and `main lang="en"`; this is route feasibility, not completed four-language localization.

Public spike routes: `/`, `/en/`, `/mk/`, `/it/`, `/tr/`, and `/:locale/experiences/:existing-slug`. All five stable slugs work. Unknown locale/slug/path returns an actual HTTP 404 with safe UI. `/health` is a minimal no-store JSON resource route. The spike is noindex, has no booking endpoints and displays technical validation controls only in its separate local app.

Preserved components: official Brand/logo, Image and ExperienceCard plus existing CSS and catalog records. Two shared changes preserve V1 defaults: LanguageProvider can receive an explicit SSR language/disable preference persistence; ExperienceCard accepts an optional locale route prefix. V1 pages/components were not migrated. Empty feature/admin/payment directories and fictitious service adapters were deliberately not created.

## Compatibility findings

| Package/runtime | Validated version / finding |
| --- | --- |
| Node / pnpm | 24.19.0 locally / 11.25.0; CI uses Node 24 |
| React / React DOM | Existing resolved 19.3.0 unchanged |
| Vite / TypeScript | Existing 8.3.1 / 6.0.3 unchanged |
| React Router | 7.18.4, aligned direct framework runtime dependency |
| Framework dev / Node / serve | `@react-router/*` 7.18.4; exact versions |
| Vercel preset | `@vercel/react-router` 1.3.7; declares Router 7 peers |
| Bot detection runtime | `isbot` 5.2.2, required by official server entry |

Registry latest Router framework was 8.4.0; upgrading blindly would conflict with the installed Vercel adapter's Router 7 peer requirement. The matching Router 7.18.4 framework declares Vite 8 and TypeScript 6 support and passed actual builds/runtime tests. No major incompatibility required an architecture change. Node/isbot must be runtime dependencies for the official default Node server entry; keeping Node adapter only in devDependencies prevents runtime autodetection. No Sanity/Supabase/PayPal/Resend SDK was installed.

Framework emits nonfatal Vite `envFile` deprecation and Router 8 future-flag migration warnings. They are not browser exceptions; retain the tested Router 7 stack and review upgrades as a separate controlled change. Initial development dependency discovery produced an outdated-optimize-dependency reload; explicit browser dependency prebundling resolves the observed development hydration failure. Production hydration independently passes.

All existing app/Node TypeScript code passed a strict-mode trial without a broad rewrite. `strict: true` is now enabled in both existing configs; V2 config and Phase 1 tests also use strict checking. Runtime input validation remains necessary; types alone do not secure APIs.

## Minimal structure and boundaries

```text
v2/
  app/root.tsx, routes.ts       Framework document and route declarations
  app/locales.ts               Shared, non-secret locale validation/fallback
  app/routes/                  Thin page/loaders and health resource route
  app/server/*.server.ts       Configuration validation and synthetic server proof
  vite.config.ts               Isolated Vite config; shared public/ assets
  react-router.config.ts       Local Node or opt-in Vercel build target
  tsconfig.json                Strict framework/shared/test checks
tests/v2/                      Environment tests + SSR/browser integration tests
scripts/check-v2-boundaries.mjs Positive bundle scan + intentional negative build
scripts/build-v2-vercel.mjs     Preset build + local generated-server execution
.github/workflows/v2-ci.yml    Validation only, no deploy permissions/steps
docs/v2/                      Foundation, threat model and authority matrix
```

The temporary `v2/app/server` path keeps the spike isolated. Later approved migration can move to `src/server` with the same required `.server.ts` suffix. A plain directory named `server` alone is not the framework boundary. Pure types/DTOs/locale helpers contain no Node imports or secrets. Components use public DTOs and do not import services. Resource/page loaders call server modules; route files themselves must not be named `.server`, because Router extracts their server exports and builds their client components separately.

Future content services return validated published Sanity DTOs; operational services perform authoritative database workflows. Validation lives at server entry and domain transaction boundaries, with shared non-secret validation types where useful. Auth, booking and payment service modules will be server-only and built only in their approved phases. No browser-only localStorage/window access during SSR initialization; use effects/client event handlers. Do not serialize whole server config, session, customer or provider objects from loaders.

Enforcement now: Router rejects `.server` modules in the client graph; an actual negative build tests this. ESLint forbids server/Node imports and process.env reads in browser/shared `src`. V2 disables automatic Vite environment export entirely (`envPrefix: []`); only deliberately returned public DTOs can reach client code. Server config rejects nonempty unapproved VITE keys. Build artifacts are scanned with synthetic marker values in server/payment/database/email variable slots. Marker content and server environment references must be absent from browser output. This verifies current boundaries, not all future application security.

## Environment strategy

Root `.env.example` has empty public/server variable placeholders and comments; actual `.env`, `.env.*` except templates remain ignored. Build directories, generated Router types, Vercel output, test reports and node_modules are ignored. The pnpm workspace policy approves only esbuild's required binary-setup script; other install scripts remain unapproved.

`APP_ENV` is independent of `NODE_ENV`: local production builds are still development service environments. Allowed values are development/staging/production. Local default origin is `http://127.0.0.1:5190`; staging/production require an explicitly supplied absolute HTTPS `SITE_ORIGIN`, with no path/credentials. Vercel execution requires explicit staging/production mode and cannot silently default to development. Do not infer a production domain or connect services from a build mode.

| Environment | Service/data isolation |
| --- | --- |
| Development | Local spike only now; future synthetic data, development dataset/local DB and sandbox-only integrations |
| Staging | Separate host/project, CMS dataset and Supabase project; sandbox merchant and approved test email recipients |
| Production | Separate protected credentials/projects and actual approved origin; live payments/email only after explicit launch gate |

For optional local config copy the root template to `v2/.env.local` (ignored), supply APP_ENV/SITE_ORIGIN only if needed, and leave future credentials empty. Vite loads the V2 env directory during dev/build. The production server reads host process environment; it does not automatically read local env files. Set server runtime configuration in the host secret store. Tests use synthetic values only, never accounts.

Public/allowlisted identifiers eventually include Sanity project/dataset/API version, Supabase URL/publishable key and PayPal client ID; this does not automatically make them browser exports. Secret values include Sanity read/preview/write/webhook tokens, Supabase secret/legacy service-role key, PayPal client secret, Resend key/webhook secret and session secret. No secrets may use VITE names. Exact account/configuration requests will be made in the phase needing them, with destination and public/secret classification. Nothing is required for Phase 1.

## Run and validate

From repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev:v2                 # http://127.0.0.1:5190; separate from pnpm dev (V1)
pnpm typecheck
pnpm typecheck:v2
pnpm lint
pnpm test:v2:unit
pnpm check:v2:boundaries     # builds positive SSR output and exercises rejected import
pnpm test:v2                # starts/stops production Node server itself
pnpm test:v2:dev            # same SSR/hydration tests against the development server
pnpm build:v2:vercel        # local preset/server-runtime proof; does not deploy
```

Stop V2 dev before boundary testing (temporary source mutation restored in finally) or production browser tests (same port). For manually serving a built spike, set PORT=5190 in the shell and run `pnpm serve:v2`. Tests use installed Edge locally; set PLAYWRIGHT_CHANNEL=chromium and install Playwright Chromium on other machines. Preserve V1 checks using `pnpm build` then `pnpm test` with TEST_PAGES_MODE=1, TEST_BASE_PATH=/lumora-company-website/, TEST_BASE_URL=http://127.0.0.1:4180.

Local validation: frozen install, both strict type checks, lint, 5 environment/locale unit tests, positive/negative boundary builds, 6 SSR/browser tests in each of production and development modes, and 25 unchanged V1 regression tests pass. SSR tests assert actual HTML elements (not merely serialized loader JSON), all 20 locale/tour combinations, JavaScript-disabled rendering, explicit URL precedence, persistence, blocked storage, metadata, assets, 375px overflow, hydration exceptions and 404s. Vercel preset generates a Node server bundle/manifest and its actual generated bundle executes locally, returning SSR HTML. These are feasibility proofs, not full V2 implementation.

## CI and source-control isolation

The existing `deploy-pages.yml` is byte-for-byte unchanged. New `v2-ci.yml` validates V2 branch pushes, PRs and manual runs; it has contents-read permission only and no publishing/deployment stage. It installs frozen dependencies/browser, checks both type configs/lint/unit tests, builds/scans SSR boundaries, tests production hydration, validates the Vercel target and runs the V1 production regression suite. It uses synthetic configuration and no provider secrets. GitHub-hosted results must be read from the actual branch workflow run, not inferred from local success.

V2 commits stay on `codex/lumora-v2-assessment`. Publishing that development branch for CI does not trigger Pages, which deploys main only. No merge, main push, branch-protection changes or hosting connection is part of Phase 1. Branch protection/required CI checks must be enabled later by the repository owner once the check name exists; do not claim they are already configured.

## Vercel feasibility and future manual setup

Local `build:v2:vercel` enables the official preset only for the spike and writes separate `build-vercel` output plus ignored `.vercel/react-router-build-result.json`. The script loads the generated Node bundle through Router's request handler and asserts SSR/HTTP 200. No Vercel account/token is needed for this proof. It is not a deployed-cloud smoke test, and does not validate platform limits, custom domain/DNS or provider webhooks.

When a separately authorized preview is requested: Lumora should own the Vercel team/project; invite developers with least privilege. Create a separate staging project from this repository/V2 branch, limit GitHub app installation to this repository, and do not attach the Lumora production domain. Use React Router framework detection, Node 24, repository-root frozen pnpm install and `pnpm build:v2:vercel`; verify the platform monorepo/root-directory handling of `v2/.vercel` build metadata before deploying. A real platform smoke test may require refining this isolated-spike root arrangement; the generated adapter/runtime proof does not certify a full root-level Vercel project configuration.

Configure APP_ENV=staging and an approved HTTPS SITE_ORIGIN in both preview build/runtime environments; define the actual project URL only after provisioning. Future server credentials go into scoped host environments, never frontend settings. Keep automatic production deploys off, review which branch is configured as Production Branch, protect staging access and test each domain/redirect. GitHub integration requires selected-repository read/deployment/check access requested by Vercel; no write/admin permission to arbitrary repositories or Pages deployment is needed.

Vercel Hobby is restricted to personal, non-commercial use. Do not assume real-business staging qualifies merely because payments are in sandbox. Use a commercial-appropriate paid team/plan or obtain an applicable provider arrangement; confirm current terms, compute/bandwidth/function/seat limits and costs before account selection. No purchase/account action is needed now.

## Remaining risks and next gate

No architectural blocker was found in the tested pinned stack. Hosted Vercel behavior and Linux-hosted CI execution remain evidence to obtain from actual platform runs. Current framework warnings need upgrade planning. Shared LanguageProvider still contains the original EN/MK UI behavior; the spike wraps locale routing, not a complete localization migration. CMS content, four reviewed languages, auth, bookings, real inventory and payment reconciliation are unimplemented future phases.

Phase 2 recommendation: only after separate approval, create the owner-owned Sanity development project/dataset, define content schemas and draft-preview security, then repeatably import the five tours/assets with stable IDs/slugs. Preserve original source, review copy/rights and test draft/public visibility and V1 parity. Request exact Sanity configuration then; do not start database/payments or invent translations as part of that migration.

Related: [approved architecture](../V2-ARCHITECTURE.md), [threat model](THREAT-MODEL.md), [source-of-truth matrix](DATA-AUTHORITY.md).

Primary references: [Router 7 server-module boundary](https://reactrouter.com/7.18.4/api/framework-conventions/server-modules), [Vercel React Router preset/SSR](https://vercel.com/docs/frameworks/frontend/react-router), [Vercel Hobby eligibility](https://vercel.com/docs/plans/hobby). Package peer declarations were checked from the registry and installed manifests, then validated by actual builds.
