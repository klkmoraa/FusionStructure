import { ArrowUp, ArrowUpRight, Moon, Sun } from 'lucide-react';
import type { CSSProperties } from 'react';
import { PRODUCT_LINKS, type ProductId } from '../foundation/productLinks';
import {
  FAMILIES, SHOWCASE, TOOLS, countByStatus,
  type Family, type FamilyId, type Lang, type Showcase, type Tool, type ToolStatus,
} from './catalog';
import { COPY } from './copy';
import { useLang, useTheme } from './preferences';
import './landing.css';

const BODY = 'M8 5h9v38H8z M17 5h24v5.5L17 14z';
const ARM = 'M17 21h17v5L17 30z';
const familyColor = (id: FamilyId) => `var(--fs-family-${id})`;
const toolByCode = new Map(TOOLS.map((tool) => [tool.code, tool]));
const STORY = [['project', 'nucleo'], ['analysis', 'analisis'], ['workspace', 'modelo'], ['delivery', 'proyecto']] as const;
/** WebKit (Safari e iOS) sólo respeta el alfa en HEVC; Chrome y Firefox, en WebM VP9. */
const isWebKit = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua));
};

const INSIDE = [['fstructure', 'FStructure', 'analisis'], ['fmodel', 'FModel', 'modelo']] as const;

/** La ménsula: el cuerpo en tinta; sólo la franja lleva color. */
const Mark = ({ size, arm = 'var(--fs-brand-accent)' }: { size: number; arm?: string }) => (
  <svg className="fs-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path d={BODY} fill="var(--fs-ink)" />
    <path d={ARM} fill={arm} />
  </svg>
);

