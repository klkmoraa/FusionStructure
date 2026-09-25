import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import type { CSSProperties } from 'react';
import { BRAND_CANON_LINK, BRANDBOOK_LINKS, PRODUCT_LINKS, type ProductId } from '../foundation/productLinks';
import { FAMILIES, TOOLS, countByStatus, type Family, type FamilyId, type Lang, type Localized, type ToolStatus } from './catalog';
import { COPY } from './copy';
import { useLang, useTheme } from './preferences';
import './landing.css';

const BODY = 'M8 5h9v38H8z M17 5h24v5.5L17 14z';
const ARM = 'M17 21h17v5L17 30z';
const familyColor = (id: FamilyId) => `var(--fs-family-${id})`;

/** La ménsula: el cuerpo en tinta; sólo la franja lleva color. */
const Mark = ({ size, arm = 'var(--fs-brand-accent)', label }: { size: number; arm?: string; label?: string }) => (
  <svg className="fs-mark" width={size} height={size} viewBox="0 0 48 48" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
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

interface Product {
  id: ProductId;
  name: string;
  family: FamilyId;
  kicker: Localized;
  codes: readonly string[];
}

const PRODUCTS: readonly Product[] = [
  { id: 'fstructure', name: 'FStructure', family: 'analisis', kicker: { es: 'Análisis · FS-A01–A04', en: 'Analysis · FS-A01–A04' }, codes: ['FS-A01', 'FS-A02', 'FS-A03', 'FS-A04'] },
  { id: 'fmodel', name: 'FModel', family: 'modelo', kicker: { es: 'Modelo · FS-M01', en: 'Model · FS-M01' }, codes: ['FS-M01'] },
];

const Capture = ({ product, eager = false }: { product: ProductId; eager?: boolean }) => (
  <span className="fs-capture">
    {(['dia', 'noche'] as const).map((theme) => (
      <img
        key={theme}
        className={`fs-capture__img fs-capture__img--${theme}`}
        src={`./captures/${product}-${theme}.png`}
        width={1440}
        height={900}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    ))}
  </span>
);

export const Landing = () => {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const text = COPY[lang];
  const counts = countByStatus();

  return (
    <>
      <header className="fs-nav">
        <a className="fs-nav__brand" href="#top">
          <Mark size={28} />
          <span>FusionStructure</span>
        </a>
        <nav className="fs-nav__links" aria-label={text.nav.label}>
          <a href="#productos">{text.nav.products}</a>
          <a href="#familias">{text.nav.families}</a>
          <a href="#marca">{text.nav.brand}</a>
        </nav>
        <div className="fs-nav__tools">
          <button type="button" className="fs-icon-button" onClick={toggleLang} aria-label={text.lang.label} title={text.lang.label}>
            {text.lang.switchTo}
          </button>
          <button
            type="button"
            className="fs-icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'noche' ? text.theme.toDay : text.theme.toNight}
            title={theme === 'noche' ? text.theme.toDay : text.theme.toNight}
          >
            {theme === 'noche' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="fs-hero" aria-labelledby="fs-hero-title">
          <div className="fs-hero__copy">
            <span className="fs-eyebrow">Make complexity legible.</span>
            <h1 id="fs-hero-title">{text.hero.title}</h1>
            <p>{text.hero.lead}</p>
            <div className="fs-hero__actions">
              <a className="fs-button fs-button--primary" href={PRODUCT_LINKS.fstructure}>
                {text.products.open} FStructure<ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a className="fs-button" href={PRODUCT_LINKS.fmodel}>
                {text.products.open} FModel<ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <ul className="fs-hero__counts" aria-label={`${TOOLS.length} ${text.hero.tools}`}>
              {(Object.keys(counts) as ToolStatus[]).map((status) => (
                <li key={status} data-status={status}><strong>{counts[status]}</strong> {text.counts[status]}</li>
              ))}
            </ul>
          </div>
          <div className="fs-hero__visual" aria-hidden="true">
            <span className="fs-hero__shot fs-hero__shot--main"><Capture product="fstructure" eager /></span>
            <span className="fs-hero__shot fs-hero__shot--side"><Capture product="fmodel" eager /></span>
          </div>
        </section>

        <section className="fs-section" id="productos" aria-labelledby="fs-products-title">
          <header className="fs-section__head">
            <span className="fs-eyebrow">{text.products.eyebrow}</span>
            <h2 id="fs-products-title">{text.products.title}</h2>
          </header>
          <div className="fs-products">
            {PRODUCTS.map((product) => (
              <article className="fs-product" key={product.id} style={{ '--product-color': familyColor(product.family) } as CSSProperties}>
                <Capture product={product.id} />
                <div className="fs-product__body">
                  <div className="fs-product__title">
                    <Mark size={40} arm={familyColor(product.family)} />
                    <div>
                      <h3>{product.name}</h3>
                      <span className="fs-code">{product.kicker[lang]}</span>
                    </div>
                  </div>
                  <p>{text.products[product.id]}</p>
                  <ul className="fs-tool-list">
                    {TOOLS.filter((tool) => product.codes.includes(tool.code)).map((tool) => (
                      <li key={tool.code}>
                        <Tile family={tool.family} glyph={tool.glyph} size={32} />
                        <span className="fs-tool-list__name">{tool.name[lang]}<span className="fs-code">{tool.code}</span></span>
                        <Status status={tool.status} lang={lang} />
                      </li>
                    ))}
                  </ul>
                  <div className="fs-product__actions">
                    <a className="fs-button fs-button--primary" href={PRODUCT_LINKS[product.id]}>
                      {text.products.open} {product.name}<ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                    <a className="fs-button fs-button--ghost" href={BRANDBOOK_LINKS[product.id]}>
                      {text.products.brandbook}<ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
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
                <ul className="fs-tool-list fs-tool-list--compact">
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

        <section className="fs-section fs-canon" id="marca" aria-labelledby="fs-brand-title">
          <Mark size={120} label="FusionStructure" />
          <div className="fs-canon__copy">
            <span className="fs-eyebrow">{text.brand.eyebrow}</span>
            <h2 id="fs-brand-title">{text.brand.title}</h2>
            <p>{text.brand.lead}</p>
            <a className="fs-button" href={BRAND_CANON_LINK}>
              {text.brand.cta}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="fs-footer">
        <a className="fs-nav__brand" href="#top" aria-label={text.footer.top}>
          <Mark size={24} />
          <span>FusionStructure</span>
        </a>
        <p>{text.footer.note}</p>
      </footer>
    </>
  );
};
