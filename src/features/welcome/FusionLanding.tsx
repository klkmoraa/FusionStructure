import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Box,
  DraftingCompass,
  GraduationCap,
  Layers3,
  Network,
  Ruler,
  type LucideIcon,
} from 'lucide-react';
import { FusionMark } from '../../design-system/brand';
import './fusionLanding.css';

interface FusionLandingProps {
  language: 'es' | 'en';
  onOpenSolver2D: () => void;
  onOpenSolver3D?: () => void;
  onOpenClassroom?: () => void;
}

type Localized = { es: string; en: string };
type ToolState = 'available' | 'experimental' | 'planned';
type ToolTone = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink';

interface ToolDefinition {
  id: string;
  code: string;
  name: Localized;
  summary: Localized;
  state: ToolState;
  tone: ToolTone;
  image: string;
  icon: LucideIcon;
  action?: 'solver2d' | 'solver3d' | 'classroom';
}

interface StoryDefinition {
  id: string;
  index: string;
  title: Localized;
  detail: Localized;
  image: string;
  tone: ToolTone;
}

const TOOLS: readonly ToolDefinition[] = [
  {
    id: 'solver-2d',
    code: 'FS-A01',
    name: { es: 'Solver 2D', en: '2D Solver' },
    summary: { es: 'Modela, resuelve y documenta sistemas planos.', en: 'Model, solve, and document planar systems.' },
    state: 'available',
    tone: 'red',
    image: 'solver-2d.webp',
    icon: Ruler,
    action: 'solver2d',
  },
  {
    id: 'solver-3d',
    code: 'FS-A02',
    name: { es: 'Solver 3D', en: '3D Solver' },
    summary: { es: 'Explora modelos espaciales y su respuesta estructural.', en: 'Explore spatial models and their structural response.' },
    state: 'experimental',
    tone: 'red',
    image: 'solver-3d.webp',
    icon: Box,
    action: 'solver3d',
  },
  {
    id: 'finite-elements',
    code: 'FS-A03',
    name: { es: 'Elementos finitos', en: 'Finite elements' },
    summary: { es: 'Superficies, mallas y resultados verificables.', en: 'Surfaces, meshes, and verifiable results.' },
    state: 'planned',
    tone: 'red',
    image: 'finite-elements.webp',
    icon: Layers3,
  },
  {
    id: 'cad',
    code: 'FS-M01',
    name: { es: 'CAD', en: 'CAD' },
    summary: { es: 'Geometría abierta para intercambio con flujos CAD.', en: 'Open geometry for CAD exchange workflows.' },
    state: 'planned',
    tone: 'purple',
    image: 'cad.webp',
    icon: DraftingCompass,
  },
  {
    id: 'bim',
    code: 'FS-M02',
    name: { es: 'BIM', en: 'BIM' },
    summary: { es: 'Modelo coordinado, propiedades y procedencia.', en: 'Coordinated model, properties, and provenance.' },
    state: 'planned',
    tone: 'purple',
    image: 'bim.webp',
    icon: Blocks,
  },
  {
    id: 'quantities',
    code: 'FS-P02',
    name: { es: 'Cantidades y costos', en: 'Quantities and costs' },
    summary: { es: 'Puente futuro hacia presupuestos tipo Neodata.', en: 'A future bridge to Neodata-style estimating.' },
    state: 'planned',
    tone: 'yellow',
    image: 'quantities-costs.webp',
    icon: Network,
  },
  {
    id: 'classroom',
    code: 'FS-L01',
    name: { es: 'Aula estructural', en: 'Structural classroom' },
    summary: { es: 'Ejemplos y explicaciones conectados al modelo.', en: 'Examples and explanations connected to the model.' },
    state: 'available',
    tone: 'pink',
    image: 'classroom.webp',
    icon: GraduationCap,
    action: 'classroom',
  },
];

const STORY: readonly StoryDefinition[] = [
  {
    id: 'project',
    index: '01',
    title: { es: 'Contexto', en: 'Context' },
    detail: { es: 'La identidad, la ubicación y las unidades dan nombre al trabajo.', en: 'Identity, location, and units give the work a name.' },
    image: 'fusion-clay-project.png',
    tone: 'green',
  },
  {
    id: 'analysis',
    index: '02',
    title: { es: 'Modelo', en: 'Model' },
    detail: { es: 'La geometría y las hipótesis dejan una lectura que se puede revisar.', en: 'Geometry and assumptions leave a reviewable record.' },
    image: 'fusion-clay-analysis.png',
    tone: 'red',
  },
  {
    id: 'workspace',
    index: '03',
    title: { es: 'Evidencia', en: 'Evidence' },
    detail: { es: 'Los resultados conservan su procedencia mientras cambia la superficie.', en: 'Results keep their provenance as the working surface changes.' },
    image: 'fusion-clay-workspace.png',
    tone: 'purple',
  },
  {
    id: 'delivery',
    index: '04',
    title: { es: 'Entrega', en: 'Delivery' },
    detail: { es: 'La decisión sale acompañada de sus supuestos, límites y contexto.', en: 'The decision leaves with its assumptions, limits, and context.' },
    image: 'fusion-clay-delivery.png',
    tone: 'yellow',
  },
];

