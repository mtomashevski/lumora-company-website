# University submission and presentation guide / Водич за предавање

Preserved academic information and presentation notes. Complete only with truthful course/team details. / Зачувани академски информации и белешки за презентација. Дополнете само со точни податоци.

<a id="mk-academic"></a>

## Македонски

### 15. Академски информации и автори

| Поле                   | Податок                                                     |
| ---------------------- | ----------------------------------------------------------- |
| Проект                 | Lumora Company Website                                      |
| Контекст               | Универзитетски проект по Бизнис пракса за реален мал бизнис |
| Факултет / универзитет | **[Да се дополни официјален назив]**                        |
| Предмет                | Бизнис пракса — **[Да се потврди официјален назив/код]**    |
| Академска година       | **[Да се дополни]**                                         |
| Професор / ментор      | **[Да се дополни]**                                         |
| Тим / група            | **[Да се дополни]**                                         |
| Датум на предавање     | **[Да се дополни]**                                         |

**Студентски автори / проектен тим:**

| Име и презиме                        | Индекс       | Реална улога / придонес |
| ------------------------------------ | ------------ | ----------------------- |
| **[Студент 1]**                      | **[Индекс]** | **[Да се дополни]**     |
| **[Додајте ги вистинските членови]** | **[Индекс]** | **[Да се дополни]**     |

Пополнете во двата јазика пред предавање. Lumora управителите не се автоматски student developers. Нема измислени имиња/индекси/професор/URLs. Потврдете photo права, academic AI правила, live business услови и deployment.

<a id="mk-presentation"></a>

### 16. Насоки за презентација

#### Подготовка и редослед за 5–10 минути

Стартувајте production preview; подгответе Home, каталог, една тура, Contact и `company.ts`, `experiences.ts`, `App.tsx`, `LanguageContext.tsx`. Проверете мрежа за booking/social. Screenshot е резервна документација ако live demo не е возможно; кажете дека е снимка.

| Време      | Тема / точки                                                                |
| ---------- | --------------------------------------------------------------------------- |
| 0:00–1:00  | Lumora и проблем: независна организирана презентација покрај social/booking |
| 1:00–2:00  | Решение/опсег: каталог, EN/MK, mobile, надворешна резервација               |
| 2:00–5:00  | Live јазик, филтер, тура, GetYourGuide, компанија/прашање                   |
| 5:00–7:00  | React reuse, TypeScript модел, slug route, data/UI/translation separation   |
| 7:00–8:00  | LocalStorage, no unnecessary backend/payment, base/fallback hosting         |
| 8:00–9:00  | AI улога, QA, ограничувања и реални подобрувања                             |
| 9:00–10:00 | Прашања со конкретни source примери                                         |

За пет минути, покажете една тура и форма, а архитектурата со еден запис/рута. Не меморирајте говор; објаснете која потреба ја решава секоја одлука.

#### Live-demo тек

1. Home: вистинско лого, business идентитет, CTA.
2. EN → MK и refresh за persistence.
3. Experiences: Matka/Ohrid + категорија, reset/empty ако има време.
4. Вистинска тура: duration, locations, highlights/gallery и разлики во optional секциите.
5. Booking link во нов таб, без реална reservation/payment.
6. Destinations → filtered catalog; About → управители; Privacy → legal data.
7. Contact: празна форма за errors, па синтетички валидни податоци/consent → prepared not sent → copy. Не испраќајте тест прашање до бизнисот.
8. Mobile viewport/menu, keyboard и MK без overflow.
9. `Experience` запис + `App.tsx`: како се додава тура без нов detail page.

#### Што треба да разбира презентерот

Следете `Experience` → card → slug → detail. Објаснете query filters, `t` наспроти `l`, localStorage, adapter и links наспроти API. Знајте дека Vite build не е hosting, BrowserRouter бара hosting поддршка; овој build генерира route indexes и HTTP 404, from-price не е live inventory, и формата не испраќа email. Прочитајте ги малите source фајлови и назначете ги вистинските придонеси на тимот.

#### Можни прашања и одговори

