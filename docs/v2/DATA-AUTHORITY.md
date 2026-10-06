# Source-of-truth matrix

Approved V2 design; services are not connected in Phase 1. V1 hardcoded content is a migration source, not an operational inventory/pricing database.

| Data | Authority | Other systems / conflict rule |
| --- | --- | --- |
| Editorial tours, descriptions, itineraries, destinations/categories | Sanity | Frontend caches validated published DTOs; no duplicate editable DB copy |
| Images, alt text, translated editorial content, SEO text | Sanity | Preserve local brand assets; route layer generates canonical/hreflang |
| Informational/display price and booking-mode preference | Sanity | Explicitly informational; cannot authorize checkout or modify held booking |
| Payable prices, currency, pricing versions | PostgreSQL/Supabase | Server calculates and snapshots; browser/CMS/GYG values never trusted totals |
| Operational booking-mode approval, schedules/departures | PostgreSQL/Supabase | CMS publication/preference alone cannot activate instant booking |
| Capacity, authoritative availability, allocations/holds | PostgreSQL/Supabase | All mutations use same transactional locking discipline |
| Reservations, customers, guests, requests, inquiries, internal notes | PostgreSQL/Supabase | Private server/staff access; never public CMS documents |
| Application payment records/status, refunds and exceptions | PostgreSQL/Supabase | Reconciled from authenticated provider evidence; no frontend confirmation shortcut |
| Provider transaction/capture/refund/dispute state | PayPal | Signed events and server API reads reconcile DB; order approval is not captured payment |
| Email domain events/outbox/retry work | PostgreSQL/Supabase | DB transaction queues work; email failure cannot undo a captured reservation |
| Provider delivery/bounce state | Resend | Verified provider evidence updates outbox state; queued is not delivered |
| Staff identity/session | Supabase Auth | Protected staff membership in DB determines operational authorization |
| CMS editor access | Sanity | Separate editor membership; no implied operational permissions |
| Business workflow/reconciliation/policy enforcement | Lumora server application | Connects authorities with explicit transitions/idempotency; financial exceptions require reconciliation |
| Owner-approved prices/policies/schedules and publication rights | Lumora owners | Must approve actual values; no invented seeds, guarantees or legal terms |

No verified GYG inventory integration exists. Owners must assign channel inventory and account for shared guides/vehicles before activating instant booking. Unpublish/archive hides content without deleting financial/operational history. Price changes never rewrite accepted snapshots. Provider outages never permit browser-derived availability or payment success.
