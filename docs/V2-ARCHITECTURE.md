# Lumora V2 architecture assessment

Assessment date: 6 October 2026. Status: **approved working architecture**. Phase 1 validation is documented in [the foundation report](v2/PHASE-1.md); Phase 2 has not started.

This document proposes changes to the existing website, not a replacement design. The original assessment changed documentation only. Subsequent approved Phase 1 work is isolated on `codex/lumora-v2-assessment`; V1 remains on `main`. Production activation and later phases require separate approval.

## A. Existing V1 and measured baseline

Baseline commit: `2500bce` (Configure GitHub Pages deployment). Repository initially clean, with only local/remote `main`. No repository AGENTS.md found. Reviewed application pages/components, data, dictionaries, styles, public asset inventory, configurations, tests, SEO/deployment scripts, workflow and existing bilingual README.

| Check, rerun locally | Result |
| --- | --- |
| Development server and Edge homepage | PASS, Vite on port 5173 |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm build` | PASS, 11 route metadata documents |
| Existing production Pages Playwright suite | PASS, 25 tests, approximately one minute |
| Secret-pattern scan of 58 non-generated text files | No matches; not a security certification |
| GitHub read-only deployment inspection | Latest Pages workflow run 36783125832 succeeded at baseline commit; Pages source is workflow |

Runtime: Node 24.19.0; pnpm declared 11.25.0; resolved Vite 8.3.1. Declared dependencies: React 19, Router 7, TypeScript 6, Tailwind 4, Lucide; ESLint, Prettier, Playwright for tooling. Build output: JS 355.23 kB / 110.87 kB gzip; CSS 33.29 kB / 7.90 kB gzip. These are bundle measurements, not measured Core Web Vitals.

V1 is a client-rendered React app. `BrowserRouter` uses the Vite base `/lumora-company-website/` in production. Shared Layout/Brand uses the official transparent PNG, with responsive styling. Eight page components cover Home, Experiences, dynamic experience details, Destinations, About, Contact, Privacy and NotFound. Five real catalog records drive cards, details, filters and form options. Destinations/categories derive from the catalog. Business configuration includes public registration/address and two managing directors; email/phone/WhatsApp are unset. Do not infer founder status or additional contact information.

EN/MK dictionaries and `LocalizedText` are separate but content is hardcoded in `src/data/experiences.ts`. Language Context stores only preference in localStorage and changes document language; languages currently share URLs. Contact validates client-side and prepares an explicitly unsent message if no endpoint is configured. It has no production delivery backend. Instagram and GetYourGuide are external links, not API feeds or inventory integrations.

Photography is local AVIF/WebP; the shared Image helper prefixes public paths, lazy-loads secondary images and handles failures. The PNG is served unchanged. Old inactive stock images, superseded brand assets and unused `.demo-note` CSS remain; remove only after reference verification during the later cleanup phase. Form input placeholders are legitimate examples, not unfinished content. Academic/demo wording in README is documentation, not customer-facing copy.

SEO currently generates English titles/meta/canonical/TravelAgency JSON-LD/sitemap and static route shells; page bodies still require JavaScript. No multilingual URLs/hreflang, backend, admin, CMS, payments, email service or tracking exists. TypeScript strict mode is not explicitly enabled. Pages CI checks types/lint/build but does not run browser tests.

Existing tests cover all public routes including five tours and invalid routes; EN/MK at 375/430/768/1024/1440px; overflow, console exceptions, headings/meta, assets, logo aspect ratio, filters, inquiry validation/local-only behavior, keyboard menu, persistence/blocked storage and expected external hrefs. External-service availability, full screen-reader/contrast auditing, dependency vulnerability auditing, field performance and backend behavior are outside this baseline. Desktop Home and a mobile tour were visually inspected after images decoded: preserve photography, purple/cream palette, typography and layout.

## B. Recommended V2 architecture

Retain React, Vite, TypeScript, CSS/brand, component layouts and existing tour identities. Migrate routing incrementally to **React Router framework mode with server-rendered public route loaders**, deployed on a dedicated Vercel V2 project. This provides actual crawlable multilingual page bodies, fresh published CMS content and server metadata without moving to an unrelated frontend framework. Compatibility of installed Vite/Router/adapters must be tested in Phase 1, not assumed from current major versions.

Use one server application layer in React Router server-only modules/resource routes for booking, auth, PayPal webhooks and forms. It calls narrowly scoped PostgreSQL transactional functions in Supabase. Avoid duplicating booking logic in a second Edge Functions backend. Supabase supplies PostgreSQL, Auth and scheduled database work; a scheduled authenticated server worker handles email/payment reconciliation. Sanity Studio is the content editor. Resend supplies transactional delivery. PayPal supplies checkout. No customer account is required initially.

```text
Public React pages / focused admin UI
  -> React Router server loaders and validated resource routes
       -> Sanity published content (read/cache)
       -> Supabase Auth + PostgreSQL (authorized operations/transactions)
       -> PayPal order/capture APIs (sandbox initially)
       -> durable email outbox -> Resend
