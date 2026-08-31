/**
 * Regenera las ilustraciones estructurales de `public/assets/structural/`.
 *
 * Los 96 PNG del repositorio venían horneados con la paleta de FusionStructure
 * —marfil cálido y menta— así que la aplicación seguía mostrando la identidad
 * anterior por mucho que la interfaz dejara de tenerla. Un PNG no se puede
 * retematizar con CSS: hay que volver a renderizarlo.
 *
 * El laboratorio de render (`/__three-assets`, sólo en desarrollo) publica
 * `window.__FUSIONSTRUCTURE_RENDER_ASSET__`. Este script lo conduce con un
 * Chromium sin cabeza y escribe cada escena en su sitio.
 *
 *   npm run assets:render            # usa http://localhost:5173
 *   npm run assets:render -- --base http://localhost:5199
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex === -1 ? 'http://localhost:5173' : args[baseIndex + 1];
const outRoot = resolve(process.cwd(), 'public/assets/structural');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';

const browser = await chromium.launch({
  executablePath,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
page.on('pageerror', (error) => console.error('pageerror:', error.message));

await page.goto(`${base}/__three-assets`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__FUSIONSTRUCTURE_RENDER_ASSET__ === 'function', null, { timeout: 60_000 });

const ids = await page.evaluate(() => [...(window.__FUSIONSTRUCTURE_THREE_ASSET_IDS__ ?? [])]);
if (ids.length === 0) throw new Error('El laboratorio no publicó ningún identificador de escena.');

let written = 0;
for (const theme of ['day', 'night']) {
  for (const id of ids) {
    const dataUrl = await page.evaluate(
      ([assetId, renderTheme]) => window.__FUSIONSTRUCTURE_RENDER_ASSET__(assetId, renderTheme),
      [id, theme],
    );
    const [family, variant] = id.split(':');
    const target = resolve(outRoot, theme, family, `${variant}.png`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(dataUrl.split(',')[1], 'base64'));
    written += 1;
  }
  console.log(`${theme}: ${ids.length} escenas`);
}

console.log(`Escritas ${written} ilustraciones en public/assets/structural/`);
await browser.close();
