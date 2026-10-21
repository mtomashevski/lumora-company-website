import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { experiences, destinations } from '../src/data/experiences';
import { company } from '../src/data/company';
import { en } from '../src/i18n/en';
import { mk } from '../src/i18n/mk';
import { newsArticles } from '../src/data/news';
test.beforeEach(async ({ page }) => {
  // Existing flow regressions run as a returning visitor; first visits are tested separately.
  await page.addInitScript(() => {
    try { localStorage.setItem('lumora-cookie-preferences', JSON.stringify({
      version: 1, necessary: true, rememberLanguage: true, savedAt: '2026-10-21T00:00:00.000Z',
    })); } catch { /* Storage-blocked regression intentionally disables this. */ }
  });
});
const testBase = process.env.TEST_BASE_PATH || '/';
const appPath = (route: string) => testBase + route.replace(/^\//, '');
async function visit(page: Page, route: string) {
  return page.goto(appPath(route));
}
const routes = [
  '/',
  '/experiences',
  '/destinations',
  '/about',
  '/contact',
  '/privacy',
  '/news',
  ...newsArticles.map((article) => '/news/' + article.slug),
  '/news/missing-article',
  ...experiences.map((e) => '/experiences/' + e.slug),
  '/experiences/missing-trip',
  '/missing',
];
async function switchToMk(page: Page) {
  if (!(await page.getByRole('button', { name: 'MK — Македонски', exact: true }).isVisible()))
    await page.locator('#menu-toggle').click();
  await page.getByRole('button', { name: 'MK — Македонски', exact: true }).click();
  if (await page.locator('#menu-toggle').isVisible()) await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
}
test('Pages directory routes refresh successfully and unknown paths retain HTTP 404', async ({
  page,
}) => {
  test.skip(process.env.TEST_PAGES_MODE !== '1', 'Requires the strict Pages static preview');
  for (const route of routes) {
    const expected = route.includes('missing') ? 404 : 200;
    expect((await visit(page, route))?.status(), route).toBe(expected);
    await expect(page.locator('h1')).toBeVisible();
    expect((await page.reload())?.status(), route).toBe(expected);
    await expect(page.locator('h1')).toBeVisible();
    if (expected === 404) await expect(page.locator('.not-found')).toBeVisible();
  }
  await visit(page, '/contact?experience=' + experiences[0].slug);
  await expect(page.locator('select[name="experience"]')).toHaveValue(experiences[0].slug);
  await page.reload();
  await expect(page.locator('select[name="experience"]')).toHaveValue(experiences[0].slug);
});
for (const language of ['en', 'mk'] as const) {
  for (const width of [375, 430, 768, 1024, 1440]) {
    test(`Every route is responsive and translated: ${language}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await visit(page, '/');
      if (language === 'mk') await switchToMk(page);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') {
          const expectedDocument404 = /\/(?:missing|experiences\/missing-trip|news\/missing-article)$/.test(
            new URL(message.location().url || 'http://localhost').pathname,
          );
          if (!expectedDocument404) errors.push(message.text());
        }
      });
      for (const route of routes) {
        await visit(page, route);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('html')).toHaveAttribute('lang', language);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          route,
        ).toBe(true);
        expect(await page.title()).toContain(company.companyName);
        expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
        expect(await page.locator('body').innerText()).not.toMatch(
          /sample|demo|preview|university|fictional|illustrative|Lorem ipsum|TBD/i,
        );
        if (language === 'mk') expect(await page.locator('h1').innerText()).toMatch(/[А-Яа-я]/);
        for (const img of await page.locator('img').all()) {
          expect(await img.getAttribute('alt')).toBeTruthy();
          expect(await img.getAttribute('src')).toContain(appPath('/images/'));
        }
      }
      expect(errors).toEqual([]);
    });
  }
  test(`Filters use real locations and categories in ${language}`, async ({ page }) => {
    await visit(page, '/experiences');
    if (language === 'mk') await switchToMk(page);
    await expect(page.locator('.experience-card')).toHaveCount(5);
    await page.locator('select[aria-labelledby="destination-filter-label"]').selectOption('bitola');
    await expect(page.locator('.experience-card')).toHaveCount(1);
    await expect(page).toHaveURL(/destination=bitola/);
    await page
      .locator('select[aria-labelledby="category-filter-label"]')
      .selectOption('nature-adventure');
    await expect(
      page.getByRole('button', { name: (language === 'en' ? en : mk)['catalog.clear'] }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: (language === 'en' ? en : mk)['catalog.clear'] })
      .click();
    await expect(page.locator('.experience-card')).toHaveCount(5);
    await visit(page, '/experiences?category=multi-day');
    await expect(page.locator('.experience-card')).toHaveCount(2);
  });
  test(`Inquiry validation and honest local preparation in ${language}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    let posts = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST') posts++;
    });
    await visit(page, '/contact?experience=' + experiences[0].slug);
    if (language === 'mk') await switchToMk(page);
    const dictionary = language === 'en' ? en : mk;
    await expect(page.locator('select[name="experience"]')).toHaveValue(experiences[0].slug);
    await page.getByRole('button', { name: dictionary['form.prepare'], exact: true }).click();
    await expect(page.locator('#inquiry-name')).toBeFocused();
    await expect(page.locator('#name-error')).toHaveText(dictionary['validation.name']);
    await page.locator('#inquiry-name').fill('Test Traveler');
    await page.locator('#inquiry-email').fill('invalid');
    await page.locator('#inquiry-travelers').fill('0');
    await page.locator('#inquiry-message').fill('Too short');
    await page.getByRole('button', { name: dictionary['form.prepare'], exact: true }).click();
    await expect(page.locator('#email-error')).toHaveText(dictionary['validation.email']);
    await expect(page.locator('#travelers-error')).toHaveText(dictionary['validation.travelers']);
    await expect(page.locator('#message-error')).toHaveText(dictionary['validation.message']);
    await expect(page.locator('#consent-error')).toHaveText(dictionary['validation.consent']);
    await page.locator('#inquiry-email').fill('traveler@example.test');
    await page.locator('#inquiry-travelers').fill('2');
    await page
      .locator('#inquiry-message')
      .fill('Interested in discovering culture and nature around Skopje.');
    await page.locator('#inquiry-consent').check();
    await page.getByRole('button', { name: dictionary['form.prepare'], exact: true }).click();
    await expect(page.locator('#inquiry-confirmation')).toHaveText(
      dictionary['form.preparedTitle'],
    );
    await expect(page.getByRole('status')).toContainText(
      language === 'en' ? 'has not been sent' : 'не е испратена',
    );
    await expect(page.locator('.inquiry-summary textarea')).toHaveValue(
      new RegExp(experiences[0].title[language]),
    );
    await page.getByRole('button', { name: dictionary['form.copy'], exact: true }).click();
    await expect(
      page.getByRole('button', { name: dictionary['form.copied'], exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Test Traveler');
    expect(posts).toBe(0);
    expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['lumora-cookie-preferences', 'lumora-language']);
  });
}
test('Language switches immediately, preserves route/filter/form, and survives refresh', async ({
  page,
}) => {
  await visit(page, '/experiences?destination=matka');
  const original = await page.locator('.experience-card').count();
  await switchToMk(page);
  await expect(page).toHaveURL(/destination=matka/);
  await expect(page.locator('.experience-card')).toHaveCount(original);
  await expect(page.locator('h1')).toHaveText(mk['catalog.title']);
  await page.reload();
  await expect(page.locator('h1')).toHaveText(mk['catalog.title']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
  expect(await page.evaluate(() => localStorage.getItem('lumora-language'))).toBe('mk');
  await visit(page, '/contact');
  await page.locator('#inquiry-name').fill('Ана Тест');
  await page.getByRole('button', { name: 'EN — English', exact: true }).click();
  await expect(page.locator('#inquiry-name')).toHaveValue('Ана Тест');
  await expect(page.locator('h1')).toHaveText(en['contact.title']);
});
test('Mobile navigation and language selector are keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await visit(page, '/');
  await expect(page.locator('#menu-toggle')).toBeVisible();
  await page.bringToFront();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: en['nav.skip'] })).toBeFocused();
  await page.locator('#menu-toggle').click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(
    page.getByRole('navigation').getByRole('link', { name: en['nav.home'], exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'MK — Македонски', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-toggle')).toBeFocused();
  await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('#menu-toggle').click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: mk['nav.experiences'], exact: true })
    .click();
  await expect(page).toHaveURL(/\/experiences$/);
  await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  // A high-zoom/landscape viewport must scroll the menu, not hide focused controls.
  await page.setViewportSize({ width: 320, height: 225 });
  await page.locator('#menu-toggle').click();
  for (let index = 0; index < 8; index++) await page.keyboard.press('Tab');
  await expect(page.locator('.nav-cta')).toBeFocused();
  await expect(page.locator('.nav-cta')).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Escape');
});
test('Each activity links to its verified GetYourGuide listing and inquiry', async ({ page }) => {
  for (const experience of experiences) {
    await visit(page, '/experiences/' + experience.slug);
    const booking = page
      .locator('.inquiry-panel')
      .getByRole('link', { name: /Book on GetYourGuide/ });
    await expect(booking).toHaveAttribute('href', experience.getYourGuideUrl!);
    await expect(booking).toHaveAttribute('target', '_blank');
    await expect(booking).toHaveAttribute('rel', 'noopener noreferrer');
    await page.getByRole('link', { name: en['common.ask'], exact: true }).click();
    await expect(page.locator('select[name="experience"]')).toHaveValue(experience.slug);
  }
});
test('All displayed local assets load, including galleries and official logo', async ({ page }) => {
  for (const route of [
    '/',
    '/about',
    '/destinations',
    ...experiences.map((e) => '/experiences/' + e.slug),
  ]) {
    await visit(page, route);
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
        )
        .toBe(true);
      expect(await img.getAttribute('src')).not.toBe(appPath('/images/fallback.svg'));
    }
  }
  await expect(page.locator('header .official-logo')).toHaveAttribute('src', appPath(company.logo));
});
test('Public company/legal information and safe social links are correct', async ({ page }) => {
  await visit(page, '/privacy');
  await expect(page.locator('.company-information')).toContainText(company.registrationNumber);
  for (const director of company.directors)
    await expect(page.locator('.company-information')).toContainText(director.name);
  await expect(page.locator('address')).toContainText(company.registeredAddress.street);
  await visit(page, '/contact');
  await expect(page.locator('.contact-details')).toContainText(company.instagramHandle);
  await expect(page.locator('.contact-details a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('.contact-details a[href^="tel:"]')).toHaveCount(0);
  for (const anchor of await page.locator('a[target="_blank"]').all())
    await expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.locator('a[href="' + company.getYourGuideUrl + '"]').first()).toBeVisible();
});

test('Final official PNG logo and favicon preserve aspect ratio at every breakpoint', async ({
  page,
}) => {
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await visit(page, '/');
    for (const logo of await page.locator('.official-logo').all()) {
      await expect(logo).toHaveAttribute('src', appPath('/images/brand/lumora-logo.png'));
      await expect
        .poll(() =>
          logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1536),
        )
        .toBe(true);
      const dimensions = await logo.boundingBox();
      expect(dimensions!.width / dimensions!.height).toBeCloseTo(1.5, 1);
      await expect(logo).toHaveCSS('object-fit', 'contain');
    }
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      appPath('/images/brand/lumora-logo.png'),
    );
  }
});
test('Invalid routes and image failures have useful fallbacks', async ({ page }) => {
  await visit(page, '/experiences/not-a-tour');
  await expect(page.locator('.not-found')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.route('**/macedonian-heritage/image2.avif', (route) => route.abort());
  await visit(page, '/');
  await expect(page.locator('.hero > img')).toHaveAttribute('src', appPath('/images/fallback.svg'));
  await expect
    .poll(() =>
      page
        .locator('.hero > img')
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
});
test('Destinations derive from real activity locations', async ({ page }) => {
  await visit(page, '/destinations');
  await expect(page.locator('.destination-tile')).toHaveCount(destinations.length);
  await page.locator('a[href="' + appPath('/experiences?destination=debar') + '"]').click();
  await expect(page.locator('.experience-card')).toHaveCount(1);
});
test('Long Macedonian card content stays within a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await visit(page, '/experiences');
  await switchToMk(page);
  await page
    .locator('.card-title a')
    .first()
    .evaluate(
      (el) =>
        (el.textContent =
          'Доживување со многу долго име низ најубавите предели и културното наследство на Северна Македонија'),
    );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('The site still loads if preference storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await visit(page, '/');
  await expect(page.locator('h1')).toContainText(en['home.titleFirst']);
  await switchToMk(page);
  await expect(page.locator('h1')).toContainText(mk['home.titleFirst']);
});
test('Form boundaries and placeholder text retain accessible contrast', async ({ page }) => {
  const measure = async (selector: string) => page.locator(selector).evaluateAll((elements) => {
    const channels = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (color: string) => {
      const values = channels(color).map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
    };
    const contrast = (foreground: string, background: string) => {
      const a = luminance(foreground), b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    return elements.map((element) => {
      const style = window.getComputedStyle(element);
      let parent = element.parentElement;
      let background = 'rgb(255, 255, 255)';
      while (parent) {
        const candidate = window.getComputedStyle(parent).backgroundColor;
        if (candidate !== 'rgba(0, 0, 0, 0)' && candidate !== 'transparent') {
          background = candidate;
          break;
        }
        parent = parent.parentElement;
      }
      return {
        border: contrast(style.borderTopColor, background),
        placeholder: element.hasAttribute('placeholder')
          ? contrast(window.getComputedStyle(element, '::placeholder').color, style.backgroundColor)
          : null,
      };
    });
  });
  await visit(page, '/experiences');
  for (const result of await measure('.filter-bar select')) expect(result.border).toBeGreaterThanOrEqual(3);
  await visit(page, '/contact');
  for (const result of await measure('.form-grid input, .form-grid select, .form-grid textarea')) {
    expect(result.border).toBeGreaterThanOrEqual(3);
    if (result.placeholder !== null) expect(result.placeholder).toBeGreaterThanOrEqual(4.5);
  }
});

test('Directory redirects preserve generated, runtime, Open Graph and sitemap canonical URLs', async ({
  page,
  request,
}) => {
  test.skip(process.env.TEST_PAGES_MODE !== '1', 'Requires directory-index production output');
  const origin = process.env.TEST_SITE_URL ??
    (testBase === '/' ? '' : 'https://mtomashevski.github.io');
  const knownRoutes = routes.filter((route) => !route.includes('missing'));
  const expectedUrl = (route: string) =>
    origin + appPath(route === '/' ? '/' : route.replace(/\/+$/, '') + '/');
  const sitemap = origin ? await (await request.get(appPath('/sitemap.xml'))).text() : '';

  // The existing static host redirects directory requests; SEO must match before and after it.
  const redirect = await request.get(appPath('/about?source=canonical-check'), { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toBe(appPath('/about/?source=canonical-check'));

  for (const language of ['en', 'mk'] as const) {
    await visit(page, '/');
    if (language === 'mk') await switchToMk(page);
    for (const route of knownRoutes) {
      const response = await visit(page, route + '?source=canonical-check');
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      expect(new URL(page.url()).pathname).toBe(appPath(route === '/' ? '/' : route + '/'));
      const html = await response!.text();
      if (origin) {
        const expected = expectedUrl(route);
        expect(html).toContain(`rel="canonical" href="${expected}"`);
        expect(html).toContain(`property="og:url" content="${expected}"`);
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expected);
        expect(sitemap).toContain(`<loc>${expected}</loc>`);
        await page.reload();
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);
      } else {
        expect(html).not.toContain('rel="canonical"');
        expect(html).not.toContain('property="og:url"');
        expect(html).not.toContain('https://mtomashevski.github.io');
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
        await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
      }
    }
    // Client navigation has no host redirect, so slashless route URLs need the same metadata.
    await visit(page, '/');
    await page.locator('#main-navigation').getByRole('link', {
      name: language === 'mk' ? mk['nav.about'] : en['nav.about'], exact: true,
    }).click();
    expect(new URL(page.url()).pathname).toBe(appPath('/about'));
    if (origin) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedUrl('/about'));
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl('/about'));
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    }
  }
  if (!origin) expect((await request.get(appPath('/sitemap.xml'))).status()).toBe(404);
  await visit(page, '/missing');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