| Прашање                          | Точен краток одговор                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Зошто оваа компанија?            | Реален мал бизнис со потреба од независна презентациска страница.                                                        |
| Кој проблем го решавате?         | Структуриран двојазичен каталог со компаниски информации и контакт, покрај социјалните и резервациските платформи.       |
| Зошто React?                     | Повторлива употреба на распоредот, картичките и интерфејсот без дуплирани страници.                                      |
| Зошто TypeScript?                | Јасни модели и проверки на типови за тури, преводи и форма.                                                              |
| Зошто Vite?                      | Едноставен dev server и оптимизиран статички build.                                                                      |
| Зошто нема database?             | Мал јавен каталог во кодот; нема профили или тековна достапност на места.                                                |
| Како се чуваат турите?           | Типизиран `Experience[]` во `src/data/experiences.ts`.                                                                   |
| Како работат динамичните детали? | `:slug` наоѓа запис; непознат slug враќа NotFound UI.                                                                    |
| Како работат филтрите?           | Стабилни ID во query параметри, проверка на `locations`/`categories` со AND.                                             |
| Како работи EN/MK?               | Состојба во Context, `t` за речниците и `l` за деловниот текст.                                                          |
| Зошто localStorage?              | Зачувување само на en/mk без профил/backend.                                                                             |
| Што се случува при refresh?      | Јазикот и query параметрите се задржуваат; внесот во меморијата на формата се губи.                                      |
| Зошто GetYourGuide?              | Постоечки канал за резервации на бизнисот; не го дуплираме плаќањето.                                                    |
| Дали сајтот наплаќа?             | Не, плаќањето и достапноста се проверуваат надворешно.                                                                   |
| Дали има social/booking API?     | Не, обични врски со безбедносни атрибути за нов таб.                                                                     |
| Дали формата праќа email?        | Тековно не: подготвува порака за копирање и рачно испраќање преку Instagram.                                             |
| Како би се активирала испорака?  | POST endpoint, серверска валидација, ажурирана приватност и тестови за испорака.                                         |
| Како се оптимизираат сликите?    | AVIF/WebP, одложено вчитување и зададени пропорции; нема автоматска обработка на слики.                                  |
| Зошто PNG?                       | Официјален транспарентен знак, зачуван 3:2 однос.                                                                        |
| Како е responsive?               | Grid/flex, media queries и мобилно мени; проверени пет ширини.                                                           |
| Што е accessibility тука?        | Ознаки/alt, семантички HTML, фокус/skip link, menu ARIA, јазик и намалено движење; нема сертификат.                      |
| Како се решава subdirectory?     | Base поставка за ресурси/слики/рутер и генерирани HTML indexes за познатите рути.                                                    |
| Што е invalid URL?               | Брендирана 404 со noindex; HTTP статусот зависи од хостот.                                                               |
| Како се додава тура?             | Нов запис со EN/MK, фотографии и резервациска врска, без нова компонента за детали.                                      |
| Како се додава јазик?            | Типови, речник, provider, селектор, метаподатоци и сите деловни преводи.                                                 |
| Каков SEO постои?                | Метаподатоци за рути, читливи URL, robots/favicon; со домен sitemap/canonical/schema; содржината се рендерира клиентски. |
| Како е проверен проектот?        | Typecheck/lint/build, 26 Playwright тестови, visual/nested-base QA.                                                      |
| Што прво би подобриле?           | Реална испорака на прашања и потврден хостинг, потоа деловна содржина и SEO.                                             |
| Користевте AI? За што?           | Да, Codex за код, дебагирање, рефакторирање, проверки и документација.                                                   |
| Што направија студентите?        | Избор на бизнис, опсег и ресурси, преглед, корекции и одлуки; наведете ги вистинските лични придонеси.                   |

#### Објаснување на AI

„Codex го користевме како развојна алатка. Тимот ги зададе барањата и реалните ресурси, го прегледуваше резултатот и ги насочуваше корекциите. Можеме да ја објасниме финалната структура и ограничувањата.“ Дајте пример: real photo замена или base-path корекција. Не звучете одбранбено, не кажувајте само „AI го направи“ и не измислувајте индивидуален придонес.

#### Брз потсетник

