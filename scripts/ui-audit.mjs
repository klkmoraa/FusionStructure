import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_URL ?? 'http://localhost:5173';
const forbidden = new Set(['rgb(0, 125, 97)', 'rgb(22, 138, 108)', 'rgb(70, 140, 9)', 'rgb(101, 163, 35)', 'rgb(47, 115, 200)', 'rgb(216, 92, 74)', 'rgb(118, 87, 213)', 'rgb(198, 95, 134)']);
const defaultExecutable = chromium.executablePath();
const headlessShell = resolve(dirname(dirname(defaultExecutable)), '..', `chromium_headless_shell-${defaultExecutable.match(/chromium-(\d+)/)?.[1] ?? ''}`, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync(headlessShell) ? headlessShell : defaultExecutable) });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const findings = [];
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const themeFindings = await page.locator('body *').evaluateAll((nodes, inherited) => nodes.flatMap((node) => {
      const style = getComputedStyle(node);
      const values = [style.color, style.backgroundColor, style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor];
      const errors = [];
      if (values.some((value) => inherited.includes(value))) errors.push('color heredado');
      if (style.backdropFilter !== 'none') errors.push('backdrop-filter');
      if (/inset/.test(style.boxShadow)) errors.push('sombra interior');
      if (errors.length) return [`${node.tagName.toLowerCase()}.${node.className}: ${errors.join(', ')}`];
      return [];
    }), [...forbidden]);
    findings.push(...themeFindings.map((finding) => `${theme}: ${finding}`));
  }
  await page.close();
  if (findings.length) throw new Error(`ui:audit encontró ${findings.length} hallazgo(s)\n${findings.join('\n')}`);
  console.log('ui:audit: sin hallazgos');
} finally {
  await browser.close();
}
