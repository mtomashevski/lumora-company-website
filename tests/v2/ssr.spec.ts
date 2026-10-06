import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { experiences } from '../../src/data/experiences';
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');

test('actual HTML is server-rendered for four locale routes and all stable tour slugs', async ({
  request,
}) => {
  for (const locale of ['en', 'mk', 'it', 'tr']) {
    const response = await request.get(`/${locale}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<html lang="${locale}">`);
    expect(html).toContain(
      `<h1>${escapeHtml(experiences[0].title[locale === 'mk' ? 'mk' : 'en'])}</h1>`,
    );
    expect(html).toContain(`http://127.0.0.1:5190/${locale}/`);
    expect(html).not.toContain('PHASE1_SYNTHETIC_SERVER_SENTINEL_2026');
    expect(html).toContain(
      createHash('sha256').update('PHASE1_SYNTHETIC_SERVER_SENTINEL_2026').digest('hex'),
    );
    for (const tour of experiences) {
      const detail = await request.get(`/${locale}/experiences/${tour.slug}`);
      expect(detail.status()).toBe(200);
      expect(await detail.text()).toContain(
        `<p>${escapeHtml(tour.description[locale === 'mk' ? 'mk' : 'en'])}</p>`,
      );
    }
  }
});
test('content and brand remain visible when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5190/mk/');
  await expect(page.locator('h1')).toHaveText(experiences[0].title.mk);
  await expect(page.locator('.official-logo')).toHaveAttribute(
    'src',
    '/images/brand/lumora-logo.png',
  );
  await context.close();
});
test('hydration, locale links, persistence, assets and mobile overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('lumora-language')) localStorage.setItem('lumora-language', 'mk');
  });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Hydration check: 0' }).click();
  await expect(page.getByRole('button', { name: 'Hydration check: 1' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'MK', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
  await page.reload();
  await expect(page.locator('h1')).toHaveText(experiences[0].title.mk);
  for (const locale of ['it', 'tr']) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: locale.toUpperCase(), exact: true })
      .click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('main')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('note')).toContainText('English content fallback');
  }
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lumora-language'))).toBe('tr');
  await page.goto('/');
  await expect(page).toHaveURL(/\/tr\/$/);
  await page.locator('.card-image').click();
  await expect(page).toHaveURL(new RegExp(`/tr/experiences/${experiences[0].slug}$`));
  await page.reload();
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
      )
      .toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('unknown locale, slug and path return real HTTP 404', async ({ request }) => {
  for (const path of ['/de/', '/en/experiences/unknown-tour', '/unknown/path']) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('Page not found');
  }
});
test('resource route returns minimal JSON without server configuration', async ({ request }) => {
  const response = await request.get('/health');
  expect(await response.json()).toEqual({ status: 'ok', scope: 'phase-1-spike' });
  expect(response.headers()['cache-control']).toBe('no-store');
});

test('locale routing hydrates with blocked preference storage', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => {
          throw new Error('blocked storage');
        },
        setItem: () => {
          throw new Error('blocked storage');
        },
      },
    });
  });
  await page.goto('/mk/');
  await expect(page.locator('h1')).toHaveText(experiences[0].title.mk);
  await page.getByRole('button', { name: 'Hydration check: 0' }).click();
  await expect(page.getByRole('button', { name: 'Hydration check: 1' })).toBeVisible();
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  expect(errors).toEqual([]);
});
