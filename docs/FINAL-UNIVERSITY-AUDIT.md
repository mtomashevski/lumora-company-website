# Clean university publishing candidate — verification report

Prepared 10 October 2026. This report describes the isolated university candidate; the earlier assessment audit and its findings remain preserved in the original checkout.

## Scope and Git state

- Worktree: `C:\Users\Martin\.codex\worktrees\lumora-university-publishing\Lumora Website`.
- Branch: `codex/lumora-university-publishing`.
- Base: latest fetched `origin/main`, `2500bce` (Configure GitHub Pages deployment).
- HEAD equals origin/main: zero candidate commits, zero ahead/behind. All candidate edits are unstaged/uncommitted.
- Original assessment checkout remains on `codex/lumora-v2-assessment` at `283e0d2`; all 154 tracked/untracked file hashes matched the pre-transfer snapshot. Its ignored six preview screenshots also remain present.
- The newer commercial project was not accessed for edits or modified.
- Nothing was committed, merged, pushed, force-pushed, deployed, or submitted as a pull request.

## Approved transfer and dependency adaptation

RepoRun Docker/Nginx configuration, HTTP security-header generator, explicit source-map setting, root-origin SEO handling, accessibility fixes, browser regressions, QA server fix, bilingual README/academic guide, privacy documentation and hygiene rules were transferred.

The candidate starts from main rather than the assessment branch. No inherited V2 commit, application, configuration, workflow, tests, dependency or architecture documentation was imported. The V2-only ExperienceCard routePrefix prop, environment/service variables, install permission and ignore rules were excluded. Main's package.json, TypeScript/ESLint/Playwright configuration and original EN/MK language context remain unchanged.

The candidate lockfile was regenerated from main's actual dependency graph. Its only package change is source-map-js 1.2.1 to 1.2.2 via a targeted pnpm-workspace.yaml override. The assessment's ajv 8 override was omitted: this project uses ajv 6.15.0. No direct dependency or general dependency upgrade was introduced. The assessment's vulnerable braces chain is absent from this candidate.

## Preserved and removed files

All 43 supplied tour photographs, including the 18 unreferenced supplied photos, are byte-identical to the assessment checkout. The official transparent PNG, tour data, translations, legitimate tests, five documentation screenshots, image provenance and truthful AI-assisted academic acknowledgments remain.

Before removal, exact-path/name searches across application source, documentation, tests and build scripts found no usage of the 12 approved superseded prototype assets or two scaffold markers. Credits described inactive prototypes; their historical attribution was preserved and updated to record removal. The sample-label/demo-note selectors had no consumers outside their CSS definitions; only those definitions and their related media rule were removed.

The exact 14 candidate-only deletions are included in the Git inventory below. Six obsolete preview screenshots, .qa/, and old generated artifacts were absent from the fresh main worktree and were not copied. Installed dependencies and newly generated dist/test-results remain ignored; dist is restored to the default Pages build for review. No original assessment file was deleted.

## Verification results

| Check | Result |
| --- | --- |
| Frozen dependency install | PASS |
| TypeScript | PASS — pnpm typecheck |
| ESLint | PASS — pnpm lint |
| GitHub Pages production build | PASS — /lumora-company-website/, default Pages origin |
| RepoRun production build | PASS — /, explicitly blank public origin |
| Pages browser regression | PASS — 26/26 |
| Root browser regression | PASS — 26/26 |
| Axe 4.14.0 / browser CSP simulation | PASS — 52 page cases plus 10 interactive states, zero violations |
| Responsive/reflow | PASS in tested scope — five regression widths and 720/360/320px audit reflow; no overflow |
| Images/alt | PASS — 144 rendered informative instances, zero missing alt or broken images |
| Console | PASS — zero application errors in the audit |
| Privacy observation | No cookies; only lumora-language localStorage; no configured inquiry transmission |
| Full dependency audit | PASS — pnpm audit --json, zero advisories at audit time |
| Changed-file credential-pattern scan | PASS in scoped scan — no high-confidence matches; not a full history certification |
| Diff whitespace | PASS after attribution-document line-ending normalization |
| Protected-file checks | PASS — package manifest, Pages workflow, tour data and localization unchanged |
| V2 boundary | PASS — no inherited files/commits/dependencies; no V2 scripts or settings imported |
| Compose/stack static inspection | PASS in inspected scope — one web service, 8080 ingress, CAS, 0.50 CPU/128 MiB; no prohibited keys/mounts |
| Docker build/container/Compose schema/Nginx runtime | NOT TESTED — Docker unavailable |
| Actual hosted Pages/RepoRun, TLS/CAS | NOT TESTED — no publishing/deployment authorized |
| Native browser zoom, screen reader, provider listing availability | Requires manual verification |