const copy = {
  es: {
    eyebrow: 'Make complexity legible.',
    title: 'Un proyecto que conserva la estructura.',
    body: 'Modela, analiza y conserva el contexto estructural sin convertir cada etapa en un archivo aislado.',
    explore: 'Explorar herramientas',
    flow: 'Seguir la continuidad',
    heroStatus: 'Plataforma experimental',
    heroSystem: 'Sistema Clay · 2026',
    heroCoordinate: 'Señal / contexto',
    heroSurface: 'Superficie activa',
    heroSurfaceValue: 'Proyecto común',
    toolsEyebrow: 'Herramientas',
    toolsTitle: 'La superficie cambia. El proyecto permanece.',
    toolsBody: 'Cada herramienta tiene un estado real y una relación explícita con el proyecto común.',
    activeLabel: 'Disponible ahora',
    futureLabel: 'Siguiente horizonte',
    available: 'Disponible',
    experimental: 'Experimental',
    planned: 'Planeado',
    open: 'Abrir',
    preparing: 'En preparación',
    conceptEyebrow: 'Continuidad del proyecto',
    conceptTitle: 'La información no vuelve a empezar en cada pantalla.',
    conceptBody: 'Cuatro superficies, un mismo hilo: del contexto inicial a una decisión que todavía puede explicarse después.',
    conceptLink: 'Ver el recorrido completo',
    flowEyebrow: 'Proyecto común',
    flowTitle: 'La continuidad es la herramienta principal.',
    flowBody: 'Identidad, unidades, modelo, hipótesis y resultados permanecen relacionados mientras cambia la superficie de trabajo.',
    flowSteps: ['Define el proyecto', 'Construye el modelo', 'Analiza con evidencia', 'Entrega con contexto'],
    flowCaption: 'Un proyecto común · cuatro momentos legibles',
    note: 'FusionStructure está en evolución. No sustituye revisión profesional ni constituye software certificado para obra.',
  },
  en: {
    eyebrow: 'Make complexity legible.',
    title: 'One project that keeps the structure together.',
    body: 'Model, analyse, and preserve structural context without turning every phase into an isolated file.',
    explore: 'Explore tools',
    flow: 'Follow the continuity',
    heroStatus: 'Experimental platform',
    heroSystem: 'Clay system · 2026',
    heroCoordinate: 'Signal / context',
    heroSurface: 'Active surface',
    heroSurfaceValue: 'Shared project',
    toolsEyebrow: 'Tools',
    toolsTitle: 'The surface changes. The project stays.',
    toolsBody: 'Every tool has a real status and an explicit relationship with the shared project.',
    activeLabel: 'Available now',
    futureLabel: 'Next horizon',
    available: 'Available',
    experimental: 'Experimental',
    planned: 'Planned',
    open: 'Open',
    preparing: 'In preparation',
    conceptEyebrow: 'Project continuity',
    conceptTitle: 'Information does not start over on every screen.',
    conceptBody: 'Four surfaces, one thread: from initial context to a decision that can still be explained later.',
    conceptLink: 'See the full journey',
    flowEyebrow: 'Shared project',
    flowTitle: 'Continuity is the primary tool.',
    flowBody: 'Identity, units, model, assumptions, and results stay related as the working surface changes.',
    flowSteps: ['Define the project', 'Build the model', 'Analyse with evidence', 'Deliver with context'],
    flowCaption: 'One shared project · four legible moments',
    note: 'FusionStructure is evolving. It does not replace professional review or constitute certified construction software.',
  },
} as const;

const stateLabel = (state: ToolState, language: 'es' | 'en') => copy[language][state];