Sanity Studio -> content publishing -> signed cache invalidation
PayPal -> verified webhook -> durable event -> transactional reconciliation
```

Content and operational data have distinct authority. Sanity never owns remaining seats, reservations or captured payments. PostgreSQL owns payable prices and booking eligibility. CMS display-price editing cannot silently change a pending order. Public catalog publishing updates server content without manual source edits/builds, using a bounded cache and verified invalidation webhook. Draft preview is authenticated and never public-cached.

## C. Refactoring boundaries

| Existing file/group | Proposed change, only in approved phases |
| --- | --- |
| `App.tsx`, `main.tsx`, Vite/Router configuration | Framework route modules, server rendering, hydration-safe providers; preserve layout |
| `data/experiences.ts`, `types/experience.ts` | Migration source + typed Sanity adapter; separate content types from operational DTOs |
| Home/catalog/details/destinations | Consume loader data; preserve cards/filters; replace unsafe assumptions such as Home non-null destination lookup |
| `ExperienceCard`, detail inquiry panel | Approved display-price provenance and booking-mode CTA; GetYourGuide remains secondary |
| `LanguageContext`, types/dictionaries/selector | Four languages, URL-first locale, SSR-safe preference, plural/date/currency formatting |
| `InquiryForm`, `utils/inquiry.ts` | Real validated delivery API; separate custom-trip form; retain accessible fields/errors |
| `Image` | Sanity CDN responsive variants plus existing local logo/fallback; explicit dimensions and focal points |
| `usePageMeta`, `generate-seo.mjs` | Server metadata, locale canonical/hreflang and CMS-driven sitemap; keep V1 scripts on stable branch |
| Privacy and future terms pages | Owner-reviewed actual processing/booking policies |
| TS/ESLint/tests/CI | Introduce strict checking carefully, runtime validation, backend/RLS/concurrency tests and V2-only CI |

Proposed additions: `src/features/booking`, `src/features/admin`, `src/features/custom-trip`, `src/server` (never client-imported), `src/services/content`, `sanity/`, `supabase/migrations/`, `tests/integration/`, `docs/v2/`. This is a folder proposal, not scaffolding performed now. Keep a single application repository; do not add Redux, a generic CMS dashboard or microservices.

## D. Sanity schema proposal and migration

Use field-level localization for this small four-language catalog: reusable localized string/text/Portable Text objects with EN/MK/IT/TR fields and per-language review status. This keeps structural fields and images in one canonical tour document. Do not duplicate an entire tour per language unless independent publishing becomes a proven requirement.

| Document/object | Fields |
| --- | --- |
| Tour | immutable legacy ID, stable slug, localized title/summary/body, primary destination + destination references, primary category + category references, localized duration and optional numeric duration, itinerary steps, highlights, included/excluded, meeting information, guide-language codes, optional activity level/group information, cover/gallery, featured, booking-mode preference, archival flag, verified GetYourGuide URL, source/review date, SEO object |
| Destination | stable ID/slug, localized name/description, image, SEO; related tours queried, not duplicated |
| Category | stable ID/slug, localized name, optional description; reference from tours |
| Image object | asset reference, localized alt, hotspot/crop, attribution/rights reference |
| SEO object | localized title/description, social image; canonical generated from route/domain, not arbitrary editor input |
| Site settings singleton | approved company/director/contact/social information, Home/About content and featured references; secrets excluded |
| Optional display price | informational amount in minor units/currency or localized on-request text, provenance; never authoritative checkout price |

Sanity's native draft/published state controls visibility; archival is a separate deliberate state. Avoid another ambiguous `published` boolean. Per-tour booking-mode preference is content; backend operational settings must separately approve direct-booking activation. Drafts, missing legal approval or missing payable rates cannot enable checkout.

Migration: export the five existing records and seven location IDs; preserve slugs, EN/MK copy, alt text, image-to-tour mapping and GYG URLs. Upload active photographs with a repeatable source-path-to-asset manifest and checksum tracking. Preserve the local official PNG. Import deterministic IDs, preview against V1, have owners review content/pricing/rights, then switch loaders behind staging configuration. IT/TR remain explicitly untranslated in Studio until human-reviewed. Do not initialize capacities, dates or checkout prices from informational GYG amounts. Keep V1 source and migration snapshots until acceptance.

## E. PostgreSQL schema proposal

This is a conceptual schema, not an applied SQL migration. Use UUID primary keys internally, stable CMS ID mappings, foreign keys, check constraints, UTC timestamps and immutable booking/price snapshots. Use `Europe/Skopje` for scheduling, retain IANA zone and local schedule definitions for DST-safe recurrence.

| Table | Purpose / key fields |
| --- | --- |
| `tour_operations` | unique CMS tour ID, approved booking mode, operational active flag, cutoff/minimum/maximum travelers, policy version |
| `tour_rates` | versioned owner-approved currency/unit amount in integer minor units, validity, pricing basis; more passenger types only if needed |
| `schedule_rules` | tour, local weekdays/times, timezone, start/end dates, regular capacity; limited rolling materialization |
| `schedule_exceptions` | blocked local date/time, closure or special/override departure instruction; actor/reason |
| `departures` | tour, rule/source, starts/ends UTC, timezone, capacity, open/closed/cancelled status, rate reference/version; unique tour/start time |
| `customers` | minimal name/email, optional phone; protected, no implicit marketing consent/account |
| `reservations` | random public reference, customer/tour/departure, travelers, status, hold expiry, locale, immutable tour/price/policy snapshot, notes, timestamps, request idempotency key |
| `reservation_guests` | optional required guest details only; never demand passports/DOB without an approved need |
| `payments` | reservation, provider/order/capture IDs with unique constraints, expected/captured/refunded minor amounts, currency, payment state, operation idempotency IDs |
| `payment_events` | unique provider event ID, verified/processed status, restricted sanitized payload, retry information |
| `booking_requests` | request-to-book desired date/time/group and review status; no guaranteed seats until accepted/held |
| `custom_tour_requests` | dates/flexibility, destinations, interests, duration, transport/accommodation needs, optional approved budget, customer/locale/status |
| `contact_inquiries` | contact details, optional tour, message, locale, receipt/handling state |
| `staff_members` | Auth user ID, approved role, active flag; only privileged invitation/role changes |
| `audit_events` | actor, operation/object, timestamp and restricted change summary; no unnecessary message/payment/PII copies |
| `email_outbox` | deduplicated domain event/template/recipient, attempts, delivery state and retry deadline |

Indexes: departures by tour/start; reservations by departure/status/hold expiry; admin upcoming work; unique provider IDs and request keys. Prevent deletion of operational tour references or financial records through CMS unpublishing. Archive instead. Financial retention and deletion/anonymization require owner-approved policy.

## F. State machine, availability and concurrency

Keep reservation fulfillment and payment status separate. Reservation states: `awaiting_payment` (expiring capacity hold), `payment_processing`, `confirmed`, `completed`, `cancelled`, `expired`. Request-to-book lives in request review states (`submitted`, `accepted`, `declined`, `closed`) and creates an actual reservation only when accepted. Custom requests have their own work queue; no full quotation engine initially. A refunded payment does not itself decide whether a reservation is cancelled.

```text
instant: available departure -> awaiting_payment -> payment_processing -> confirmed -> completed
unpaid: awaiting_payment -> expired / cancelled
definitive failed capture: payment_processing -> awaiting_payment (valid hold) / expired
uncertain capture: payment_processing -> reconciliation (retain allocation)
confirmed -> cancelled (capacity release; refund is separate approved operation)
request: submitted -> accepted -> held reservation -> sandbox payment -> confirmed
```

Only a verified successful capture plus committed allocation can confirm an instant booking. Staff changes require explicit allowed transitions and audit entries. Edits never retroactively change existing price snapshots. Cancellation/refund rules are not invented here.

**Capacity strategy:** every inventory mutation takes `SELECT ... FOR UPDATE` on the same departure row inside one PostgreSQL transaction. Under that lock, expire eligible unpaid holds, calculate confirmed/retained allocations plus active unexpired holds, validate operational status/cutoff/capacity, calculate approved price and insert the hold atomically. Include confirmed/completed occupied seats and retained payment-processing seats as appropriate. Reservation cancellation, hold expiry, external allocations and capacity editing use the same lock discipline. Capacity cannot be reduced below allocated seats; closing blocks new sales without silently cancelling existing reservations. Lock multiple departures in deterministic order if that later becomes necessary.

Public calendar responses are sanitized server summaries. Multiple times per local date are supported; show Available/Limited/Full/Unavailable/On request with text, not color alone. Limited threshold and checkout hold duration need owner approval. Recheck at hold creation even if the calendar says available. A scheduled sweep helps housekeeping; correctness must not depend on the sweep running on time.

**Payment races:** transition a valid hold to durable `payment_processing` under lock before requesting capture. Do not hold a database transaction open while calling PayPal. Do not release a processing allocation merely because an HTTP request timed out; reconcile provider state. If a genuinely late successful capture arrives after allocation release, attempt safe allocation under lock; if impossible, record a payment exception and follow an approved refund/incident process, never overbook or display confirmation. Provider and database cannot share one atomic transaction.

Required tests: simultaneous attempts for final seat (one success), mixed group sizes, blocked/full dates, concurrent admin changes, hold expiry vs capture, duplicate capture/webhook, timeout with successful remote capture, late capture, DST/multiple departures, retry keys and unauthorized mutation.

GYG has no verified inventory API connection. Owners must allocate separate direct-channel seats or keep external allocations updated through the same locked inventory operations. Shared vans/guides across different tours may require resource capacity modeling; determine this before instant booking. Until that is resolved, affected tours stay request-to-book or external booking.

## G. Payment and email architecture

Use the current official PayPal JS checkout integration only at the payment step. Server creates Orders v2 orders from a locked booking snapshot; browser never supplies trusted totals. Server validates order ownership, expected merchant, reservation mapping, amount and currency before/after capture. Keep OAuth secret server-only. Use distinct persistent `PayPal-Request-Id` values per create/capture/refund operation; retry the same operation with its original ID. API-specific idempotency retention must be checked at implementation.

Verify webhook signatures using PayPal's supported verification method and configured webhook ID, persist event IDs uniquely, and make processing resilient to duplicates/out-of-order delivery. An approved order is not captured money. Reconcile missing events and uncertain requests. Retain identifiers and minimal necessary payment evidence, not card data or unrestricted provider payloads. Refunds require staff authorization, policy checks and their own idempotency/reconciliation.

Sandbox is the only development mode. **Owner must verify PayPal merchant receiving/withdrawal/Checkout eligibility for Lumora's actual legal entity and country before production feasibility is accepted.** Public country pages do not establish account-specific commercial capabilities. Do not work around restrictions by inventing another country/company. If unavailable, revisit provider selection with the owner; no substitution is authorized now.

Store booking/contact/custom-request success and email-outbox events in one database transaction. A retrying authenticated worker sends branded localized Resend templates with deduplication; use provider idempotency where supported. Distinguish queued, delivered, bounced and failed; email failure does not undo a paid booking. Combine overlapping new-booking/payment-confirmed emails to avoid duplicate confirmations. Sandbox/staging emails go only to approved test recipients. Configure a verified owned sending domain/subdomain, Resend-provided SPF/DKIM records and reviewed DMARC policy; keep transactional open/click tracking off unless explicitly approved. No production email activation before verification.

## H. Admin operations

Individual invited Supabase Auth accounts, MFA for privileged staff, server-validated sessions and role checks. Proposed roles: owner (settings/staff/refunds), operations (departures/reservations/requests), read-only if actually needed. Sanity has separate editor membership; a Studio link does not grant a CMS token or cross-service authorization.

Focused navigation: Dashboard, Calendar, Reservations, Custom Tours, Messages, Content (Studio), Settings. Dashboard statistics derive from data: occupancy includes actual allocated travelers; revenue clearly distinguishes captured/refunded/net amounts and currency. Calendar uses localized month/week/day with accessible agenda alternative; editing capacity/closures must show existing allocations. Never expose internal notes or other customers through public confirmation endpoints.

## I. Security, observability and recovery

Server validates bounded schemas, legal dates, known tours, traveler counts and request ownership. Deny anonymous reads/writes of customer/operational data. Use private operational schema and restrictive grants/RLS; public availability only through sanitized server endpoints. Staff authorization comes from protected membership, not user-editable metadata. Server service/secret keys bypass RLS, so every privileged handler must independently authorize operations. Restrict transactional function execution and safe search paths; do not grant arbitrary anonymous booking RPCs.

Use secure HttpOnly/Secure/SameSite session cookies, CSRF/origin protections on cookie-authenticated mutations, allowed redirects/CORS, per-object authorization, rate limits and bounded bodies. Anonymous checkout uses scoped random server-issued tokens stored hashed, not enumerable reservation references. No PII in query strings/localStorage/logs. Render Sanity rich text with an allowlisted renderer, validate link schemes, constrain uploads in Studio, enforce size/type/rights review. Payment webhook signature verification is separate from user-session authentication.

Deploy security headers/CSP tested with PayPal; restrict draft previews; no customer/admin responses in shared cache. Validate dependency advisories during implementation, scan secrets in CI and verify server-only modules do not enter browser bundles. No compliance certification is claimed.

Errors return safe localized messages/correlation IDs. Structured logs omit message bodies, secrets and payment personal data. Alert on payment exceptions, reconciliation backlog, capacity failures, delivery failures and auth anomalies. Select monitoring provider and budget with owners; avoid collecting sensitive request bodies.

Backups are **not yet configured**. Select Supabase paid backup/PITR capability appropriate to agreed recovery objectives; free projects need deliberate exports. Back up Sanity documents and image assets separately, store encrypted restricted off-site exports, retain Git configuration/migrations and a credential-recovery runbook. PostgreSQL backups do not back up object-storage files. Test restoring to isolated staging, including booking/payment reconciliation. Owner must approve retention, recovery point/time targets, responsibility and cost.

## J. Localization and SEO

UI dictionaries remain typed and separate from CMS translations. Extend locale union to EN/MK/IT/TR, with human-reviewed UI/email/policy copy. Use Intl formatting/plural rules. Proposed routes `/en/...`, `/mk/...`, `/it/...`, `/tr/...`, with existing tour slugs preserved initially. URL locale wins; preference guides unprefixed entry navigation and persists safely. SSR must not read browser localStorage. Language changes retain equivalent tour/filter/booking context; no payment state change.

Missing translated editorial content may show clearly identified English fallback; do not mark an English body as fully Italian/Turkish or publish misleading hreflang entries. Translation review status controls which localized pages enter sitemap/hreflang. Critical checkout/policy text needs reviewed translations before enabling that locale. Build locale-specific server title/description, canonical, reciprocal hreflang including suitable x-default, social metadata, semantic headings and only verified structured data. Admin/checkout/private confirmations are noindex; robots is not authorization.

## K. Hosting and environments

Recommended: Vercel SSR frontend/server, Supabase operational services, Sanity hosted Studio/content and Resend. Use a commercial-appropriate hosting plan, not an assumed free commercial entitlement; confirm prices/limits when selecting accounts. No V2 deployment has been provisioned.

Keep current Pages workflow and `main` untouched. V2 branch uses a separate staging project/domain and CI; no production deployment on V2 pushes. Development uses local Postgres/Supabase where practical and synthetic test data, a development CMS dataset, PayPal sandbox and restricted email recipients. Staging uses separate Supabase project, Sanity dataset and secrets. Production has separate projects/dataset/merchant credentials and a deliberate protected release approval. Choose exact domains/regions/budget before configuring canonical URLs, callbacks, cookies or webhooks; no guessed domain.

At launch preserve old public URLs with a verified redirect strategy. Existing GitHub project Pages cannot host a transactional server or control arbitrary HTTP redirects; retaining V1 with a deliberate migration notice/link may be needed until an owned domain/host allows proper redirects. SSR brings server outages/cache behavior to consider. Current `vercel.json` SPA rewrite is not the final SSR configuration. Rollback must preserve paid reservations and forward-compatible DB migrations; restoring V1 alone cannot erase operational obligations.

## L. Accounts and eventual configuration (not needed for this assessment)

Owners retain ownership and invite developers with least privilege; never send passwords/tokens in chat.

| Service/manual setup | Public configuration | Secret/server configuration and location |
| --- | --- | --- |
| Sanity organization/project, dev/staging/prod datasets, Studio editors/CORS | project ID, dataset, pinned API version | read/preview/migration tokens as needed and signed webhook secret in server/CI secret store; no write token in browser |
| Supabase organization, separate projects/region, staff invitations/MFA, approved backup plan | URL + publishable key (legacy anon key if required); browser Auth only | secret/service-role key in server host, DB password/migration access in protected CI; never `VITE_` |
| PayPal Developer sandbox business/buyer accounts and sandbox app/webhook | sandbox client ID for JS SDK | sandbox client secret, webhook ID, expected merchant ID in server environment; later distinct live app only after eligibility/approval |
| Resend account/domain, sender/reply-to/recipient, DNS verification | approved sender identity is public business information | sending-only API key and any email-webhook secret in server secret store |
| Vercel account/team and separate V2 staging/production projects | site origin, allowed origins and locale URLs | deployment/service tokens only if CI needs them, protected GitHub/host secrets |
| Owned domain/DNS (if chosen) | approved domain and subdomains | registrar credentials remain with owners |
| Monitoring (chosen later) | public ingestion identifier only if provider designed it so | admin/API tokens in protected server/CI configuration |

Environment variable names will be finalized in Phase 1. Public build keys need explicit allowlisting; all `VITE_` values are public. Server configuration includes Sanity settings, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (or legacy service-role equivalent), `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `RESEND_API_KEY`, site origin and approved email identities. `.env.example` will contain empty/example values only in the implementation phase. GitHub already exists; no new GitHub account is needed. No service credentials are required now.