| Точка      | Потсетник                                                           |
| ---------- | ------------------------------------------------------------------- |
| Проект     | Lumora Company Website — Бизнис пракса за реален туристички бизнис  |
| Проблем    | Независно структурирано присуство покрај Instagram/GetYourGuide     |
| Решение    | Двојазична презентациска апликација со каталог и тек за контакт     |
| Stack      | React, TypeScript, Vite, Router, Tailwind + custom CSS, Lucide      |
| Јазици     | EN/MK Context, `lumora-language` localStorage                       |
| Data       | `Experience[]` + company config одвоени од UI                       |
| Booking    | Вистинска GetYourGuide активност, без локално плаќање               |
| Contact    | Валидација → локална порака → копирање/Instagram; endpoint е празен |
| Images     | Локални AVIF/WebP и PNG лого, одложено вчитување и fallback         |
| Routing    | BrowserRouter/slug; base и генерирани route indexes за nested refresh          |
| Responsive | Grid/flex, мобилно мени, пет ширини                                 |
| AI         | Codex поддршка; тимски опсег, ресурси, преглед и корекции           |
| Иднина     | Inquiry backend, повеќе тури/јазици, SEO/CI                         |

---


<a id="en-academic"></a>

## English

### 15. Academic information and authors

| Field                  | Information                                                    |
| ---------------------- | -------------------------------------------------------------- |
| Project                | Lumora Company Website                                         |
| Context                | University Business Practice project for a real small business |
| Faculty / university   | **[Insert official name]**                                     |
| Course                 | Business Practice — **[Confirm official title/code]**          |
| Academic year          | **[Complete]**                                                 |
| Professor / supervisor | **[Complete]**                                                 |
| Team / group           | **[Complete]**                                                 |
| Submission date        | **[Complete]**                                                 |

**Student authors / project team:**

| Full name                | Student index | Actual role / contribution |
| ------------------------ | ------------- | -------------------------- |
| **[Student 1]**          | **[Index]**   | **[Complete]**             |
| **[Add actual members]** | **[Index]**   | **[Complete]**             |

Complete both languages before submission. Lumora's directors are not automatically student developers. No names/index numbers/professor/URLs are invented. Confirm photo rights, academic AI requirements, live business conditions and deployment.

<a id="en-presentation"></a>

### 16. Presentation guide

#### Preparation and recommended 5–10-minute structure

Start production preview; prepare Home, the catalog, one tour, Contact and `company.ts`, `experiences.ts`, `App.tsx`, `LanguageContext.tsx`. Check network access for booking/social links. Screenshots are fallback documentation if live demonstration is unavailable; identify them as screenshots.

| Time       | Topic / talking points                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| 0:00–1:00  | Lumora and the problem: independent structured presentation alongside social/booking channels |
| 1:00–2:00  | Solution/scope: catalog, EN/MK, mobile, external booking                                      |
| 2:00–5:00  | Live language switch, filter, tour, GetYourGuide, company/inquiry                             |
| 5:00–7:00  | React reuse, TypeScript model, slug route, data/UI/translation separation                     |
| 7:00–8:00  | LocalStorage, avoiding unnecessary backend/payment, base/fallback hosting                     |
| 8:00–9:00  | AI role, QA, limitations and realistic improvements                                           |
| 9:00–10:00 | Questions with concrete source examples                                                       |

For five minutes, show one tour and the form; explain architecture through one record/route. Do not memorize a speech; explain the requirement each decision addresses.

#### Live demonstration sequence

1. Home: real logo, company identity, calls to action.
2. EN → MK, then refresh for persistence.
3. Experiences: Matka/Ohrid plus category; reset/empty state if time allows.
4. Real tour: duration, locations, highlights/gallery and differences in optional sections.
5. Booking link opens a new tab; no actual reservation/payment during the demonstration.
6. Destinations → filtered catalog; About → directors; Privacy → legal data.
7. Contact: empty form for errors, then synthetic valid data/consent → prepared, not sent → copy. Do not send a test inquiry to the business.
8. Mobile viewport/menu, keyboard navigation and Macedonian without overflow.
9. `Experience` record + `App.tsx`: adding a tour without another detail page.

#### What the presenter should understand

Trace `Experience` → card → slug → detail. Explain query filters, `t` versus `l`, localStorage, the adapter, and links versus APIs. Know that Vite build is not hosting, BrowserRouter needs hosting support; this build generates route indexes and HTTP 404, starting prices are not live inventory, and the form does not send email. Read the small source files and identify the team's actual contributions.

#### Possible questions and answers

