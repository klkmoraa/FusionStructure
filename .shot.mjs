import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = process.env.UI_URL ?? 'http://127.0.0.1:5173';
const out = process.env.OUT ?? '/tmp/claude-0/-home-user-FusionStructure/6283d21d-eb25-5ade-923a-e4dcccb1d959/scratchpad/shots';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const targets = JSON.parse(process.env.TARGETS ?? '[]');
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.w, height: t.h }, isMobile: !!t.mobile, hasTouch: !!t.mobile, deviceScaleFactor: 1 });
  await page.emulateMedia({ colorScheme: t.theme ?? 'light' });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base + (t.path ?? ''), { waitUntil: 'networkidle' });
  if (t.wait) await page.waitForTimeout(t.wait);
  if (t.click) { for (const sel of [].concat(t.click)) { try { await page.click(sel, { timeout: 4000 }); await page.waitForTimeout(600); } catch (e) { console.log('click fail', sel, String(e).slice(0,120)); } } }
  if (t.wait2) await page.waitForTimeout(t.wait2);
  const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  await page.screenshot({ path: resolve(out, `${t.name}.png`), fullPage: !!t.full });
  console.log(t.name, 'overflow', JSON.stringify(overflow), errors.length ? 'ERRORS: ' + errors.slice(0,3).join(' | ') : '');
  await page.close();
}
await browser.close();