## M. Owner information and decisions

Before operational implementation obtain booking mode per tour; real schedules/times/timezone; capacities, minimums and cutoffs; shared vehicle/guide resources; direct-channel vs GYG allocation; adult/child rules and required guest fields; approved direct prices/currency/tax/invoice responsibilities; payment eligibility; hold duration; pickup arrangements; contact and notification emails; staff permissions; publication/image rights; IT/TR translators/reviewers; custom-trip budget/questions; legal privacy/terms/booking/cancellation/refund/retention policies; domain, hosting budget, service regions and backup objectives.

Reconfirm existing public company details with owners; do not silently elevate old public listing data to approved contractual booking terms. Policies require appropriate local professional review, not generated compliance promises. Review PayPal/email/hosting processing and necessary storage/cookie disclosure; add consent UI only for tracking actually introduced.

## N. Controlled implementation phases and acceptance gates

| Phase | Scope and required acceptance evidence |
| --- | --- |
| 1 | Approve design decisions, branch protection/V2-only CI, server-routing compatibility spike, environment boundaries and threat model; preserve V1 regression suite |
| 2 | Sanity schemas and repeatable five-tour migration; drafts/public visibility, rights/alt text and V1 parity tested |
| 3 | Four-language UI/content routing; fallbacks, persistence, SSR language and reviewed copy coverage |
| 4 | Versioned DB migrations, staff Auth/RLS/role tests; unauthorized access denied |
| 5 | Schedule materialization, overrides/calendar and transactional capacity; race/DST/shared-resource tests |
| 6 | Reservation lifecycle and immutable pricing; idempotency/expiry/cancellation tests |
| 7 | PayPal sandbox only; verified capture, duplicate/late events, timeouts and reconciliation tested |
| 8 | Durable outbox, real contact/custom requests and approved-recipient test delivery; abuse/failure tests |
| 9 | Operational dashboard/calendar; truthful counts and staff authorization/edit tests |
| 10 | Preserve visual design, WCAG 2.2 AA-oriented manual/automated checks, multilingual SEO and measured performance |
| 11 | Security review, dependency/secret scans, dead-asset/content cleanup and incident exercises |
| 12 | Isolated staging, verified domain/DNS/backups/restore, migration/rollback rehearsal and owner review |
| 13 | Final regression/concurrency/payment QA and explicit live-payment/email/production release approval |

