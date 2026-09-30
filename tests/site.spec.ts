import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { experiences, destinations } from '../src/data/experiences';
import { company } from '../src/data/company';
import { en } from '../src/i18n/en';
import { mk } from '../src/i18n/mk';
const routes = [
  '/',
  '/experiences',
  '/destinations',
  '/about',
  '/contact',
  '/privacy',
  ...experiences.map((e) => '/experiences/' + e.slug),
  '/experiences/missing-trip',
  '/missing',
];
async function switchToMk(page: Page) {
  if (!(await page.getByRole('button', { name: 'Македонски', exact: true }).isVisible()))
    await page.locator('#menu-toggle').click();
  await page.getByRole('button', { name: 'Македонски', exact: true }).click();
  if (await page.locator('#menu-toggle').isVisible()) await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
}
for (const language of ['en', 'mk'] as const) {
  for (const width of [375, 430, 768, 1024, 1440]) {
    test(`Every route is responsive and translated: ${language}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      if (language === 'mk') await switchToMk(page);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      for (const route of routes) {
        await page.goto(route);
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
          expect(await img.getAttribute('src')).toMatch(/^\/images\//);
        }
      }
      expect(errors).toEqual([]);
    });
  }
  test(`Filters use real locations and categories in ${language}`, async ({ page }) => {
    await page.goto('/experiences');
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
    await page.goto('/experiences?category=multi-day');
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
    await page.goto('/contact?experience=' + experiences[0].slug);
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
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['lumora-language']);
  });
}
test('Language switches immediately, preserves route/filter/form, and survives refresh', async ({
  page,
}) => {
  await page.goto('/experiences?destination=matka');
  const original = await page.locator('.experience-card').count();
  await switchToMk(page);
  await expect(page).toHaveURL(/destination=matka/);
  await expect(page.locator('.experience-card')).toHaveCount(original);
  await expect(page.locator('h1')).toHaveText(mk['catalog.title']);
  await page.reload();
  await expect(page.locator('h1')).toHaveText(mk['catalog.title']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'mk');
  expect(await page.evaluate(() => localStorage.getItem('lumora-language'))).toBe('mk');
  await page.goto('/contact');
  await page.locator('#inquiry-name').fill('Ана Тест');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('#inquiry-name')).toHaveValue('Ана Тест');
  await expect(page.locator('h1')).toHaveText(en['contact.title']);
});
test('Mobile navigation and language selector are keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: en['nav.skip'] })).toBeFocused();
  await page.locator('#menu-toggle').click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('button', { name: 'Македонски', exact: true }).focus();
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
});
test('Each activity links to its verified GetYourGuide listing and inquiry', async ({ page }) => {
  for (const experience of experiences) {
    await page.goto('/experiences/' + experience.slug);
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
    await page.goto(route);
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
        )
        .toBe(true);
      expect(await img.getAttribute('src')).not.toBe('/images/fallback.svg');
    }
  }
  await expect(page.locator('header .official-logo')).toHaveAttribute('src', company.logo);
});
test('Public company/legal information and safe social links are correct', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('.company-information')).toContainText(company.registrationNumber);
  for (const director of company.directors)
    await expect(page.locator('.company-information')).toContainText(director.name);
  await expect(page.locator('address')).toContainText(company.registeredAddress.street);
  await page.goto('/contact');
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
    await page.goto('/');
    for (const logo of await page.locator('.official-logo').all()) {
      await expect(logo).toHaveAttribute('src', '/images/brand/lumora-logo.png');
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
      '/images/brand/lumora-logo.png',
    );
  }
});
test('Invalid routes and image failures have useful fallbacks', async ({ page }) => {
  await page.goto('/experiences/not-a-tour');
  await expect(page.locator('.not-found')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.route('**/macedonian-heritage/image2.avif', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.hero > img')).toHaveAttribute('src', '/images/fallback.svg');
  await expect
    .poll(() =>
      page
        .locator('.hero > img')
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
});
test('Destinations derive from real activity locations', async ({ page }) => {
  await page.goto('/destinations');
  await expect(page.locator('.destination-tile')).toHaveCount(destinations.length);
  await page.locator('a[href="/experiences?destination=debar"]').click();
  await expect(page.locator('.experience-card')).toHaveCount(1);
});
test('Long Macedonian card content stays within a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/experiences');
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
  await page.goto('/');
  await expect(page.locator('h1')).toContainText(en['home.titleFirst']);
  await switchToMk(page);
  await expect(page.locator('h1')).toContainText(mk['home.titleFirst']);
});