| Question                             | Accurate short answer                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Why this company?                    | A real small business needing an independent presentation website.                                        |
| What problem does it solve?          | A structured bilingual catalog and company/contact information alongside social/booking platforms.        |
| Why React?                           | Reusable layout/cards/UI without duplicate pages.                                                         |
| Why TypeScript?                      | Clear models and type checks for tours, translations and forms.                                           |
| Why Vite?                            | Simple development server and optimized static build.                                                     |
| Why no database?                     | A small public source catalog; no accounts or live inventory.                                             |
| How are tours stored?                | Typed `Experience[]` in `src/data/experiences.ts`.                                                        |
| How do dynamic details work?         | `:slug` finds a record; an unknown slug renders NotFound.                                                 |
| How do filters work?                 | Stable query IDs, `locations`/`categories`, combined with AND.                                            |
| How does EN/MK work?                 | Context state, `t` dictionaries and `l` business content.                                                 |
| Why localStorage?                    | Persist only en/mk without accounts/backend.                                                              |
| What happens after refresh?          | Language/query persist; in-memory form data is lost.                                                      |
| Why GetYourGuide?                    | Existing business booking channel; checkout is not duplicated.                                            |
| Does the site process payment?       | No, payment/availability are external.                                                                    |
| Is there a social/booking API?       | No, ordinary links with new-tab security.                                                                 |
| Does the form send email?            | Currently no: prepared copy/manual Instagram sharing.                                                     |
| How could delivery be enabled?       | POST endpoint plus server validation/privacy/delivery testing.                                            |
| How are images optimized?            | AVIF/WebP, lazy loading and proportions; no automatic image pipeline.                                     |
| Why PNG?                             | Official transparent branding with preserved 3:2 proportions.                                             |
| How is it responsive?                | Grid/flex, media queries and mobile navigation; five tested widths.                                       |
| What accessibility work exists?      | Labels/alt, semantic HTML, focus/skip/menu ARIA/language/reduced motion; no certification.                |
| How is subdirectory hosting handled? | Base configuration for assets/images/router plus generated HTML indexes for known routes.                               |
| What happens with an invalid URL?    | Branded noindex 404; HTTP status depends on hosting.                                                      |
| How would you add a tour?            | New data + EN/MK/images/booking without a new detail component.                                           |
| How would you add a language?        | Types/dictionary/provider/selector/metadata and all business translations.                                |
| What SEO exists?                     | Route metadata/clean URLs/robots/favicon, domain-enabled sitemap/canonical/schema; client-rendered body.  |
| How was it verified?                 | Typecheck/lint/build, 26 Playwright tests, visual/nested-base QA.                                         |
| What would you improve first?        | Real inquiry delivery and confirmed hosting, then business content/SEO.                                   |
| Did you use AI? What for?            | Yes, Codex for code/debugging/refactoring/checks/documentation.                                           |
| What did the students do?            | Business selection, scope/resources, review/corrections/decisions; state actual individual contributions. |

#### Explaining AI assistance

“We used Codex as a development tool. The team supplied requirements and real resources, reviewed results and directed corrections. We can explain the final structure and limitations.” Give an example, such as replacing stock photography or correcting base-path handling. Be transparent rather than defensive; do not reduce the explanation to “AI made it” or invent personal contributions.

#### Quick presentation cheat sheet

| Point      | Reminder                                                              |
| ---------- | --------------------------------------------------------------------- |
| Project    | Lumora Company Website — Business Practice for a real travel business |
| Problem    | Independent structured presence alongside Instagram/GetYourGuide      |
| Solution   | Bilingual presentation/discovery frontend with catalog/contact flow   |
| Stack      | React, TypeScript, Vite, Router, Tailwind + custom CSS, Lucide        |
| Languages  | EN/MK Context, `lumora-language` localStorage                         |
| Data       | `Experience[]` + company configuration separated from UI              |
| Booking    | Real GetYourGuide activity link, no local payment                     |
| Contact    | Validation → local message → copy/Instagram; endpoint empty           |
| Images     | Local AVIF/WebP + PNG logo, lazy loading/fallback                     |
| Routing    | BrowserRouter/slug; base and generated route indexes for nested refresh         |
| Responsive | Grid/flex/mobile menu/five widths                                     |
| AI         | Codex assistance, human scope/resources/review/corrections            |
| Future     | Inquiry backend, additional tours/languages, SEO/CI                   |
