import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_URL ?? 'http://localhost:5173';
// Los ocho primeros son la paleta de los dos productos de origen. Los seis
// siguientes son las señales que el producto tuvo antes de adoptar el par
// Día/Noche del brandbook: un trazo invariante medido a medio camino entre
// papel y carbón, que en Día se quedaba en 2,9–3,4:1 sobre el chrome. No es que
// fueran feos, es que no estaban medidos contra ninguna superficie concreta, y
// cualquier regla nueva copiada de una hoja vieja los reintroduce.
const forbidden = new Set([
  'rgb(0, 125, 97)', 'rgb(22, 138, 108)', 'rgb(70, 140, 9)', 'rgb(101, 163, 35)',
  'rgb(47, 115, 200)', 'rgb(216, 92, 74)', 'rgb(118, 87, 213)', 'rgb(198, 95, 134)',
  'rgb(39, 149, 224)', 'rgb(27, 162, 104)', 'rgb(222, 92, 164)', 'rgb(240, 86, 76)',
  'rgb(138, 115, 245)', 'rgb(232, 178, 46)',
]);
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
      // La sombra interior dejó de ser un hallazgo: la cavidad del sistema es
      // una, y el realce de contacto de la arcilla también. Lo que sí sigue
      // prohibido es que la PROFUNDIDAD tiña — en cuanto una capa de volumen
      // tiene hue, compite con las seis señales, que son lo único que puede
      // significar color aquí.
      //
      // Lo que difumina es profundidad; lo que no, es un trazo. Un anillo de
      // selección se dibuja con `box-shadow` (`0 0 0 2px`, sin difuminado) y
      // SÍ puede llevar color de dominio: es una línea, y una línea puede
      // teñirse. Sin esta distinción la guarda marcaría el indicador de
      // familia activa, que es justamente color usado bien.
      const teñidas = [...style.boxShadow.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)[^)]*\)\s+-?[\d.]+px\s+-?[\d.]+px\s+([\d.]+)px/g)]
        .filter(([, , , , difuminado]) => Number(difuminado) > 0)
        .map(([, r, g, b]) => [Number(r), Number(g), Number(b)])
        .filter((canales) => Math.max(...canales) - Math.min(...canales) > 12);
      if (teñidas.length) errors.push(`profundidad teñida: rgb(${teñidas[0].join(', ')})`);
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
