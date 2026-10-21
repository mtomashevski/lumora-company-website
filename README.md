# Lumora Company Website

A university **Business Practice** project for a real travel business in North Macedonia. This repository's assessed application is the React/Vite SPA in `src/`.

[GitHub Pages website](https://mtomashevski.github.io/lumora-company-website/) · [Repository](https://github.com/mtomashevski/lumora-company-website) · [RepoRun instructions](docs/REPORUN.md) · [Academic/presentation guide](docs/UNIVERSITY-GUIDE.md)

## English

### Features and limits

- Home, Experiences, five experience detail pages, Destinations, About, Contact, Privacy and branded not-found pages.
- English/Macedonian content, immediate language switching, route/filter/form preservation and browser language preference.
- Responsive navigation, destination/category filters, local photography and the official transparent PNG logo.
- News and article pages with two clearly labelled, undated bilingual demonstration articles; no actual company announcements were supplied.
- A first-visit privacy notice and reopenable settings, including a functional choice to remember or forget the language preference.
- Company information and managing directors **Stefanija Dimeska** and **Iva Arsova**, as supplied for the project. No separate founder status or biographies are claimed.
- Real Instagram and GetYourGuide links, including each activity's external booking listing.
- Validated inquiry form: with no endpoint configured it prepares a message locally for copying and manual sending. It neither transmits an inquiry nor confirms a booking. Refreshing/leaving discards form details.

There is no payment processing, database, CMS, analytics, advertising or tracking-cookie banner. Booking, live availability, current prices and provider terms are handled externally. Published from-prices are documented snapshots, not live quotes. Email, phone and WhatsApp are hidden until genuine values are supplied. Image rights and any required attribution must be confirmed by the business.

### Technology and installation

React 19, Vite 8, TypeScript 6, React Router 7, Tailwind CSS 4, Lucide icons, ESLint and Playwright. RepoRun serves compiled assets with unprivileged Nginx in a multi-stage Docker image.

Use Node **24 LTS** (package minimum: 22.12) and **pnpm 11.25.0**. Docker is needed only for container validation/deployment, not local development. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the localhost URL printed by Vite. Do not copy environment secrets into `VITE_*` variables: those are public build-time configuration. No credentials or external services are required for the university SPA.

### Build and test

```sh
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm build
pnpm preview:pages
```

The default production build targets `/lumora-company-website/`. The production QA server prints its exact URL (normally `http://127.0.0.1:4180/lumora-company-website/`). It serves generated route indexes and HTTP 404 responses; Vite's ordinary preview fallback is not proof of hosting compatibility.

Run browser regression tests in another terminal, with the QA server stopped because Playwright starts its own server:

```powershell
$env:TEST_PAGES_MODE='1'
$env:TEST_BASE_PATH='/lumora-company-website/'
$env:TEST_BASE_URL='http://127.0.0.1:4180/lumora-company-website'
pnpm test
```

Edge is the configured Playwright browser. Alternatively install a Playwright Chromium browser and set `PLAYWRIGHT_CHANNEL=chromium`. Tests cover all routes, five viewport widths, EN/MK, filters, inquiry behavior, navigation, images, external-link attributes and not-found handling.

Optional accessibility/CSP audit against a running production QA server:

```powershell
$env:AUDIT_URL='http://127.0.0.1:4180/lumora-company-website/'
node scripts/audit-university.mjs
```

This uses the existing Playwright dependency and fetches axe-core 4.14.0 into memory for testing. It installs nothing and adds no third-party script to the website. Internet access is needed for that audit. Automated findings do not establish full WCAG compliance; screen-reader use, real browser zoom and the actual hosting environment need manual review. `pnpm audit` checks dependency advisories; see the [final audit report](docs/FINAL-UNIVERSITY-AUDIT.md) for unresolved findings.

### GitHub Pages

The existing `.github/workflows/deploy-pages.yml` builds and deploys approved changes on `main`. GitHub repository **Settings → Pages → Source: GitHub Actions** is required.

- Base path: `/lumora-company-website/`.
- Public origin: `https://mtomashevski.github.io`.
- Live URL: <https://mtomashevski.github.io/lumora-company-website/>.

The build generates HTML indexes for the 11 known routes and `404.html`; BrowserRouter and local assets use the configured base. Do not commit `dist/`. GitHub Pages does not run the RepoRun Nginx configuration or its custom HTTP headers.

### RepoRun

Both `docker-compose.yml` and `stack.yml` must be at the platform's configured repository path: this project's **repository root**. One service, **web**, uses internal port **8080**, **0.50 CPU / 128 MiB RAM**, and ingress access **cas**. There are no host port mappings, host mounts, extra services or prohibited Compose properties.

Docker explicitly builds with base `/`. The assigned RepoRun origin is unknown: `VITE_SITE_URL` is deliberately blank, so absolute canonical/OG URLs and the sitemap are omitted until the real origin is configured. Do not guess it. Root deployment is assumed; obtain the exact prefix before adapting to a subdirectory.

Reproduce the root build and tests without Docker in PowerShell:

```powershell
$env:VITE_BASE_PATH='/'
$env:VITE_SITE_URL=''
pnpm build
$env:TEST_PAGES_MODE='1'
$env:TEST_BASE_PATH='/'
$env:TEST_BASE_URL='http://127.0.0.1:4180'
pnpm test
```

Restore the Pages build in a new terminal, or remove only the process environment overrides before running `pnpm build`. Do not create a root `.env` with blank values for a Pages build: an explicitly empty `VITE_SITE_URL` intentionally disables absolute SEO metadata.

See [RepoRun deployment](docs/REPORUN.md) for Docker checks, SSH deploy-key setup, CAS, security headers and manual deployment steps. The university controls HTTPS, authentication, ingress and infrastructure logging. Application tests do not validate those services.

### Structure and maintenance

| Path | Purpose |
| --- | --- |
| `src/pages/` | Public pages and not-found state |
| `src/components/` | Reusable layout, cards, form and common UI |
| `src/data/company.ts` | Supplied company/director/contact information and public configuration |
| `src/data/experiences.ts` | Five activities, destinations, EN/MK descriptions and image mappings |
| `src/i18n/` | EN/MK interface translations and language preference |
| `src/utils/`, `src/hooks/`, `src/types/` | Validation, deployment helpers, metadata and types |
| `public/images/` | Logo and local photographs; preserve [image provenance](public/images/CREDITS.md) |
| `scripts/` | Route metadata generation, local QA and security-header/audit tooling |
| `tests/site.spec.ts` | University SPA browser regression tests |
| `docker/`, `Dockerfile`, `docker-compose.yml`, `stack.yml` | RepoRun production hosting |
| `docs/` | Deployment, audit and academic documentation |

The existing [documentation screenshots](docs/screenshots/) are retained for the university presentation.

Change supplied data centrally rather than duplicating it across pages. Translate interface keys in both `en.ts` and `mk.ts`; translate image descriptions in the experience data too. Keep paths base-aware via `publicAsset`. A new public route must also be added to metadata generation and route tests. An actual inquiry service would require endpoint, privacy, server validation and CSP review before enabling it.


### Privacy, provenance and acknowledgments

The application sets no HTTP cookies and loads no analytics or marketing trackers. `localStorage['lumora-cookie-preferences']` stores a versioned privacy acknowledgment, language-storage choice and save time. `localStorage['lumora-language']` remembers EN/MK only while that choice is enabled. Cookie Settings in the footer can reopen the dialog; disabling language storage removes that saved language. Blocked storage falls back to session-only choices with an explanatory message. Inquiry details remain in browser memory; Instagram/GetYourGuide and RepoRun CAS/logs have their own policies. This is project privacy information, not legal certification.

The News feature uses typed local data in `src/data/news.ts`. Both articles are academic examples, visibly labelled in EN/MK, with no invented publication dates. Replace them with owner-approved content and actual dates before treating them as company announcements. Existing local photos illustrate destinations, not reported events. See [News and privacy implementation notes](docs/NEWS-PRIVACY.md) for behavior, storage, tests and review limitations.

AI tools, including Codex, assisted with implementation, debugging, verification and documentation. The human team selected the business, supplied requirements/resources, reviewed results and directed corrections. Do not invent individual contributions or conceal AI assistance. Complete the actual course, professor, student names/index numbers and contributions in the [academic guide](docs/UNIVERSITY-GUIDE.md) before submission. Preserve copyright notices, licenses and photo attribution; confirm publication rights with Lumora.

## Македонски

### Преглед и функционалност

Универзитетски проект по **Бизнис пракса** за реалната туристичка компанија Lumora Company. Универзитетската апликација е React/Vite SPA во `src/`.

Страницата содржи почетна страница, каталог со филтри, **пет реални активности со детали**, дестинации, информации за компанијата и управителите **Stefanija Dimeska** и **Iva Arsova**, контакт, приватност и брендирана 404 страница. Има EN/MK содржина, зачувување на избраниот јазик, responsive навигација, локални фотографии, официјално PNG лого и вистински Instagram/GetYourGuide врски.

Формуларот ги проверува полињата и, без конфигуриран endpoint, **само подготвува порака во прелистувачот** за копирање и рачно испраќање. Не испраќа порака, не потврдува резервација и не обработува плаќања. Освежување или напуштање на страницата ги отстранува внесените податоци. GetYourGuide ги обработува достапноста, актуелните цени и резервациите. Прикажаните почетни цени се документиран пресек, а не цени во реално време. Недоставените email/телефон/WhatsApp контакти се скриени.

### Технологии, инсталација и проверки

React 19, Vite 8, TypeScript 6, React Router 7, Tailwind CSS 4, Lucide, ESLint и Playwright. RepoRun користи Docker и Nginx како непривилегиран корисник.

Користете **Node 24 LTS** (минимум во пакетот: 22.12) и **pnpm 11.25.0**. Од коренот на репозиториумот:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm preview:pages
```

Отворете ја точната localhost адреса испечатена од командата. За browser тестови, запрете го QA серверот и користете ги PowerShell командите во англискиот дел: `TEST_PAGES_MODE=1`, точниот `TEST_BASE_PATH` и `TEST_BASE_URL`, па `pnpm test`. Playwright користи Edge. Опционалната `node scripts/audit-university.mjs` проверка бара активен production QA сервер, точен `AUDIT_URL` и интернет за axe-core; не додава зависности или скрипти за посетителите. Автоматските проверки не докажуваат целосна WCAG усогласеност.

### Објавување

**GitHub Pages:** постојниот workflow се задржува. Во GitHub **Settings → Pages → Source** изберете **GitHub Actions**. Base path е `/lumora-company-website/`, а јавната адреса е <https://mtomashevski.github.io/lumora-company-website/>. Build создава HTML за познатите рути и 404; не додавајте `dist/` во Git.

**RepoRun:** `docker-compose.yml` и `stack.yml` се во коренот на репозиториумот. Сервис **web**, внатрешна порта **8080**, **0.50 CPU / 128 MiB RAM**, пристап **cas**, base path **/**. Нема database, CMS, дополнителни сервиси, host порти или mounts. Универзитетот ги управува HTTPS, ingress и CAS. Точниот origin сè уште не е доставен; `VITE_SITE_URL` останува празен додека не се добие вистинската адреса. Не внесувајте измислена адреса или тајни во `VITE_*`.

За локален root build и тестови користете го PowerShell примерот во англискиот дел. Потоа отстранете ги process environment overrides или користете нов терминал за повторен Pages build. [RepoRun водичот](docs/REPORUN.md) ги содржи Docker проверките, SSH deploy key, CAS и рачните чекори. Docker runtime и вистинскиот RepoRun пристап мора да се проверат во околина каде се достапни.

### Структура, приватност и признанија

`src/pages/` се страниците; `src/components/` се заедничките компоненти; `src/data/company.ts` се компаниските информации; `src/data/experiences.ts` се активностите и фотографиите; `src/i18n/` се EN/MK преводите; `public/images/` се локалните ресурси; `tests/site.spec.ts` се browser тестовите; `docker/` и root deployment фајловите се за RepoRun. Измените во преводите и описите на фотографиите треба да се внесат на двата јазика. Зачувајте ги [изворите и признанијата за фотографиите](public/images/CREDITS.md).

Нема HTTP колачиња, аналитика или маркетинг-следење. `localStorage['lumora-cookie-preferences']` ги зачувува верзијата, потврдата, изборот за зачувување на јазикот и времето на зачувување. `localStorage['lumora-language']` го памети EN/MK само додека изборот е вклучен. Поставки за колачиња во подножјето повторно го отвора дијалогот; со исклучување се брише зачуваниот јазик. Ако складирањето е блокирано, изборите важат само за тековната посета и се прикажува објаснување. CAS колачињата и hosting logs се посебна одговорност на универзитетот. Ова не е правна потврда за усогласеност.

Новостите имаат две јасно означени демонстративни статии на EN/MK, без измислени датуми. Нема доставени вистински соопштенија на компанијата. Податоците се во `src/data/news.ts`; заменете ги примерите со содржина и датуми одобрени од сопственикот. Фотографиите прикажуваат дестинации, а не настани. [Белешките за новостите и приватноста](docs/NEWS-PRIVACY.md) го објаснуваат однесувањето и ограничувањата. За unit проверки користете `pnpm test:unit`.


AI алатки, вклучувајќи Codex, помогнаа со код, дебагирање, проверки и документација. Тимот ги избра бизнисот и опсегот, достави ресурси, ги прегледуваше резултатите и ги насочи корекциите. Не измислувајте лични придонеси и не прикривајте AI помош. Дополнете ги точните предмет, професор, студенти, индекси и придонеси во [академскиот водич](docs/UNIVERSITY-GUIDE.md). Компанијата треба да ги потврди правата за објавување фотографии и потребните признанија.
