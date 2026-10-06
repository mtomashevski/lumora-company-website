# Initial V2 threat model

Design foundation, not a completed application security audit or certification. Phase 1 implements configuration/module boundaries and synthetic tests only; controls marked future must be implemented and verified in their own approved phases. Real customer data/services are absent.

## Data classification

Public: published tour/destination/company content, approved display prices, locale/SEO metadata, safe availability summaries and designed public identifiers. Authenticated staff: dashboards, capacity edits, operational reports and internal work queues. Private customer: names/contact details, guest needs, notes, requests and reservation ownership tokens. Operational: schedules, inventory, holds, policy versions and audit events. Financial: expected/captured/refunded amounts, provider IDs and reconciliation evidence. Secrets: service-role/server keys, provider credentials, session/webhook secrets, privileged CMS/CI tokens. Card information must never be collected/stored by Lumora.

## Trust boundaries and threats

| Boundary | Main attack/failure | Required control and evidence |
| --- | --- | --- |
| Browser -> server | Forged price/count/ID, XSS, spam, CSRF, IDOR | Runtime schemas, bounded bodies, allowed transitions, per-object auth, rate limits, cookie/origin protections and hostile-input tests; future |
| Shared/client -> server modules | Secret bundling or unsafe loader serialization | `.server` conventions, negative-build test, no automatic env export, public DTO allowlist, ESLint and artifact scan; Phase 1 enforced |
| Server -> Sanity | Draft leaks, malicious rich text/links, poisoned editorial price, unsafe uploads | Published-only reads, authenticated no-store draft preview, allowlisted renderers/schemes/types/sizes, editorial vs payable separation; future |
| Server/staff -> Supabase/PostgreSQL | RLS bypass, role spoofing, races, private data reads | Least grants/private schema/RLS, protected membership, server checks even with secret keys, atomic departure locks/concurrency tests; future |
| Server <-> PayPal | Amount/merchant mismatch, replay/webhook spoofing, duplicate/late capture | Server orders/verification, signature validation, durable unique IDs, idempotency, retained processing allocation and reconciliation; future sandbox phase |
| Server/outbox <-> Resend | Spoofed status, duplicate email, PII logs, provider outage | Verified domain/webhooks, restricted keys/test recipients, transactional outbox, dedupe/retries and redacted logs; future |
| Staff browser -> admin/Studio | Credential theft, shared password, privilege escalation | Individual invitations/MFA, protected sessions, server authorization, protected roles, least CMS membership and audit; future |
| GitHub/CI -> build/host | Secret exposure, supply-chain scripts, accidental deployment | Frozen lock, narrow lifecycle permission, no service secrets in untrusted PRs, contents-read CI, no V2 deployment steps, main-only Pages; Phase 1 foundation |
| Host/cache -> public/admin | Wrong environment, cached PII, leaked error traces | Explicit remote APP_ENV/HTTPS origin, no-store private data, safe errors, TLS/security headers/CSP compatible with PayPal; config guard now, remaining headers/workflows future |
| Recovery/jobs -> DB/providers | Expired holds while capture in flight, lost events/backups | Idempotent scheduled reconciliation, durable outbox, backup/restore exercises, owner-approved RPO/RTO; future |

## Coding rules

1. Never accept browser totals, roles, customer ownership or inventory as authority. Validate again on the server and inside transactional mutations.
2. Never use a frontend route guard, hidden admin URL, user-editable metadata or localStorage as authorization. Server secret keys bypass RLS; explicitly authorize every privileged call.
3. Put privileged logic/configuration only in `.server.ts` modules; return the smallest deliberately reviewed loader/JSON DTO. Route loader/action functions may import server modules; rendered components may not.
4. Never place secret values in VITE variables, commits, logs, errors, URLs, analytics or client storage. Public IDs are allowlisted explicitly; do not serialize process.env.
5. Use safe status/error codes and correlation IDs. Logs should contain event/operation IDs and coarse outcomes, not customer message bodies, credentials, card/payment personal data or full provider payloads. Review third-party telemetry before enabling it.
6. Minimize PII/guest fields, restrict internal notes, protect access tokens and implement owner-approved retention/deletion. Consent/policy versions are separate from marketing opt-in; no invented legal compliance claims.
7. Use unique persisted operation/event IDs for payment/email retries. Timeout means unknown state until reconciled, not failure/permission to release captured allocation.
8. Keep independent dev/staging/production services and credentials. No live payment or production email until explicit approval and owner configuration. Do not claim backup/recovery exists before a tested restore.

## Acceptance tests for later phases

Unauthorized staff/customer requests, cross-reservation access, editable-role spoofing, invalid/oversized input, CSRF/session expiry, RLS/grants bypass, concurrency for final seats, late/duplicate/out-of-order provider events, capture timeout recovery, email retries/bounces, draft/PII cache leaks, malicious content/uploads and dependency/secret scans. WCAG checks and usable safe errors must accompany these controls.

Residual Phase 1 risk: the spike uses only public migration data and no authenticated APIs, so it cannot establish production auth/payment security. CI hosted execution and Vercel platform behavior require their actual environment checks. Owner policy, inventory allocation, merchant eligibility and backup budget remain decisions, not implemented controls.

Reference: [OWASP API object authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/), [Supabase key/RLS boundaries](https://supabase.com/docs/guides/database/secure-data).