Both regression runs cover known-route refresh, branded 404/invalid slug, five experiences, EN/MK/persistence, navigation/keyboard, filters, inquiry validation/local preparation, external links, logo, gallery assets and responsive layouts.

Accessibility automation and reflow simulation do not establish full WCAG compliance. CSP response interception checks browser compatibility, not actual Nginx headers. Local Home LCP samples were 492ms EN and 296ms MK, with CLS 0 across the 26 desktop route/language observations; these are unthrottled local lab measurements, not deployed performance guarantees.

## Remaining issues and approval gate

- Medium: Docker/Nginx runtime, permissions, health endpoint, response headers, resource enforcement and CAS/TLS need validation on a Docker-enabled machine/platform.
- Low: original large official PNG and floating base-image tags remain unchanged; optimization/digest pinning are separate decisions.
- Informational: genuine RepoRun origin is unknown, so root build intentionally omits absolute SEO URLs/sitemap. Confirm actual origin/root hosting before configuring it.
- Informational: screen-reader/native zoom, photo publication rights, current business/pricing/provider details, university privacy and academic author/course fields need human review.
- No known dependency advisories were returned for this candidate at audit time; this is not a guarantee of complete security.

GitHub Pages workflow is unchanged and retains /lumora-company-website/. RepoRun retains root /, web:8080, university CAS, the approved resource limits, multi-stage unprivileged Nginx and health/security configuration.

Next: review this worktree/diff and explicitly approve any commit. If main changes before publication, refresh/reconcile the candidate against the new origin/main and verify affected changes before approval. Do not merge the assessment branch. Only after separate publishing approval should changes reach main and trigger the existing Pages workflow. Pages Source remains GitHub Actions. RepoRun Docker commands and SSH/CAS instructions are in REPORUN.md; no endpoint or secret has been guessed.

## Exact Git inventory

M = modified tracked file; D = approved candidate-only deletion; ?? = new untracked file. Nothing is staged.

```text
 M .env.example
 M .gitignore
 M README.md
 M pnpm-lock.yaml
 M public/images/CREDITS.md
 D public/images/about/.gitkeep
 D public/images/brand/favicon.svg
 D public/images/brand/lumora-logo.jpg
 D public/images/destinations/.gitkeep
 D public/images/experiences/canyon-1200.webp
 D public/images/experiences/canyon-640.webp
 D public/images/experiences/city-1200.webp
 D public/images/experiences/city-640.webp
 D public/images/experiences/hiking-1200.webp
 D public/images/experiences/hiking-640.webp
 D public/images/experiences/lake-1200.webp
 D public/images/experiences/lake-640.webp
 D public/images/hero/mountains-1920.webp
 D public/images/hero/mountains-640.webp
 M scripts/generate-seo.mjs
 M scripts/serve-pages.mjs
 M src/components/common/InquiryCTA.tsx
 M src/components/common/SectionHeading.tsx
 M src/components/contact/InquiryForm.tsx
 M src/components/experiences/ExperienceCard.tsx
 M src/components/layout/LanguageSelector.tsx
 M src/components/layout/Layout.tsx
 M src/data/company.ts
 M src/index.css
 M src/pages/About.tsx
 M src/pages/Contact.tsx
 M src/pages/Destinations.tsx
 M src/pages/ExperienceDetail.tsx
 M src/pages/Experiences.tsx
 M src/pages/Home.tsx
 M src/pages/NotFound.tsx
 M tests/site.spec.ts
 M vite.config.ts
?? .dockerignore
?? Dockerfile
?? docker-compose.yml
?? docker/nginx-main.conf
?? docker/nginx.conf
?? docs/FINAL-UNIVERSITY-AUDIT.md
?? docs/REPORUN.md
?? docs/UNIVERSITY-GUIDE.md
?? pnpm-workspace.yaml
?? scripts/audit-university.mjs
?? scripts/security-headers.mjs
?? stack.yml
```
