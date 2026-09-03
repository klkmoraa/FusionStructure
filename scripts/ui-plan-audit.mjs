/**
 * Auditoría de aceptación del plan del canvas 2D.
 *
 * Comprueba en un navegador real las superficies que jsdom no puede medir:
 * barra superior persistente, seis herramientas principales legibles, paleta
 * operable, bandeja de resultados en sus tres alturas y objetivos táctiles.
 *
 * USO: npm run ui:plan con el sitio servido en UI_URL.
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_URL ?? 'http://localhost:4173';
const WIDTHS = [390, 768, 1024, 1440];
const MAIN_TOOLS = ['select', 'node', 'member', 'support', 'pointLoad', 'distributedLoad'];

const defaultExecutable = chromium.executablePath();
const headlessShell = resolve(
  dirname(dirname(defaultExecutable)),
  '..',
  'chromium_headless_shell-' + (defaultExecutable.match(/chromium-(\d+)/)?.[1] ?? ''),
  'chrome-headless-shell-win64',
  'chrome-headless-shell.exe',
);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ?? (existsSync(headlessShell) ? headlessShell : defaultExecutable);
const browser = await chromium.launch({ executablePath });
const findings = [];
const report = (width, message) => findings.push(width + 'px · ' + message);
const visible = async (locator) => {
  if (!(await locator.count())) return null;
  const box = await locator.first().boundingBox();
  return box && box.width > 0 && box.height > 0 ? box : null;
};

try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: width < 800 ? 844 : 900 },
      isMobile: width < 800,
      hasTouch: width < 800,
    });
    await page.addInitScript(() => localStorage.clear());
    await page.goto(baseUrl + '/?surface=workspace2d', { waitUntil: 'networkidle' });
    await page.waitForSelector('.app-shell', { timeout: 15000 });
    await page.waitForTimeout(500);

    if (!(await visible(page.locator('[data-workspace-topbar]')))) {
      report(width, 'falta la barra superior persistente');
    }

    for (const tool of MAIN_TOOLS) {
      const button = page.locator('[data-tool-id="' + tool + '"]').first();
      const box = await visible(button);
      if (!box) report(width, 'la herramienta principal "' + tool + '" no es visible');
      else if (box.width < 40 || box.height < 40) report(width, 'la herramienta "' + tool + '" mide ' + Math.round(box.width) + '×' + Math.round(box.height) + 'px');
    }

    if (width >= 1024) {
      const labelsVisible = await page.locator('[data-tool-rail="dock"] [data-tool-id] .sc-tool-button__copy strong').evaluateAll((nodes) => nodes.filter((node) => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      }).length);
      if (labelsVisible < 6) report(width, 'menos de seis herramientas principales tienen etiqueta visible en X2');
    }

    await page.keyboard.press('Control+KeyK');
    const palette = page.locator('.command-palette');
    if (!(await visible(palette))) {
      report(width, 'Ctrl+K no abre la paleta');
    } else {
      const query = palette.locator('input[role="combobox"]');
      if (!(await visible(query))) report(width, 'la paleta no devuelve el foco a su combobox');
      if (await palette.getByRole('option').count() === 0) report(width, 'la paleta abre sin comandos');
      await query.fill('nodo');
      if (await palette.getByRole('option').count() === 0) report(width, 'la búsqueda "nodo" no devuelve comandos');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      if (await palette.count()) report(width, 'Escape no cierra la paleta');
    }

    const resultsButton = page.locator('[data-workspace-topbar] button[aria-pressed]').filter({ hasText: 'Resultados' }).first();
    if (!(await visible(resultsButton))) {
      report(width, 'falta el lanzador persistente de Resultados');
    } else {
      await resultsButton.click();
      const panel = page.locator('.results-panel[data-surface-status="active"]');
      if (!(await visible(panel))) {
        report(width, 'Resultados no se abre desde la barra superior');
      } else {
        const modes = panel.locator('.results-mode-control button');
        if (await modes.count() < 3) report(width, 'Resultados no expone sus tres alturas');
        for (let i = 0; i < Math.min(3, await modes.count()); i++) {
          await modes.nth(i).click();
          if (await modes.nth(i).getAttribute('aria-pressed') !== 'true') report(width, 'la altura ' + (i + 1) + ' no queda seleccionada');
        }
        await page.keyboard.press('Escape');
        await page.waitForTimeout(120);
        if (await panel.count() && await panel.getAttribute('data-surface-status') === 'active') report(width, 'Escape no cierra Resultados');
      }
    }

    if (width < 800) {
      const touchTargets = await page.locator('.mobile-tool-dock button').evaluateAll((nodes) => nodes.filter((node) => {
        const box = node.getBoundingClientRect();
        return box.width < 44 || box.height < 44;
      }).length);
      if (touchTargets > 0) report(width, touchTargets + ' objetivo(s) táctil(es) del riel miden menos de 44px');
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (findings.length) {
  throw new Error('ui:plan encontró ' + findings.length + ' hallazgo(s)\n' + findings.join('\n'));
}
console.log('ui:plan: sin hallazgos');
