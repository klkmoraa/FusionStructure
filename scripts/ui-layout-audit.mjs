/**
 * Auditoría de layout del canvas 2D — las correcciones P0 medidas en un
 * navegador real.
 *
 * POR QUÉ EXISTE: los cuatro defectos que corrige la fase 0 son de GEOMETRÍA, y
 * jsdom no hace layout: mide 0 en todo, así que ninguna prueba de `vitest`
 * puede ver una columna reservada de 330px, un panel tapado por el riel o un
 * número recortado dentro de su ficha. Se veían mirando la versión publicada, y
 * ésta es la forma de que se sigan viendo sin mirarla a mano.
 *
 * QUÉ NO ES: una prueba de captura. No compara imágenes —eso vuelve a fallar
 * cada vez que cambia una sombra— sino las cinco afirmaciones concretas que la
 * propuesta declara como criterio de aceptación. Cada hallazgo lleva la medida
 * que lo demuestra.
 *
 * USO: `npm run ui:layout` con el sitio servido en UI_URL (por defecto
 * `http://localhost:4173`, que es lo que levanta `vite preview`).
 */
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_URL ?? 'http://localhost:4173';

/**
 * Anchos de la lista de comprobación de la propuesta. 1280 es el ancho al que
 * la auditoría vio recortarse el Inspector, así que entra aunque no estuviera
 * en la lista.
 */
const WIDTHS = [390, 768, 1024, 1280, 1440];

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : chromium.executablePath());

const findings = [];
const report = (width, message) => findings.push(`${width}px · ${message}`);

/**
 * Traza la viga mínima —dos nudos y una barra— y la selecciona.
 *
 * El Inspector sin selección enseña el panorama del modelo: ni una fila de
 * propiedad, ni el grupo «Avanzado», ni una ficha de sección. Es decir, la
 * superficie donde se vio el recorte NO EXISTE hasta que hay algo seleccionado,
 * y una auditoría que no dibuje nada pasaría en verde sin haber mirado.
 *
 * Devuelve `false` si el modelo no llegó a construirse, para que quien llame lo
 * reporte en vez de saltarse la comprobación en silencio.
 */
