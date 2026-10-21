# News and privacy preferences / Новости и поставки за приватност

University-only update, 21 October 2026. The commercial project and external services are not connected or modified.

## News

`/news/` and `/news/:slug/` use the existing router, photography, cards, typography and EN/MK system. All four known article paths are generated as directory indexes for direct opening/refresh on Pages or RepoRun. Unknown articles use the branded noindex 404. Canonical, Open Graph and sitemap generation includes the new routes and preserves the trailing-slash convention.

News & Stories / Новости и приказни presents four evergreen destination guides and travel inspiration in `src/data/news.ts`, without public demonstration banners or labels. No dates, authors, events or company announcements are invented. The university purpose remains documented in the README. AI-generated illustrations and bilingual alt text remain unchanged; they are artistic interpretations, not documentary photographs or route maps. Only supply `publishedAt` for a genuine publication date. An empty array renders a translated empty state. Article sections use plain text, not injected HTML.

## Actual storage and behavior

No application HTTP cookies, sessionStorage, analytics, advertising scripts, remote fonts or embedded booking/social widgets were found. Ordinary Instagram/GetYourGuide links navigate to separate services; their cookies and policies are not controlled here. University CAS is an infrastructure concern.

The first-visit notice offers acknowledgment, Preferences and Privacy information. There are no fake analytics/marketing toggles or meaningless Accept/Reject buttons. The only configurable preference controls language persistence:

| Storage | Purpose |
| --- | --- |
| `lumora-cookie-preferences` in localStorage | Version 1, necessary acknowledgment, `rememberLanguage` boolean and ISO save time; no inquiry details or visitor identifier |
| `lumora-language` in localStorage | EN/MK preference, written only when language persistence is enabled |

Turning off language persistence removes `lumora-language`, preserves the current in-memory language, and starts the next load in English. Re-enabling it saves the current choice again. Footer Cookie Settings and the Privacy page reopen the native settings dialog. Escape closes it, keyboard focus wraps within it, and focus returns to the opener. No tracking categories or tracking scripts were added.

Malformed/obsolete/incomplete saved records display the notice again. Reads/writes are guarded when storage is blocked. Save still applies for the current visit, and an explanatory status appears in the footer; refresh cannot retain that choice. Clearing site storage resets preferences. Persistence is per browser and origin, so the two deployment environments have separate choices. No consent/legal compliance certification is claimed.

## Testing and deployment