Each approved phase reports files, schema/security changes, manual setup and remaining risks; runs types/lint/build and appropriate tests; creates a descriptive commit. No production push/merge without explicit authorization. Stop before phases needing unprovided service configuration. Do not add fake news, statistics, reviews or a cookie banner for appearance.

## O. Risks and unresolved decisions

Highest risks: merchant eligibility, GYG/shared-resource double-selling, race conditions between payment and hold expiry, wrong pricing authority, staff/RLS authorization, missing reviewed legal/translation content and personal-data retention. Next: server-rendering/hydration migration (current provider reads browser storage), service costs/limits, CMS/database identity drift, scheduled-worker reliability, email deliverability, webhooks/outages, cache staleness and rollback after real payments. External inventory synchronization is explicitly unimplemented.

V1 regression success does not prove V2 production readiness. This proposal needs database concurrency tests and a payment failure/reconciliation proof before accepting money. No account provisioning, real payment, email sending, schema migration or production change happened in this assessment.

## P. Recommended next action

Approve Phase 1 only: validate the proposed React Router/Vercel server architecture, agree inventory/pricing/payment boundaries, prepare V2-only CI and an environment/configuration plan. Begin PayPal eligibility verification with owners early. Request exact service setup only when its phase needs it. Keep V1 online until staging and the later explicit launch gate pass.

## Primary technical references

Checked during this assessment; provider versions/plans must be rechecked at implementation:

- [React Router deployment strategies](https://reactrouter.com/start/framework/deploying) and [Vercel React Router SSR/preset](https://vercel.com/docs/frameworks/frontend/react-router).
- [Sanity localization approaches](https://www.sanity.io/docs/studio/localization).
- [Supabase data security and secret-key boundaries](https://supabase.com/docs/guides/database/secure-data).
- [PostgreSQL explicit row locking](https://www.postgresql.org/docs/current/explicit-locking.html).
- [PayPal request idempotency](https://developer.paypal.com/api/rest/reference/idempotency/) and [webhook verification](https://developer.paypal.com/api/rest/webhooks/rest/).
- [Resend verified sending domains](https://resend.com/docs/dashboard/domains/introduction).
- [Supabase backup scope/plan limitations](https://supabase.com/docs/guides/platform/backups).
- [OWASP API object authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/).

The architecture, table design and state machines above are proposed engineering decisions informed by these references, not claims that providers implement Lumora's business rules automatically.