const construirViga = async (page) => {
  const lienzo = await page.locator('.structural-canvas, canvas').first().boundingBox();
  if (!lienzo) return false;
  const pulsar = async (x, y) => {
    await page.mouse.move(lienzo.x + x, lienzo.y + y);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(280);
  };
  const herramienta = async (nombre) => {
    const boton = page.getByRole('button', { name: nombre }).first();
    if (!(await boton.count())) return false;
    await boton.click();
    await page.waitForTimeout(250);
    return true;
  };

  if (!await herramienta('Nodo (N)')) return false;
  await pulsar(lienzo.width * 0.3, lienzo.height * 0.55);
  await pulsar(lienzo.width * 0.65, lienzo.height * 0.55);
  if (!await herramienta('Miembro (M)')) return false;
  await pulsar(lienzo.width * 0.3, lienzo.height * 0.55);
  await pulsar(lienzo.width * 0.65, lienzo.height * 0.55);
  if (!await herramienta('Seleccionar (V)')) return false;

  // Marco de selección sobre todo el lienzo: no depende de acertar el píxel de
  // una barra cuyo encuadre se reajusta solo al crecer el modelo.
  await page.mouse.move(lienzo.x + 40, lienzo.y + 40);
  await page.mouse.down();
  await page.mouse.move(lienzo.x + lienzo.width - 40, lienzo.y + lienzo.height - 40, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  return true;
};

/** Solapamiento real de dos rectángulos, en px². 0 = no se tocan. */
const overlapArea = (a, b) => {
  const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return x > 0 && y > 0 ? Math.round(x * y) : 0;
};

const browser = await chromium.launch({ executablePath });

try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${baseUrl}/?surface=workspace2d`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.app-shell', { timeout: 15000 });
    await page.waitForTimeout(900);

    // ---------------------------------------------------------------------
    // P0-1 · La paleta no puede depender de un trozo diferido para existir.
    // Se comprueba ANTES de abrirla: si sus reglas sólo llegan con el trozo,
    // aquí todavía no hay ninguna y el modal se montaría sin hoja.
    // ---------------------------------------------------------------------
    const paletteRules = await page.evaluate(() => {
      let total = 0;
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const rule of rules) {
          if (rule.selectorText?.includes('.command-palette')) total += 1;
        }
      }
      return total;
    });
    if (paletteRules === 0) {
      report(width, 'la paleta de comandos no tiene ninguna regla cargada antes de abrirse: se montaría sin hoja');
    }

    // ---------------------------------------------------------------------
    // P0-2 · Una superficie suspendida no reserva ancho.
    // Se abre Cargas y encima Resultados —que la suspende— y se mide lo que
    // queda a la derecha del lienzo.
    // ---------------------------------------------------------------------
    // Estos dos lanzadores NO son opcionales: sin ellos no hay superficie
    // suspendida que mirar ni bandeja con la que chocar, y saltárselos en
    // silencio dejaría pasar P0-2 y P0-3 sin haberlos ejercido. Que falten es
    // en sí un hallazgo —la auditoría dejó de auditar—, no una rama más.
    const pulsar = async (nombre, criterio) => {
      const boton = page.getByRole('button', { name: nombre, exact: true }).first();
      if (!(await boton.count())) {
        report(width, `no existe el control «${nombre}»: ${criterio} se queda sin comprobar`);
        return false;
      }
      await boton.click();
      await page.waitForTimeout(450);
      return true;
    };

    const conCargas = await pulsar('Análisis y cargas', 'la columna reservada (P0-2)');
    const conResultados = await pulsar('Resultados', 'la columna reservada (P0-2) y la colisión con la navegación (P0-3)');

    const reserved = await page.evaluate(() => {
      const stage = document.querySelector('.center-stage');
      const workspace = document.querySelector('.workspace');
      if (!stage || !workspace) return null;
      const s = stage.getBoundingClientRect();
      const w = workspace.getBoundingClientRect();
      const suspended = [...document.querySelectorAll('.inspector-panel')]
        .filter((el) => el.dataset.surfaceStatus === 'suspended').length;
      const visible = [...document.querySelectorAll('.inspector-panel')]
        .filter((el) => el.dataset.surfaceStatus === 'active').length;
      // `.center-stage` lleva un margen propio de 10px en X2: ese hueco es el
      // marco del lienzo, no una columna, y no cuenta como reservado.
      const margin = parseFloat(getComputedStyle(stage).marginRight) || 0;
      return { gap: Math.round(w.right - s.right - margin), suspended, visible };
    });
    if (conCargas && conResultados) {
      if (!reserved) {
        report(width, 'no se encontró la retícula del área de trabajo: la columna reservada (P0-2) se queda sin medir');
      } else if (reserved.suspended === 0 && reserved.visible === 0) {
        report(width, 'abrir Cargas y luego Resultados no dejó ninguna superficie del Inspector suspendida: el estado que exhibe P0-2 no se llegó a montar');
      } else if (reserved.suspended > 0 && reserved.visible === 0 && reserved.gap > 2) {
        report(width, `queda una columna de ${reserved.gap}px reservada a la derecha del lienzo con el Inspector suspendido`);
      }
    }

    // ---------------------------------------------------------------------
    // P0-3 · La bandeja de Resultados no puede quedar debajo de la navegación,
    // ni siquiera con el riel desplegado.
    // ---------------------------------------------------------------------
    const consoleEl = page.locator('.console');
    const panel = page.locator('.results-panel');
    if (conResultados && !(await panel.count())) {
      report(width, 'Resultados no montó su panel: la colisión con la navegación (P0-3) se queda sin comprobar');
    }
    if (!(await consoleEl.count())) {
      report(width, 'no se encontró la navegación: la colisión con Resultados (P0-3) se queda sin comprobar');
    }
    if (await panel.count() && await consoleEl.count()) {
      await consoleEl.hover();
      await page.waitForTimeout(450);
      const collision = await page.evaluate(() => {
        const nav = document.querySelector('.console').getBoundingClientRect();
        const tray = document.querySelector('.results-panel');
        const covered = [];
        for (const el of tray.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const x = Math.min(r.right, nav.right) - Math.max(r.left, nav.left);
          const y = Math.min(r.bottom, nav.bottom) - Math.max(r.top, nav.top);
          if (x > 0 && y > 0) covered.push({ text: (el.textContent || '').trim().slice(0, 40), px: Math.round(x) });
        }
        const box = tray.getBoundingClientRect();
        const probe = document.elementFromPoint(
          Math.round(box.left + 30),
          Math.round(box.top + box.height / 2),
        );
        return {
          covered: covered.slice(0, 3),
          hijacked: Boolean(probe?.closest('.console')),
          nav: { left: nav.left, right: nav.right, top: nav.top, bottom: nav.bottom },
          tray: { left: box.left, right: box.right, top: box.top, bottom: box.bottom },
        };
      });
      const area = overlapArea(collision.nav, collision.tray);
      if (area > 0) {
        const primero = collision.covered[0];
        report(width, `la navegación desplegada cubre ${area}px² de la bandeja de Resultados${primero ? ` (p. ej. «${primero.text}», ${primero.px}px)` : ''}`);
      }
      if (collision.hijacked) {
        report(width, 'el borde izquierdo de la bandeja de Resultados responde a la navegación, no a su propio control');
      }
      await page.mouse.move(Math.round(width / 2), 450);
      await page.waitForTimeout(350);
    }

    // ---------------------------------------------------------------------
    // P0-4 · Nada del Inspector se corta: ni sus pestañas, ni sus controles,
    // ni sus encabezados, ni un valor derivado dentro de su ficha.
    // ---------------------------------------------------------------------
    // Se recarga para que las comprobaciones anteriores no dejen a Cargas
    // ocupando la ranura: con esa superficie abierta, «Mostrar inspector» la
    // CIERRA en vez de abrir el detalle, y el panel de propiedades no llegaría
    // a montarse. El modelo trazado abajo sobrevive a la recarga —se guarda en
    // este dispositivo—, la disposición de superficies no.
    await page.goto(`${baseUrl}/?surface=workspace2d`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.app-shell', { timeout: 15000 });
    await page.waitForTimeout(700);

    const trazado = await construirViga(page);
    if (!trazado) report(width, 'no se pudo trazar la viga mínima: el Inspector no llegó a enseñar propiedades');
    const abrirInspector = async () => {
      if (await page.evaluate(() => Boolean(document.querySelector('.inspector-panel[data-surface-status="active"]')))) return;
      const toggle = page.getByRole('button', { name: 'Mostrar inspector' }).first();
      if (!(await toggle.count())) {
        report(width, 'no existe el control «Mostrar inspector»: el recorte del Inspector (P0-4) se queda sin comprobar');
        return;
      }
      await toggle.click();
      await page.waitForTimeout(600);
    };
    await abrirInspector();
    const conPropiedades = await page.evaluate(() => Boolean(
      document.querySelector('.inspector-panel[data-surface-status="active"] .inspector-property-group'),
    ));
    if (trazado && !conPropiedades) {
      report(width, 'el Inspector no enseña propiedades con la viga seleccionada: la superficie del recorte no se llegó a auditar');
    }
    const clipped = await page.evaluate(() => {
      const panels = [...document.querySelectorAll('.inspector-panel')]
        .filter((el) => el.dataset.surfaceStatus === 'active' && !el.hidden);
      const out = [];
      for (const panel of panels) {
        for (const el of panel.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          // El tirador de ancho vive a caballo del borde a propósito.
          if (el.classList.contains('inspector-resize-handle')) continue;
          // Sólo para lectores de pantalla: mide 1px porque debe medirlo.
          if (el.classList.contains('sr-only')) continue;
          // Un `select` nativo mide su lista, no su caja: no es un recorte.
          if (el.tagName === 'SELECT') continue;
          if (el.clientWidth <= 0 || el.scrollWidth <= el.clientWidth + 1) continue;

          const cs = getComputedStyle(el);
          const texto = `«${(el.textContent || '').trim().slice(0, 40)}» necesita ${el.scrollWidth}px en ${el.clientWidth}px`;
          // Lo que se busca es el corte SILENCIOSO, no el acortamiento
          // deliberado. Un control que no cabe y lo dice con puntos suspensivos
          // sigue siendo legible: eso es una decisión, y este producto la toma a
          // conciencia en el panel de edición múltiple.
          //
          // Hay dos formas de cortar sin avisar, y son las dos que se vieron:
          //  · `overflow:visible` — el texto no se recorta: se PINTA fuera de su
          //    caja, encima del hueco y del control vecino;
          //  · `text-overflow:ellipsis` con el texto ajustando — la elipsis sólo
          //    se dibuja en una línea que no ajusta, así que ahí no aparece
          //    nunca y el valor se corta a secas.
          if (cs.overflowX === 'visible') {
            out.push(`${texto} y se pinta fuera de su caja (overflow visible)`);
          } else if (cs.textOverflow !== 'ellipsis' || cs.whiteSpace === 'normal') {
            out.push(`${texto} sin elipsis que lo advierta (text-overflow ${cs.textOverflow}, white-space ${cs.whiteSpace})`);
          }
        }
      }
      return out.slice(0, 5);
    });
    for (const problema of clipped) report(width, `el Inspector corta contenido: ${problema}`);

    await page.close();
  }

  // -----------------------------------------------------------------------
  // P0-5 · Una sola acción desde la portada hasta un lienzo utilizable, para
  // quien ya tiene trabajo guardado.
  // -----------------------------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Se abre primero el lienzo para que la aplicación escriba su proyecto actual
  // en `localStorage`: ese registro es la mitad de la pregunta que la decisión
  // de entrada contesta —la otra mitad es la biblioteca de IndexedDB—, y sólo
  // coincidiendo las dos es correcto saltarse la bienvenida.
  await page.goto(`${baseUrl}/?surface=workspace2d`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.app-shell', { timeout: 15000 });
  await page.waitForTimeout(900);

  /*
   * Sembrar la biblioteca REAL: base `structureCo.projects`, almacén `projects`,
   * clave `id`, y un registro cuyo id es el del proyecto abierto. Una versión
   * anterior de esta auditoría abría una base inventada y no insertaba nada, de
   * modo que la recarga veía siempre a un usuario nuevo y la rama de vuelta
   * —justo la que este P0 promete— no se ejercía jamás. Por eso se comprueba
   * abajo que la siembra ocurrió: una siembra fallida tiene que ser un hallazgo,
   * no un verde silencioso.
   */
  const sembrado = await page.evaluate(async () => {
    const crudo = localStorage.getItem('structureCo.project');
    if (!crudo) return { ok: false, motivo: 'la aplicación no dejó ningún proyecto en localStorage' };
    const proyecto = JSON.parse(crudo);
    const db = await new Promise((resolve, reject) => {
      const peticion = indexedDB.open('structureCo.projects', 1);
      peticion.onupgradeneeded = () => {
        const base = peticion.result;
        for (const almacen of ['projects', 'recoveries', 'meta']) {
          if (base.objectStoreNames.contains(almacen)) continue;
          base.createObjectStore(almacen, { keyPath: almacen === 'meta' ? 'key' : 'id' });
        }
      };
      peticion.onsuccess = () => resolve(peticion.result);
      peticion.onerror = () => reject(peticion.error);
    });
    // Del registro sólo importan aquí su `id` y que se cuente: es lo único que
    // `readWelcomeEntry` lee. El resto se rellena para que sea un registro
    // legible, no para simular una revisión real.
    await new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      tx.objectStore('projects').put({
        id: proyecto.id,
        name: proyecto.name,
        schemaVersion: proyecto.schemaVersion ?? 1,
        revision: 1,
        updatedAt: new Date().toISOString(),
        checksum: 'ui-layout-audit',
        project: proyecto,
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    const guardados = await new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const peticion = tx.objectStore('projects').getAll();
      peticion.onsuccess = () => resolve(peticion.result);
      peticion.onerror = () => reject(peticion.error);
    });
    db.close();
    return { ok: guardados.some((registro) => registro.id === proyecto.id), guardados: guardados.length, id: proyecto.id };
  }).catch((error) => ({ ok: false, motivo: String(error) }));

  if (!sembrado.ok) {
    report(1440, `no se pudo sembrar la biblioteca (${sembrado.motivo ?? 'el registro no quedó guardado'}): la entrada directa (P0-5) se queda sin comprobar`);
  }

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="platform-landing"]', { timeout: 15000 });
  await page.waitForTimeout(600);

  const cta = page.getByRole('button', { name: 'Abrir Solver 2D' });
  if (!(await cta.count())) {
    report(1440, 'no se encontró el CTA «Abrir Solver 2D» en la portada');
  } else {
    await cta.click();
    await page.waitForTimeout(1200);
    const destino = await page.evaluate(() => ({
      canvas: Boolean(document.querySelector('.app-shell.workspace-screen')),
      welcome: Boolean(document.querySelector('[data-testid="solver2d-welcome"]')),
    }));
    // Con biblioteca sembrada Y el proyecto abierto dentro de ella, la única
    // respuesta correcta es el lienzo: es exactamente lo que P0-5 promete.
    if (sembrado.ok && !destino.canvas) {
      report(1440, `el CTA «Abrir Solver 2D» no entró al proyecto guardado con la biblioteca sembrada (bienvenida: ${destino.welcome})`);
    }
    if (!destino.canvas && !destino.welcome) {
      report(1440, 'el CTA «Abrir Solver 2D» no lleva ni al lienzo ni a la bienvenida del módulo');
    }
  }

  await page.close();

  if (findings.length) {
    throw new Error(`ui:layout encontró ${findings.length} hallazgo(s)\n${findings.join('\n')}`);
  }
  console.log(`ui:layout: sin hallazgos en ${WIDTHS.join(', ')} px`);
} finally {
  await browser.close();
}