const Glyph = ({ id, size }: { id: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <use href={`./brand/glyphs.svg#fs-${id}`} />
  </svg>
);

/** Tile de herramienta: familia al 8 % de fondo y 34 % de borde, glifo al 62 %. */
const Tile = ({ family, glyph, size }: { family: FamilyId; glyph: string; size: number }) => (
  <span className="fs-tile" style={{ '--tile-color': familyColor(family), '--tile-size': `${size}px` } as CSSProperties}>
    <Glyph id={glyph} size={Math.round(size * 0.62)} />
  </span>
);

const FamilyLogo = ({ family }: { family: Family }) => (
  <span className="fs-family-logo" style={{ '--tile-color': familyColor(family.id) } as CSSProperties}>
    {family.glyph ? <Glyph id={family.glyph} size={36} /> : <Mark size={36} />}
  </span>
);

const Status = ({ status, lang }: { status: ToolStatus; lang: Lang }) => (
  <span className="fs-status" data-status={status}><span aria-hidden="true" />{COPY[lang].status[status]}</span>
);

const Capture = ({ product }: { product: ProductId }) => (
  <span className="fs-capture">
    {(['dia', 'noche'] as const).map((theme) => (
      <img key={theme} className={`fs-capture__img fs-capture__img--${theme}`} src={`./captures/${product}-${theme}.png`}
        width={1440} height={900} alt="" loading="lazy" decoding="async" />
    ))}
  </span>
);

const Actions = ({ lang }: { lang: Lang }) => (
  <div className="fs-actions">
    <a className="fs-button fs-button--primary" href={PRODUCT_LINKS.fstructure}>
      {COPY[lang].tools.open} FStructure<ArrowUpRight size={16} aria-hidden="true" />
    </a>
    <a className="fs-button" href={PRODUCT_LINKS.fmodel}>
      {COPY[lang].tools.open} FModel<ArrowUpRight size={16} aria-hidden="true" />
    </a>
  </div>
);

/** Tarjeta clay: la imagen sobre la rejilla técnica, el estado primero y una sola acción. */
const ToolCard = ({ item, lang, featured = false }: { item: Showcase; lang: Lang; featured?: boolean }) => {
  const tool = toolByCode.get(item.code) as Tool;
  const text = COPY[lang].tools;
  const name = tool.name[lang];
  const href = item.product && tool.status !== 'planned' ? PRODUCT_LINKS[item.product] : null;
  return (
    <article className={`fs-tool-card${featured ? ' fs-tool-card--featured' : ''}`} data-status={tool.status}
      style={{ '--card-color': familyColor(tool.family) } as CSSProperties}>
      <div className="fs-tool-card__media" aria-hidden="true">
        <span className="fs-datum fs-datum--x" />
        <span className="fs-datum fs-datum--y" />
        {item.image
          ? <img src={`./clay/tools/${item.image}.webp`} width={featured ? 720 : 560} height={featured ? 540 : 420} alt=""
              loading={featured ? 'eager' : 'lazy'} decoding="async" />
          : <Tile family={tool.family} glyph={tool.glyph} size={featured ? 120 : 96} />}
      </div>
      <div className="fs-tool-card__body">
        <div className="fs-tool-card__meta">
          <span className="fs-code">{tool.code}</span>
          <Status status={tool.status} lang={lang} />
        </div>
        <h3><Tile family={tool.family} glyph={tool.glyph} size={featured ? 30 : 26} />{name}</h3>
        <p>{item.summary[lang]}</p>
        {href
          ? <a className={`fs-button${featured ? ' fs-button--primary' : ''}`} href={href}>{text.open} {name}<ArrowUpRight size={16} aria-hidden="true" /></a>
          : <span className="fs-button fs-button--idle" aria-disabled="true">{text.soon}</span>}
      </div>
    </article>
  );
};

const Subhead = ({ label, count }: { label: string; count: number }) => (
  <div className="fs-subhead"><span>{label}</span><span>{String(count).padStart(2, '0')}</span></div>
);

export const Landing = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const text = COPY[lang];
  const counts = countByStatus();
  const featured = SHOWCASE.slice(0, 2);
  const more = SHOWCASE.slice(2, 6);
  const next = SHOWCASE.slice(6);
  const themeLabel = theme === 'noche' ? text.theme.toDay : text.theme.toNight;

  return (
    <>
      <header className="fs-nav">
        <a className="fs-nav__brand" href="#top"><Mark size={28} /><span>FusionStructure</span></a>
        <nav className="fs-nav__links" aria-label={text.nav.label}>
          <a href="#herramientas">{text.nav.tools}</a>
          <a href="#por-dentro">{text.nav.inside}</a>
          <a href="#recorrido">{text.nav.flow}</a>
        </nav>
        <div className="fs-nav__tools">
          <button type="button" className="fs-icon-button" onClick={toggleLang} aria-label={text.lang.label} title={text.lang.label}>
            {text.lang.switchTo}
          </button>
          <button type="button" className="fs-icon-button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === 'noche' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="fs-hero" aria-labelledby="fs-hero-title">
          <div className="fs-hero__copy">
            <span className="fs-eyebrow">Make complexity legible.</span>
            <h1 id="fs-hero-title">{text.hero.title[0]}<em>{text.hero.title[1]}</em>{text.hero.title[2]}</h1>
            <p>{text.hero.lead}</p>
            <Actions lang={lang} />
            <ul className="fs-hero__counts" aria-label={`${TOOLS.length} ${text.hero.tools}`}>
              {(Object.keys(counts) as ToolStatus[]).map((status) => (
                <li key={status} data-status={status}><strong>{counts[status]}</strong> {text.counts[status]}</li>
              ))}
            </ul>
          </div>

          <div className="fs-board" aria-hidden="true">
            <div className="fs-board__topline"><span><i /> FusionStructure · {text.hero.board}</span><code>01 — 04</code></div>
            <div className="fs-board__canvas">
              <span className="fs-datum fs-datum--x" />
              <span className="fs-datum fs-datum--y" />
              <svg className="fs-trace" viewBox="0 0 760 620" focusable="false">
                <path className="fs-trace__line fs-trace__line--axial" d="M92 424C184 102 438 78 664 208" />
                <path className="fs-trace__line fs-trace__line--deformed" d="M100 214C278 76 574 152 656 424" />
                <path className="fs-trace__line fs-trace__line--shear" d="M126 482C304 512 436 466 640 292" />
                <circle className="fs-trace__dot fs-trace__dot--axial" cx="92" cy="424" r="7" />
                <circle className="fs-trace__dot fs-trace__dot--moment" cx="664" cy="208" r="7" />
                <circle className="fs-trace__dot fs-trace__dot--deformed" cx="100" cy="214" r="7" />
                <circle className="fs-trace__dot fs-trace__dot--shear" cx="640" cy="292" r="7" />
              </svg>
              <video className="fs-board__motion" autoPlay loop muted playsInline preload="metadata" poster="./clay/hero-structure.webp" tabIndex={-1}>
                {isWebKit()
                  ? <source src="./clay/hero-loop.mov" type='video/quicktime; codecs="hvc1"' />
                  : <source src="./clay/hero-loop.webm" type="video/webm" />}
              </video>
              <img className="fs-board__still" src="./clay/hero-structure.webp" width={1280} height={853} alt="" />
              <span className="fs-axis fs-axis--x">X</span>
              <span className="fs-axis fs-axis--y">Y</span>
            </div>
            <div className="fs-board__rail">{text.hero.rail.map((label) => <span key={label}><b /> {label}</span>)}</div>
          </div>
        </section>

        <section className="fs-section" id="herramientas" aria-labelledby="fs-tools-title">
          <header className="fs-section__head">
            <span className="fs-eyebrow">{text.tools.eyebrow}</span>
            <h2 id="fs-tools-title">{text.tools.title}</h2>
            <p>{text.tools.lead}</p>
          </header>
          <Subhead label={text.tools.now} count={featured.length} />
          <div className="fs-tools fs-tools--featured">{featured.map((item) => <ToolCard key={item.code} item={item} lang={lang} featured />)}</div>
          <Subhead label={text.tools.more} count={more.length} />
          <div className="fs-tools">{more.map((item) => <ToolCard key={item.code} item={item} lang={lang} />)}</div>
          <Subhead label={text.tools.next} count={next.length} />
          <div className="fs-tools fs-tools--next">{next.map((item) => <ToolCard key={item.code} item={item} lang={lang} />)}</div>
        </section>

        <section className="fs-section" id="por-dentro" aria-labelledby="fs-inside-title">
          <header className="fs-section__head">
            <span className="fs-eyebrow">{text.inside.eyebrow}</span>
            <h2 id="fs-inside-title">{text.inside.title}</h2>
            <p>{text.inside.lead}</p>
          </header>
          <div className="fs-inside">
            {INSIDE.map(([id, name, family]) => (
              <a className="fs-shot" key={id} href={PRODUCT_LINKS[id]} aria-label={`${text.tools.open} ${name}`}>
                <Capture product={id} />
                <span className="fs-shot__caption">
                  <Mark size={30} arm={familyColor(family)} />
                  <span><strong>{name}</strong>{text.inside[id]}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="fs-section fs-story" id="recorrido" aria-labelledby="fs-story-title">
          <header className="fs-section__head fs-story__head">
            <span className="fs-eyebrow">{text.story.eyebrow}</span>
            <h2 id="fs-story-title">{text.story.title}</h2>
            <p>{text.story.lead}</p>
          </header>
          <div className="fs-story__grid">
            {text.story.steps.map((step, index) => (
              <article className="fs-story-card" key={STORY[index][0]} style={{ '--card-color': familyColor(STORY[index][1]) } as CSSProperties}>
                <div className="fs-story-card__head"><span>0{index + 1}</span><span>{step.title}</span></div>
                <div className="fs-story-card__media">
                  <img src={`./clay/story/${STORY[index][0]}.png`} width={960} height={640} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="fs-story-card__copy"><h3>{step.title}</h3><p>{step.detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="fs-section" id="familias" aria-labelledby="fs-families-title">
          <header className="fs-section__head">
            <span className="fs-eyebrow">{text.families.eyebrow}</span>
            <h2 id="fs-families-title">{text.families.title}</h2>
            <p>{text.families.lead}</p>
          </header>
          <div className="fs-families">
            {FAMILIES.map((family) => (
              <article className="fs-family" key={family.id} aria-labelledby={`fs-family-${family.id}`}>
                <div className="fs-family__head">
                  <FamilyLogo family={family} />
                  <div>
                    <h3 id={`fs-family-${family.id}`}>{family.name[lang]}</h3>
                    <span className="fs-code">{family.prefix}</span>
                  </div>
                </div>
                <p>{family.purpose[lang]}</p>
                <ul className="fs-tool-list">
                  {TOOLS.filter((tool) => tool.family === family.id).map((tool) => (
                    <li key={`${tool.code}-${tool.glyph}`} data-status={tool.status}>
                      <Tile family={tool.family} glyph={tool.glyph} size={28} />
                      <span className="fs-tool-list__name">{tool.name[lang]}</span>
                      <Status status={tool.status} lang={lang} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="fs-closing" aria-labelledby="fs-closing-title">
          <div className="fs-closing__copy">
            <span className="fs-eyebrow">{text.closing.eyebrow}</span>
            <h2 id="fs-closing-title">{text.closing.title}</h2>
            <p>{text.closing.lead}</p>
            <Actions lang={lang} />
          </div>
          <div className="fs-closing__object" aria-hidden="true">
            <span className="fs-orbit fs-orbit--one" />
            <span className="fs-orbit fs-orbit--two" />
            <img src="./clay/hero-structure.webp" width={1280} height={853} alt="" loading="lazy" />
          </div>
        </section>
      </main>

      <footer className="fs-footer">
        <a className="fs-nav__brand" href="#top"><Mark size={24} /><span>FusionStructure</span></a>
        <p>{text.footer.note}</p>
        <a className="fs-footer__top" href="#top">{text.footer.top}<ArrowUp size={14} aria-hidden="true" /></a>
      </footer>
    </>
  );
};
