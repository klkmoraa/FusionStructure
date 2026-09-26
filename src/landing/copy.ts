import type { Lang, ToolStatus } from './catalog';

interface Step { title: string; detail: string }

interface Copy {
  nav: { tools: string; inside: string; flow: string; label: string };
  theme: { toNight: string; toDay: string };
  lang: { switchTo: string; label: string };
  hero: { title: [string, string, string]; lead: string; tools: string; board: string; rail: [string, string, string, string] };
  status: Record<ToolStatus, string>;
  counts: Record<ToolStatus, string>;
  tools: { eyebrow: string; title: string; lead: string; now: string; more: string; next: string; open: string; soon: string };
  inside: { eyebrow: string; title: string; lead: string; fstructure: string; fmodel: string };
  story: { eyebrow: string; title: string; lead: string; steps: [Step, Step, Step, Step] };
  families: { eyebrow: string; title: string; lead: string };
  closing: { eyebrow: string; title: string; lead: string };
  footer: { note: string; top: string };
}

export const COPY: Readonly<Record<Lang, Copy>> = {
  es: {
    nav: { tools: 'Herramientas', inside: 'Por dentro', flow: 'Recorrido', label: 'Secciones' },
    theme: { toNight: 'Cambiar a Noche', toDay: 'Cambiar a Día' },
    lang: { switchTo: 'EN', label: 'View in English' },
    hero: {
      title: ['Calcula, dibuja y ', 'lee', ' el resultado.'],
      lead: 'Herramientas de ingeniería en el navegador. Sin instalar, sin cuenta y con tu trabajo guardado en tu equipo.',
      tools: 'herramientas por estado',
      board: 'Proyecto común',
      rail: ['contexto', 'modelo', 'evidencia', 'entrega'],
    },
    status: { available: 'Disponible', experimental: 'Experimental', planned: 'Planeado' },
    counts: { available: 'disponibles', experimental: 'experimentales', planned: 'planeadas' },
    tools: {
      eyebrow: 'Herramientas',
      title: 'La superficie cambia. El proyecto permanece.',
      lead: 'Cada herramienta dice su estado antes que su promesa.',
      now: 'Disponible ahora',
      more: 'También puedes probar',
      next: 'Siguiente horizonte',
      open: 'Abrir',
      soon: 'En preparación',
    },
    inside: {
      eyebrow: 'Por dentro',
      title: 'Así se ve cuando trabajas',
      lead: 'Capturas reales, en Día y Noche.',
      fstructure: 'Cuatro herramientas de cálculo en una sola app.',
      fmodel: 'CAD 2D con línea de comandos, capas y presentaciones.',
    },
    story: {
      eyebrow: 'Continuidad',
      title: 'La información no vuelve a empezar en cada pantalla.',
      lead: 'Cuatro momentos, un mismo hilo: del contexto a una decisión que se puede explicar después.',
      steps: [
        { title: 'Contexto', detail: 'Identidad, ubicación y unidades dan nombre al trabajo.' },
        { title: 'Modelo', detail: 'Geometría e hipótesis quedan escritas y se pueden revisar.' },
        { title: 'Evidencia', detail: 'Cada resultado conserva de dónde viene.' },
        { title: 'Entrega', detail: 'La decisión sale con sus supuestos y sus límites.' },
      ],
    },
    families: {
      eyebrow: 'Ecosistema',
      title: 'Siete familias, un proyecto',
      lead: 'Cada herramienta lleva el color y el glifo de su familia.',
    },
    closing: {
      eyebrow: 'Empieza',
      title: 'La continuidad es la herramienta principal.',
      lead: 'Abre una herramienta y empieza. Tu proyecto se queda en tu equipo.',
    },
    footer: {
      note: 'FusionStructure está en desarrollo. No sustituye la revisión profesional ni es software certificado para obra.',
      top: 'Volver arriba',
    },
  },
  en: {
    nav: { tools: 'Tools', inside: 'Inside', flow: 'Journey', label: 'Sections' },
    theme: { toNight: 'Switch to Night', toDay: 'Switch to Day' },
    lang: { switchTo: 'ES', label: 'Ver en español' },
    hero: {
      title: ['Calculate, draw and ', 'read', ' the result.'],
      lead: 'Engineering tools in the browser. Nothing to install, no account, your work stays on your device.',
      tools: 'tools by status',
      board: 'Shared project',
      rail: ['context', 'model', 'evidence', 'delivery'],
    },
    status: { available: 'Available', experimental: 'Experimental', planned: 'Planned' },
    counts: { available: 'available', experimental: 'experimental', planned: 'planned' },
    tools: {
      eyebrow: 'Tools',
      title: 'The surface changes. The project stays.',
      lead: 'Every tool states its status before its promise.',
      now: 'Available now',
      more: 'You can also try',
      next: 'Next horizon',
      open: 'Open',
      soon: 'In preparation',
    },
    inside: {
      eyebrow: 'Inside',
      title: 'What it looks like while you work',
      lead: 'Real screenshots, in Day and Night.',
      fstructure: 'Four analysis tools in one app.',
      fmodel: '2D CAD with a command line, layers and layouts.',
    },
    story: {
      eyebrow: 'Continuity',
      title: 'Information does not start over on every screen.',
      lead: 'Four moments, one thread: from context to a decision you can still explain later.',
      steps: [
        { title: 'Context', detail: 'Identity, location and units give the work a name.' },
        { title: 'Model', detail: 'Geometry and assumptions are written down and reviewable.' },
        { title: 'Evidence', detail: 'Every result keeps where it came from.' },
        { title: 'Delivery', detail: 'The decision leaves with its assumptions and limits.' },
      ],
    },
    families: {
      eyebrow: 'Ecosystem',
      title: 'Seven families, one project',
      lead: 'Every tool carries its family colour and glyph.',
    },
    closing: {
      eyebrow: 'Start',
      title: 'Continuity is the main tool.',
      lead: 'Open a tool and start. Your project stays on your device.',
    },
    footer: {
      note: 'FusionStructure is in development. It does not replace professional review and is not certified construction software.',
      top: 'Back to top',
    },
  },
};