Use the unchanged pinned dependencies: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm build`. Run browser regressions using the README's production-preview environment variables. The new tests cover first visits, acknowledgment, malformed records, persistent preferences, language-storage withdrawal/re-enabling, footer reopening, modal keyboard focus/Escape, blocked storage, all five widths, EN/MK, article metadata and directory refresh. Existing tour, image, contact, external-link and 404 regressions remain.

`scripts/audit-university.mjs` now also scans News, both articles, invalid articles, the privacy notice and open settings. It fetches axe into test-process memory only; it does not install or ship a tracker. Reflow/automated checks do not replace manual screen-reader and native zoom testing. Runtime Nginx/RepoRun CAS validation requires Docker/platform access.

GitHub Pages retains `/lumora-company-website/` and its unchanged workflow. RepoRun retains `/` and blank unknown origin, with no absolute Pages canonical until a real origin is configured. No dependency, backend, CMS, authentication, payment or tracking integration was added. Builds/tests create ignored output only. Review editorial content before publication; a push to main triggers the existing Pages workflow.

## Македонски

„Новости и приказни“ и деталите за статиите се на EN/MK. Четирите водичи и патувачки приказни немаат демонстративни ознаки, измислени датуми, автори или соопштенија. Универзитетскиот контекст останува во README. Податоците се во `src/data/news.ts`.

Нема HTTP колачиња, аналитика или маркетинг-следење. Известувањето и поставките се функционални: потврдата се зачувува во `lumora-cookie-preferences`, а изборот за паметење на јазикот го контролира `lumora-language`. Двата записа се localStorage, не колачиња. Со исклучување се брише зачуваниот јазик; тековниот останува активен до освежување. Поставки за колачиња во подножјето повторно го отвора дијалогот. При блокирано складирање, изборот важи само за посетата и се прикажува објаснување.

Зачувани се Pages base path, постојниот workflow, RepoRun поставките и вистинските тури/фотографии. Не се додадени сервиси или нови зависности. Потребни се уреднички преглед, рачна проверка со читач на екран и одобрение пред commit/push. Постоењето на банер не е доказ за правна усогласеност.

## Verification record — initial two-article feature, 21 October 2026

Overall: PASS WITH WARNINGS — ready for university review, then approval before publication.

- Frozen install: passed; lockfile and all dependency versions unchanged. package.json adds only a unit-test command.
- TypeScript and ESLint: passed.
- Node unit tests: 3/3 passed (schema validation, invalid/versioned records, field filtering).
- GitHub Pages production build: passed, 14 generated routes, repository base preserved.
- RepoRun root production build: passed, unknown origin blank, absolute canonical/OG URLs omitted.
- Final browser regressions: 46/46 passed for Pages and 46/46 for root output.
- Axe 4.14.0 / CSP browser audit: 68 page cases plus 18 interactive states passed with zero reported violations. Optional category/empty-list guards were subsequently added without changing the rendered supplied examples; final browser suites cover the resulting build.
- Alt coverage: 168 rendered informative image instances, zero missing alt or broken images in the audit. No supplied asset was changed.
- No horizontal overflow in the five required widths (375/430/768/1024/1440) or the audit's 720/360/320 reflow simulations.
- Desktop and Macedonian mobile News, banner, dialog and article inspected visually using memory-only screenshots. No screenshot files were created. Generated test-results were removed after tests; production build and installed dependencies remain ignored for local review.
- Keyboard dialog opening, Tab containment, Escape and opener restoration passed; mobile navigation, old tours, language persistence, inquiries, images, external hrefs and 404 regressions passed.
- Scoped secret-pattern scan found no confirmed credentials. Protected Pages workflow, Docker/Compose/stack, experience data, images, lockfile and dependency graph are unchanged. No V2 files or services introduced.
- No application HTTP cookies or sessionStorage observed; only the two documented localStorage keys. No third-party website requests occurred in the dedicated privacy regression.

Warnings: both articles remain labelled, undated examples rather than verified business announcements. Full legal/WCAG compliance is not claimed. Screen-reader and native browser zoom testing, actual provider availability and actual Docker/RepoRun CAS execution remain manual. No Docker runtime test was performed in this feature task. The earlier audit had a test-helper first-visit setup timeout; it was corrected with fresh browser contexts before the successful accessibility run. Initial browser checks found and fixed modal Tab wrapping and updated expected 404/storage assertions before the final successful suites.

Local review: `http://127.0.0.1:4197/lumora-company-website/news/`.
Branch: `codex/lumora-university-news-cookies`, based on main `2a36544`.
Checkout: `C:\Users\Martin\Documents\Lumora Website\.qa\news-cookies` (inside the only writable project). The original dirty assessment checkout is preserved; the commercial project is untouched. No commit, push, deployment, remote change or service integration was performed.

After human review: approve committing/pushing this feature branch, review its PR into main, then let the unchanged Pages workflow deploy only after an approved merge. Review labelled example content before using News as a real business announcement channel.

### Exact changed-file inventory

Paths are relative to this feature checkout. M = modified; ?? = new/untracked. No source files were deleted or staged.