export const FusionLanding = ({ language, onOpenSolver2D, onOpenSolver3D, onOpenClassroom }: FusionLandingProps) => {
  const text = copy[language];
  const primaryTools = TOOLS.slice(0, 2);
  const futureTools = TOOLS.slice(2);

  const openTool = (action: ToolDefinition['action']) => {
    if (action === 'solver2d') onOpenSolver2D();
    if (action === 'solver3d') onOpenSolver3D?.();
    if (action === 'classroom') onOpenClassroom?.();
  };

  const renderTool = (tool: ToolDefinition, featured = false) => {
    const Icon = tool.icon;
    const canOpen = Boolean(tool.action);
    const toolName = tool.name[language];

    return (
      <article className={`fs-tool-card${featured ? ' fs-tool-card--featured' : ''}`} data-tone={tool.tone} data-state={tool.state} key={tool.id}>
        <div className="fs-tool-card__media" aria-hidden="true">
          <span className="fs-tool-card__datum fs-tool-card__datum--x" />
          <span className="fs-tool-card__datum fs-tool-card__datum--y" />
          <span className="fs-tool-card__signal" />
          <img
            src={`./assets/landing/clay-tools/${tool.image}`}
            width={featured ? 720 : 560}
            height={featured ? 540 : 420}
            alt=""
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
        <div className="fs-tool-card__content">
          <div className="fs-tool-card__meta">
            <span className="fs-tool-card__code">{tool.code}</span>
            <span className="fs-tool-state" data-state={tool.state}>{stateLabel(tool.state, language)}</span>
          </div>
          <div className="fs-tool-card__title">
            <Icon size={featured ? 20 : 18} aria-hidden="true" />
            <h3>{toolName}</h3>
          </div>
          <p>{tool.summary[language]}</p>
          <button
            type="button"
            className="fs-tool-card__action"
            disabled={!canOpen}
            onClick={() => openTool(tool.action)}
            aria-label={canOpen ? `${text.open} ${toolName}` : `${toolName}: ${text.preparing}`}
          >
            {canOpen ? text.open : text.preparing}
            {canOpen ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
          </button>
        </div>
      </article>
    );
  };

  return (
    <main className="fs-landing" data-brandbook="clay-minimal">
      <nav className="fs-landing-nav" aria-label={language === 'es' ? 'Navegación de plataforma' : 'Platform navigation'}>
        <a className="fs-landing-nav__brand" href="#fusion-top" aria-label="FusionStructure">
          <span className="fs-brandmark" aria-hidden="true" data-testid="fusion-landing-mark"><FusionMark size={30} /></span>
          <span>FusionStructure</span>
        </a>
        <div className="fs-landing-nav__links">
          <a href="#fusion-tools">{text.toolsEyebrow}</a>
          <a href="#fusion-continuity">{text.conceptEyebrow}</a>
          <a href="#fusion-flow">{text.flowEyebrow}</a>
        </div>
        <span className="fs-landing-nav__state"><span aria-hidden="true" />{text.heroStatus}</span>
      </nav>

      <section className="fs-landing-hero" id="fusion-top" aria-labelledby="fusion-landing-title">
        <div className="fs-landing-hero__copy">
          <div className="fs-landing-hero__kicker">
            <span className="fs-landing-eyebrow">{text.eyebrow}</span>
            <span className="fs-landing-hero__system">{text.heroSystem}</span>
          </div>
          <h1 id="fusion-landing-title">
            {language === 'es' ? <>Un proyecto que <span>conserva</span> la estructura.</> : <>One project that <span>keeps</span> the structure together.</>}
          </h1>
          <p>{text.body}</p>
          <div className="fs-landing-hero__actions">
            <a className="fs-action fs-action--primary" href="#fusion-tools">
              {text.explore}<ArrowDown size={16} aria-hidden="true" />
            </a>
            <a className="fs-action" href="#fusion-continuity">
              {text.flow}<ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <dl className="fs-hero-facts">
            <div><dt>01</dt><dd>{text.heroCoordinate}</dd></div>
            <div><dt>02</dt><dd>{text.heroSurface}<strong>{text.heroSurfaceValue}</strong></dd></div>
          </dl>
        </div>

        <div className="fs-landing-hero__visual" data-testid="fusion-brandbook-stage" data-system="clay-minimal" aria-hidden="true">
          <div className="fs-hero-board">
            <div className="fs-hero-board__topline">
              <span><i /> FusionStructure / atlas</span>
              <code>01 — 04</code>
            </div>
            <div className="fs-hero-board__canvas">
              <span className="fs-landing-hero__datum fs-landing-hero__datum--x" />
              <span className="fs-landing-hero__datum fs-landing-hero__datum--y" />
              <svg className="fs-hero-trace" viewBox="0 0 760 620" focusable="false">
                <path className="fs-hero-trace__axis" d="M48 310H712M380 28V592" />
                <path className="fs-hero-trace__line fs-hero-trace__line--blue" d="M92 424C184 102 438 78 664 208" />
                <path className="fs-hero-trace__line fs-hero-trace__line--violet" d="M100 214C278 76 574 152 656 424" />
                <path className="fs-hero-trace__line fs-hero-trace__line--green" d="M126 482C304 512 436 466 640 292" />
                <circle className="fs-hero-trace__dot fs-hero-trace__dot--blue" cx="92" cy="424" r="7" />
                <circle className="fs-hero-trace__dot fs-hero-trace__dot--red" cx="664" cy="208" r="7" />
                <circle className="fs-hero-trace__dot fs-hero-trace__dot--violet" cx="100" cy="214" r="7" />
                <circle className="fs-hero-trace__dot fs-hero-trace__dot--green" cx="640" cy="292" r="7" />
              </svg>
              <video className="fs-hero-motion" autoPlay loop muted playsInline preload="metadata" poster="./assets/landing/clay-tools/hero-structure.webp" tabIndex={-1}>
                <source src="./assets/landing/clay-tools/hero-loop.webm" type="video/webm" />
              </video>
              <img className="fs-hero-still" src="./assets/landing/clay-tools/hero-structure.webp" width="1280" height="853" alt="" />
              <span className="fs-landing-hero__axis fs-landing-hero__axis--x">X</span>
              <span className="fs-landing-hero__axis fs-landing-hero__axis--y">Y</span>
            </div>
            <div className="fs-hero-board__rail">
              <span><b /> contexto</span>
              <span><b /> modelo</span>
              <span><b /> evidencia</span>
              <span><b /> entrega</span>
            </div>
          </div>
          <span className="fs-hero-caption fs-hero-caption--one">paper / carbon</span>
          <span className="fs-hero-caption fs-hero-caption--two">signal follows meaning</span>
        </div>
      </section>

      <section className="fs-tools" id="fusion-tools" aria-labelledby="fusion-tools-title">
        <header className="fs-section-heading">
          <span>{text.toolsEyebrow}</span>
          <div>
            <h2 id="fusion-tools-title">{text.toolsTitle}</h2>
            <p>{text.toolsBody}</p>
          </div>
        </header>

        <div className="fs-tools-subhead"><span>{text.activeLabel}</span><span>02</span></div>
        <div className="fs-tools-featured">{primaryTools.map((tool) => renderTool(tool, true))}</div>

        <div className="fs-tools-subhead fs-tools-subhead--future"><span>{text.futureLabel}</span><span>05</span></div>
        <div className="fs-tools-grid">{futureTools.map((tool) => renderTool(tool))}</div>
        <p className="fs-tools-footnote"><span aria-hidden="true" /> {language === 'es' ? 'Los estados forman parte del dato, no de la decoración.' : 'Status is part of the data, not decoration.'}</p>
      </section>

      <section className="fs-continuity" id="fusion-continuity" aria-labelledby="fusion-continuity-title" data-testid="fusion-concept-atlas">
        <div className="fs-continuity__intro">
          <span className="fs-landing-eyebrow">{text.conceptEyebrow}</span>
          <h2 id="fusion-continuity-title">{text.conceptTitle}</h2>
          <p>{text.conceptBody}</p>
          <a className="fs-action" href="#fusion-flow">{text.conceptLink}<ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="fs-continuity__sequence">
          <div className="fs-continuity__rail" aria-hidden="true"><span /><span /><span /><span /></div>
          {STORY.map((item) => (
            <article className="fs-continuity-card" data-tone={item.tone} key={item.id}>
              <div className="fs-continuity-card__head"><span>{item.index}</span><span>{item.title[language]}</span></div>
              <div className="fs-continuity-card__media"><img src={`./assets/landing/${item.image}`} width="1536" height="1024" alt="" loading="lazy" decoding="async" /></div>
              <div className="fs-continuity-card__copy"><h3>{item.title[language]}</h3><p>{item.detail[language]}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="fs-flow" id="fusion-flow" aria-labelledby="fusion-flow-title">
        <div className="fs-flow__copy">
          <span className="fs-landing-eyebrow">{text.flowEyebrow}</span>
          <h2 id="fusion-flow-title">{text.flowTitle}</h2>
          <p>{text.flowBody}</p>
          <ol className="fs-flow__steps">
            {text.flowSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="fs-flow__object" aria-hidden="true">
          <span className="fs-flow__label">{text.flowCaption}</span>
          <img src="./assets/landing/clay-tools/hero-structure.webp" width="1280" height="853" alt="" loading="lazy" />
          <span className="fs-flow__orbit fs-flow__orbit--one" />
          <span className="fs-flow__orbit fs-flow__orbit--two" />
          <span className="fs-flow__datum fs-flow__datum--x" />
          <span className="fs-flow__datum fs-flow__datum--y" />
        </div>
      </section>

      <footer className="fs-landing-footer">
        <a href="#fusion-top" aria-label={language === 'es' ? 'Volver al inicio' : 'Back to top'}>
          <span className="fs-brandmark fs-brandmark--small" aria-hidden="true"><FusionMark size={28} /></span>
          FusionStructure
        </a>
        <p>{text.note}</p>
      </footer>
    </main>
  );
};
