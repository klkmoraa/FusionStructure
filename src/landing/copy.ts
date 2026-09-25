import type { Lang, ToolStatus } from './catalog';

interface Copy {
  nav: { products: string; families: string; brand: string; label: string };
  theme: { toNight: string; toDay: string };
  lang: { switchTo: string; label: string };
  hero: { title: string; lead: string; tools: string };
  status: Record<ToolStatus, string>;
  counts: Record<ToolStatus, string>;
  products: { eyebrow: string; title: string; open: string; brandbook: string; fstructure: string; fmodel: string };
  families: { eyebrow: string; title: string; lead: string };
  brand: { eyebrow: string; title: string; lead: string; cta: string };
  footer: { note: string; top: string };
}

export const COPY: Readonly<Record<Lang, Copy>> = {
  es: {
    nav: { products: 'Productos', families: 'Familias', brand: 'Marca', label: 'Secciones' },
    theme: { toNight: 'Cambiar a Noche', toDay: 'Cambiar a Día' },
    lang: { switchTo: 'EN', label: 'View in English' },
    hero: {
      title: 'Calcula, dibuja y lee el resultado.',
      lead: 'Herramientas de ingeniería en el navegador. Locales, sin cuenta y con su estado a la vista.',
      tools: 'herramientas por estado',
    },
    status: { available: 'Disponible', experimental: 'Experimental', planned: 'Planeado' },
    counts: { available: 'disponibles', experimental: 'experimentales', planned: 'planeadas' },
    products: {
      eyebrow: 'Productos',
      title: 'Lo que ya puedes usar',
      open: 'Abrir',
      brandbook: 'Brandbook',
      fstructure: 'Cálculo estructural: modela, resuelve y lee el resultado.',
      fmodel: 'CAD 2D preciso: capas, bloques, presentaciones, DXF y PDF.',
    },
    families: {
      eyebrow: 'Familias',
      title: 'Siete familias, un proyecto',
      lead: 'Cada herramienta lleva el color y el glifo de su familia. El estado va primero.',
    },
    brand: {
      eyebrow: 'Marca',
      title: 'Un solo canon',
      lead: 'Sistema de diseño, tokens y SVG viven en FusionStructureBrand. Los productos los copian; nadie los redeclara.',
      cta: 'Ver sistema de diseño',
    },
    footer: {
      note: 'FusionStructure está en desarrollo. No sustituye la revisión profesional ni es software certificado para obra.',
      top: 'Volver arriba',
    },
  },
  en: {
    nav: { products: 'Products', families: 'Families', brand: 'Brand', label: 'Sections' },
    theme: { toNight: 'Switch to Night', toDay: 'Switch to Day' },
    lang: { switchTo: 'ES', label: 'Ver en español' },
    hero: {
      title: 'Calculate, draw and read the result.',
      lead: 'Engineering tools in the browser. Local, no account, with their status in plain sight.',
      tools: 'tools by status',
    },
    status: { available: 'Available', experimental: 'Experimental', planned: 'Planned' },
    counts: { available: 'available', experimental: 'experimental', planned: 'planned' },
    products: {
      eyebrow: 'Products',
      title: 'What you can use today',
      open: 'Open',
      brandbook: 'Brandbook',
      fstructure: 'Structural analysis: model, solve and read the result.',
      fmodel: 'Precise 2D CAD: layers, blocks, layouts, DXF and PDF.',
    },
    families: {
      eyebrow: 'Families',
      title: 'Seven families, one project',
      lead: 'Every tool carries its family colour and glyph. Status comes first.',
    },
    brand: {
      eyebrow: 'Brand',
      title: 'One canon',
      lead: 'Design system, tokens and SVG live in FusionStructureBrand. Products copy them; nobody redeclares them.',
      cta: 'View design system',
    },
    footer: {
      note: 'FusionStructure is in development. It does not replace professional review and is not certified construction software.',
      top: 'Back to top',
    },
  },
};