```text
 M README.md
 M docs/FINAL-UNIVERSITY-AUDIT.md
 M docs/REPORUN.md
 M package.json
 M scripts/audit-university.mjs
 M scripts/generate-seo.mjs
 M src/App.tsx
 M src/components/layout/Layout.tsx
 M src/i18n/LanguageContext.tsx
 M src/i18n/en.ts
 M src/i18n/mk.ts
 M src/index.css
 M src/pages/Privacy.tsx
 M tests/site.spec.ts
?? docs/NEWS-PRIVACY.md
?? src/components/privacy/PrivacyControls.tsx
?? src/components/privacy/PrivacyProvider.tsx
?? src/data/news.ts
?? src/pages/News.tsx
?? src/pages/NewsArticle.tsx
?? src/types/news.ts
?? src/utils/privacyPreferences.ts
?? tests/news-privacy.spec.ts
?? tests/privacy-preferences.unit.mjs
```

## Four-illustration editorial refresh

The user supplied a 2×2 AI-generated travel artwork sheet. Its cream gutters and outer margin were cropped away; four WebP exports retain the purple/cream palette and integrated LUMORA signature. The official floral logo is unchanged. The source PNG was deleted only after all exports, website mappings and both deployment variants passed verification. Crop rectangles, dimensions and encoding details are recorded in public/images/CREDITS.md. No source sheet or screenshot is committed.

| News article slug | Optimized cover in public/images/news/ |
| --- | --- |
| a-thoughtful-day-outdoors | matka-canyon.webp (top-left panel) |
| a-moment-by-lake-ohrid | lake-ohrid.webp (top-right panel) |
| skopje-stories-by-the-vardar | skopje.webp (bottom-left panel) |
| a-pause-in-macedonian-nature | macedonian-nature.webp (bottom-right panel) |

The first two URLs are preserved. All four EN/MK editorial examples remain undated and clearly labelled; body copy and alt text identify the AI-generated artistic interpretation, not documentary photography or a business announcement. The imagined nature scene is not falsely identified as a specific trail/lake. Each article's generated and runtime Open Graph image now matches its cover, with base-aware paths. Article image frames use 3:2 proportions so the integrated signatures remain visible.

Verification: frozen install, TypeScript, ESLint and 3 unit tests passed. Both production builds generated 16 routes. Final browser suites passed 48/48 for GitHub Pages and 48/48 for root hosting, including EN/MK, cards and article refreshes, 375/430/768/1024/1440 widths, WebP decoding/mapping, alt text, metadata, canonical URLs, sitemap, cookie/privacy behavior and all existing tours. Initial mobile image assertions assumed below-fold lazy images had already loaded; the tests now scroll each image into view and await decoding rather than disabling lazy loading. The older audit totals above are historical; the full axe run was not repeated for this artwork-only refresh. No cookie/privacy source, dependencies, deployment settings, official logo or existing tour images/data were changed. No commercial project files were modified. Nothing is merged or deployed by this refresh.


## Evergreen editorial revision

The records above describe earlier implementation snapshots. The current public section is News & Stories / Новости и приказни. Demonstration banners, badges and undated-example labels were removed. The four existing routes, illustrations, privacy controls and deployment configuration are preserved. Basic geography was cross-checked against the [City of Skopje](https://skopje.gov.mk/en_us/footer/fakti-simboli/), its [Matka information](https://skopje.gov.mk/) and [UNESCO’s Ohrid entry](https://whc.unesco.org/en/list/99/). No historical dates, prices, availability promises or business announcements were added.

Verification for this revision: typecheck, ESLint and all 3 privacy unit tests passed. Both production builds passed. Root-path browser regressions: 48/48 passed. Pages browser regressions: 47/48 passed initially; the remaining MK 768px case was interrupted by Edge `ERR_NETWORK_IO_SUSPENDED` and passed on its focused rerun (1/1). Coverage includes all four stories, EN/MK, images and localized metadata, direct refresh/404, canonical URLs, five responsive widths, navigation, tours, inquiry and privacy preference behavior. Mobile News was visually checked. Docker/RepoRun runtime was not tested in this editorial revision.
