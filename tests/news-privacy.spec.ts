import { test, expect } from '@playwright/test';
import { newsArticles } from '../src/data/news';
import { en } from '../src/i18n/en';
import { mk } from '../src/i18n/mk';
import type { Page } from '@playwright/test';

const base = process.env.TEST_BASE_PATH || '/';
const path = (route = '') => base + route;
async function language(page: Page, locale: 'en' | 'mk') {
  if (locale === 'mk') {
    if (await page.locator('#menu-toggle').isVisible()) await page.locator('#menu-toggle').click();
    await page.getByRole('button', { name: 'MK — Македонски', exact: true }).click();
    if (await page.locator('#menu-toggle').isVisible()) await page.keyboard.press('Escape');
  }
}
for (const locale of ['en', 'mk'] as const) {
  const copy = locale === 'mk' ? mk : en;
  test(`News articles, clear example labels, navigation and direct refresh: ${locale}`, async ({
    page,
  }) => {
    await page.goto(path());
    await language(page, locale);
    await page.getByRole('button', { name: copy['cookies.acknowledge'], exact: true }).click();
    if (await page.locator('#menu-toggle').isVisible()) await page.locator('#menu-toggle').click();
    await page
      .locator('#main-navigation')
      .getByRole('link', { name: copy['nav.news'], exact: true })
      .click();
    await expect(page.locator('h1')).toHaveText(copy['news.title']);
    await expect(page.locator('.news-card')).toHaveCount(newsArticles.length);
    await expect(page.locator('.news-demonstration-note')).toHaveText(
      copy['news.demonstrationNote'],
    );
    await expect(page.locator('time')).toHaveCount(0);
    for (const article of newsArticles) {
      await page.goto(path('news/' + article.slug));
      await expect(page.locator('h1')).toHaveText(article.title[locale]);
      await expect(page.locator('.news-article-body h2')).toHaveCount(article.sections.length);
      await expect(page.locator('.news-demonstration-note')).toHaveText(
        copy['news.demonstrationNote'],
      );
      expect((await page.reload())?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveText(article.title[locale]);
      await page.locator('.news-article > a').click();
      await expect(page.locator('h1')).toHaveText(copy['news.title']);
    }
    await expect(
      page.locator('footer').getByRole('link', { name: copy['nav.news'], exact: true }),
    ).toBeVisible();
    await page.goto(path('news/unknown-article'));
    await expect(page.locator('.not-found')).toBeVisible();
  });
  for (const width of [375, 430, 768, 1024, 1440]) {
    test(`News, first-visit notice and settings fit ${width}px in ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path('news'));
      await language(page, locale);
      await expect(page.locator('.privacy-notice')).toBeVisible();
      const banner = await page.locator('.privacy-notice').boundingBox();
      expect(banner!.x).toBeGreaterThanOrEqual(0);
      expect(banner!.x + banner!.width).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: copy['cookies.customize'], exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const dialog = await page.getByRole('dialog').boundingBox();
      expect(dialog!.x).toBeGreaterThanOrEqual(0);
      expect(dialog!.x + dialog!.width).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: copy['cookies.save'], exact: true }).click();
      await expect(page.locator('.privacy-notice')).toHaveCount(0);
      for (const route of [
        'news',
        ...newsArticles.map((article) => 'news/' + article.slug),
        'privacy',
      ]) {
        await page.goto(path(route));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        await expect(page.locator('h1')).toHaveCount(1);
        for (const image of await page.locator('img').all()) {
          expect(await image.getAttribute('alt')).toBeTruthy();
          expect(
            await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
          ).toBe(true);
        }
      }
    });
  }
}
test('First-visit acknowledgment persists, with truthful storage and no tracking', async ({
  page,
  context,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.url());
  });
  await page.goto(path());
  await expect(page.locator('.privacy-notice')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('lumora-cookie-preferences'))).toBeNull();
  await page.getByRole('button', { name: en['cookies.acknowledge'], exact: true }).click();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lumora-cookie-preferences')!),
  );
  expect(saved).toMatchObject({ version: 1, necessary: true, rememberLanguage: true });
  expect(Number.isFinite(Date.parse(saved.savedAt))).toBe(true);
  await page.reload();
  await expect(page.locator('.privacy-notice')).toHaveCount(0);
  await page
    .locator('footer')
    .getByRole('button', { name: en['cookies.settings'], exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('checkbox')).toHaveCount(1);
  await expect(page.getByRole('dialog')).toContainText(en['cookies.noTracking']);
  expect(await context.cookies()).toEqual([]);
  expect(external).toEqual([]);
});
test('Language storage can be disabled and re-enabled through saved preferences', async ({
  page,
}) => {
  await page.goto(path());
  await language(page, 'mk');
  await page.getByRole('button', { name: mk['cookies.customize'], exact: true }).click();
  await page.getByRole('checkbox', { name: new RegExp(mk['cookies.rememberLanguage']) }).uncheck();
  await page.getByRole('button', { name: mk['cookies.save'], exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lumora-language'))).toBeNull();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.privacy-notice')).toHaveCount(0);
  await page
    .locator('footer')
    .getByRole('button', { name: en['cookies.settings'], exact: true })
    .click();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: en['cookies.save'], exact: true }).click();
  await language(page, 'mk');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
});
for (const record of [
  '{',
  JSON.stringify({ version: 0 }),
  JSON.stringify({ version: 1, necessary: true }),
]) {
  test(`Invalid or obsolete privacy record shows the notice: ${record}`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('lumora-cookie-preferences', value),
      record,
    );
    await page.goto(path());
    await expect(page.locator('.privacy-notice')).toBeVisible();
  });
}
test('Settings dialog keeps keyboard focus, closes with Escape and restores its opener', async ({
  page,
}) => {
  await page.goto(path());
  await page.getByRole('button', { name: en['cookies.acknowledge'], exact: true }).click();
  const opener = page
    .locator('footer')
    .getByRole('button', { name: en['cookies.settings'], exact: true });
  await opener.click();
  await expect(page.getByRole('button', { name: en['cookies.close'], exact: true })).toBeFocused();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(
      true,
    );
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
});
test('Unavailable browser storage never crashes the site and explains session-only saving', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    }),
  );
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(path('news'));
  await expect(page.locator('h1')).toHaveText(en['news.title']);
  await page.getByRole('button', { name: en['cookies.acknowledge'], exact: true }).click();
  await expect(page.locator('footer').getByRole('status')).toHaveText(en['cookies.unavailable']);
  await page.reload();
  await expect(page.locator('.privacy-notice')).toBeVisible();
  expect(errors).toEqual([]);
});
