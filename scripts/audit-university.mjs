// Production-browser audit only; axe is fetched in memory, never shipped to visitors.
/* global fetch, localStorage, window, document, PerformanceObserver, innerWidth */
import { chromium } from '@playwright/test';
import { securityHeaders } from './security-headers.mjs';

const origin = process.env.AUDIT_URL || 'http://127.0.0.1:4182/';
const axeResponse = await fetch('https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js');
if (!axeResponse.ok) throw new Error(`axe download failed: ${axeResponse.status}`);
const axeSource = await axeResponse.text();
const headers = await securityHeaders();
const browser = await chromium.launch({ channel: 'msedge' });
const paths = ['', 'experiences', 'destinations', 'about', 'contact', 'privacy',
  'news', 'news/a-moment-by-lake-ohrid', 'news/a-thoughtful-day-outdoors', 'news/not-a-story',
  'experiences/macedonia-heritage-vodno-matka', 'experiences/vodno-to-matka-journey',
  'experiences/three-day-ohrid-bitola-debar', 'experiences/two-day-ohrid-boat-hotel',
  'experiences/lake-ohrid-legends-from-skopje', 'not-a-page', 'experiences/not-a-tour'];
const findings = new Map();
const results = { axeVersion: '4.14.0', pages: 0, informativeImages: 0,
  decorativeImages: 0, missingAlt: 0, brokenImages: [], overflow: [], headings: [],
  interactiveChecks: 0, consoleErrors: [], cspViolations: [], cookies: [], storage: [], measurements: [] };
