import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_URL ?? 'http://localhost:5173';
const output = resolve('output/ui-shots');
const sizes = [
  ['x2', 1440, 900],
  ['m1', 1100, 820],
  ['k0-tablet', 900, 900],
  ['k0-phone', 390, 844],
];

await mkdir(output, { recursive: true });
const defaultExecutable = chromium.executablePath();
const headlessShell = resolve(dirname(dirname(defaultExecutable)), '..', `chromium_headless_shell-${defaultExecutable.match(/chromium-(\d+)/)?.[1] ?? ''}`, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync(headlessShell) ? headlessShell : defaultExecutable),
});

try {
  for (const [name, width, height] of sizes) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: name === 'k0-phone', hasTouch: name === 'k0-phone' });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.screenshot({ path: resolve(output, `${name}-${theme}.png`), fullPage: true });
      await page.close();
    }
  }
  console.log(`8 capturas escritas en ${output}`);
} finally {
  await browser.close();
}