async function scan(page, active) {
  if (!await page.evaluate(() => Boolean(window.axe))) await page.evaluate(axeSource);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  // Contrast/target checks in recent axe versions are viewport-sensitive.
  for (let y = 0; y < height; y += 800) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(100);
    const violations = await page.evaluate(async () => (await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    })).violations.map(({ id, impact, nodes }) => ({ id, impact,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })));
    for (const violation of violations) {
      const key = `${active}:${violation.id}`;
      const previous = findings.get(key) || { page: active, ...violation, nodes: [] };
      for (const node of violation.nodes)
        if (!previous.nodes.some((item) => JSON.stringify(item.target) === JSON.stringify(node.target))) previous.nodes.push(node);
      findings.set(key, previous);
    }
  }
}
try {
  for (const width of [1440, 375]) {
    for (const language of ['en', 'mk']) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      // Test the generated policy in the browser; this does not validate Nginx itself.
      await context.route('**/*', async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), ...headers } });
      });
      await context.addInitScript((locale) => {
        localStorage.setItem('lumora-language', locale);
        localStorage.setItem('lumora-cookie-preferences', JSON.stringify({ version: 1, necessary: true,
          rememberLanguage: true, savedAt: '2026-10-21T00:00:00.000Z' }));
        window.__auditCsp = [];
        document.addEventListener('securitypolicyviolation', (event) => {
          window.__auditCsp.push(`${event.violatedDirective}: ${event.blockedURI}`);
        });
        window.__auditVitals = { cls: 0, lcp: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__auditVitals.cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          window.__auditVitals.lcp = list.getEntries().at(-1)?.startTime || 0;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      }, language);
      const page = await context.newPage();
      let active = '';
      page.on('pageerror', (error) => results.consoleErrors.push({ path: active, error: error.message }));
      page.on('console', (message) => {
        if (message.type() === 'error' && !message.text().includes('404'))
          results.consoleErrors.push({ path: active, error: message.text() });
      });
      for (const pathname of paths) {
        active = `${language}/${pathname} @ ${width}`;
        await page.goto(new URL(pathname, origin).href);
        await page.waitForSelector('main h1');
        await page.evaluate(axeSource);
        await scan(page, active);
        const details = await page.evaluate(() => ({
          images: [...document.images].map((image) => ({ alt: image.getAttribute('alt'), src: image.currentSrc,
            broken: !image.complete || image.naturalWidth === 0 })),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          headings: document.querySelectorAll('h1').length,
          language: document.documentElement.lang,
          csp: window.__auditCsp,
          vitals: window.__auditVitals,
          storage: Object.keys(localStorage),
        }));
        results.pages++;
        if (details.overflow) results.overflow.push(active);
        if (details.headings !== 1 || details.language !== language) results.headings.push({ page: active, ...details });
        results.brokenImages.push(...details.images.filter((image) => image.broken).map((image) => ({ page: active, src: image.src })));
        results.cspViolations.push(...details.csp.map((error) => ({ page: active, error })));
        if (width === 1440) {
          results.informativeImages += details.images.filter((image) => image.alt?.trim()).length;
          results.decorativeImages += details.images.filter((image) => image.alt === '').length;
          results.missingAlt += details.images.filter((image) => image.alt === null).length;
          results.measurements.push({ page: active, ...details.vitals });
        }
        results.storage = [...new Set([...results.storage, ...details.storage])];
      }
      await page.goto(new URL('contact', origin).href);
      await page.waitForSelector('form');
      if (width === 375) {
        active = language + '/mobile-menu';
        await page.locator('#menu-toggle').click();
        await scan(page, active);
        await page.keyboard.press('Escape');
        results.interactiveChecks++;
      }
      active = language + '/contact-invalid @ ' + width;
      await page.locator('form button[type="submit"]').click();
      await scan(page, active);
      results.interactiveChecks++;
      await page.locator('#inquiry-name').fill('Audit Traveler');
      await page.locator('#inquiry-email').fill('audit@example.com');
      await page.locator('#inquiry-message').fill('Please provide information about this experience.');
      await page.locator('#inquiry-consent').check();
      await page.locator('form button[type="submit"]').click();
      await page.waitForSelector('#inquiry-confirmation');
      active = language + '/contact-prepared @ ' + width;
      await scan(page, active);
      results.interactiveChecks++;
      results.cookies.push(...await context.cookies());
      await context.close();
      // First visits need a fresh context, without the returning-visitor seed above.
      const noticeContext = await browser.newContext({ viewport: { width, height: 900 } });
      await noticeContext.route('**/*', async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), ...headers } });
      });
      await noticeContext.addInitScript((locale) => {
        localStorage.setItem('lumora-language', locale);
        window.__auditCsp = [];
        document.addEventListener('securitypolicyviolation', (event) => {
          window.__auditCsp.push(`${event.violatedDirective}: ${event.blockedURI}`);
        });
      }, language);
      const noticePage = await noticeContext.newPage();
      noticePage.on('pageerror', (error) => results.consoleErrors.push({ path: active, error: error.message }));
      await noticePage.goto(new URL('news', origin).href);
      await noticePage.waitForSelector('.privacy-notice');
      active = language + '/privacy-notice @ ' + width;
      await scan(noticePage, active);
      results.interactiveChecks++;
      await noticePage.locator('.privacy-notice button').nth(1).click();
      await noticePage.waitForSelector('dialog[open]');
      active = language + '/privacy-settings @ ' + width;
      await scan(noticePage, active);
      results.interactiveChecks++;
      results.cspViolations.push(...await noticePage.evaluate(() => window.__auditCsp));
      await noticePage.keyboard.press('Escape');
      await noticeContext.close();
      console.log(`Audited ${language} at ${width}px`);
    }
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  results.zoomReflow = [];
  for (const width of [720, 360, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ['en', 'mk']) {
      await page.goto(origin);
      await page.evaluate((locale) => localStorage.setItem('lumora-language', locale), language);
      for (const pathname of paths) {
        await page.goto(new URL(pathname, origin).href);
        await page.waitForSelector('main h1');
        if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
          results.zoomReflow.push(`${language}/${pathname} @ ${width}`);
      }
    }
  }
  await context.close();
  const violations = new Map();
  for (const finding of findings.values()) {
    for (const node of finding.nodes) {
      const key = `${finding.id}:${JSON.stringify(node.target)}:${node.failureSummary}`;
      const previous = violations.get(key) || { id: finding.id, impact: finding.impact, ...node, pages: [] };
      previous.pages.push(finding.page);
      violations.set(key, previous);
    }
  }
  console.log(JSON.stringify({ ...results, violations: [...violations.values()] }, null, 2));
  if (findings.size || results.brokenImages.length || results.overflow.length || results.consoleErrors.length || results.cspViolations.length || results.headings.length || results.missingAlt || results.zoomReflow.length)
    process.exitCode = 1;
} finally {
  await browser.close();
}
