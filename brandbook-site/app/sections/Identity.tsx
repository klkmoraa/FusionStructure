'use client';

import { useState } from 'react';
import { BrandMark, Glyph, MarkConstruction, ToolTile } from '../brand/marks';
import { FAMILY_META, TOOLS } from '../brand/catalog';
import { RuleStrip, SectionIntro, useBrandbook } from '../brand/ui';

const MISUSES = [
  {
    id: 'girar',
    label: 'No girar',
    note: 'la ménsula trabaja apoyada en su columna',
  },
  {
    id: 'estirar',
    label: 'No deformar',
    note: 'el peralte es una proporción, no un adorno',
  },
  {
    id: 'recolorear',
    label: 'No teñir',
    note: 'la marca madre no adopta color de herramienta',
  },
  {
    id: 'contorno',
    label: 'No contornear',
    note: 'el trazo hueco desaparece a 16 px',
  },
  {
    id: 'sombra',
    label: 'No dar volumen',
    note: 'la profundidad vive en la superficie, no en la marca',
  },
  {
    id: 'ruido',
    label: 'No sobre imagen',
    note: 'sin contraste no hay lectura',
  },
] as const;

const LOCKUPS = [
  {
    id: 'horizontal',
    label: 'Horizontal',
    use: 'barra de aplicación, encabezado, firma',
  },
  {
    id: 'apilado',
    label: 'Apilado',
    use: 'portada de memoria, tarjeta social',
  },
  { id: 'compacto', label: 'Compacto', use: 'móvil, favicon, avatar' },
] as const;

export const Identity = () => {
  const { theme } = useBrandbook();
  const [lockup, setLockup] =
    useState<(typeof LOCKUPS)[number]['id']>('horizontal');
  const familyPreview = TOOLS.filter((tool) =>
    [
      'fs-a01',
      'fs-a02',
      'fs-m01',
      'fs-m02',
      'fs-p02',
      'fs-p03',
      'fs-i01',
      'fs-l01',
    ].includes(tool.id),
  );

  return (
    <section id="identidad" className="section identity">
      <SectionIntro
        index="02"
        eyebrow="Identidad · la ménsula"
        title="Una marca que se sostiene sola."
        body="Un miembro vertical y dos voladizos cuyo peralte decrece hacia la punta: la misma forma que toma una sección cuando se dimensiona por el momento que recibe. La marca no ilustra una estructura, está construida como una."
        aside={
          <figure className="identity__hero-mark">
            <BrandMark size={140} title="Marca de FusionStructure" />
            <figcaption>
              <strong>Ménsula</strong>
              <span>marca madre · 2026</span>
            </figcaption>
          </figure>
        }
      />

      <div className="identity__grid">
        <article className="panel identity__construction">
          <div className="panel__label">
            <span>Construcción</span>
            <code>retícula 48u</code>
          </div>
          <MarkConstruction />
          <p>
            Columna de 9u, voladizo superior de 24u y voladizo medio de 17u. El
            peralte pasa de 9u en el arranque a 5u en la punta. Ninguna curva:
            lo que sostiene es recto y lo que responde es el ángulo.
          </p>
        </article>

        <article className="panel identity__sizes">
          <div className="panel__label">
            <span>Tamaños mínimos</span>
            <code>px</code>
          </div>
          <div className="identity__size-row">
            {[96, 48, 32, 24, 16].map((size) => (
              <div key={size} className="identity__size">
                <BrandMark size={size} />
                <small>{size}</small>
              </div>
            ))}
          </div>
          <p>
            A 16 px el brazo de señal sigue siendo legible porque nunca baja de
            1 px real. Por debajo de 16 px se usa el icono de aplicación, no la
            marca suelta.
          </p>
        </article>

        <article className="panel identity__clearspace">
          <div className="panel__label">
            <span>Espacio libre</span>
            <code>1 columna = 9u</code>
          </div>
          <div className="clearspace">
            <span className="clearspace__pad" aria-hidden="true" />
            <BrandMark size={64} />
          </div>
          <p>
            Alrededor de la marca se reserva el ancho de su propia columna. Ese
            aire es parte de la marca: sin él, la ménsula parece apoyada en otra
            cosa.
          </p>
        </article>

        <article className="panel identity__variants">
          <div className="panel__label">
            <span>Variantes</span>
            <code>4</code>
          </div>
          <div className="identity__variant-grid">
            <div className="variant variant--signal">
              <BrandMark size={44} tone="signal" />
              <strong>Señal</strong>
              <small>uso general</small>
            </div>
            <div className="variant variant--mono">
              <BrandMark size={44} tone="mono" />
              <strong>Mono</strong>
              <small>documento e impresión</small>
            </div>
            <div className="variant variant--inverse">
              <BrandMark size={44} tone="inverse" />
              <strong>Inversa</strong>
              <small>fondo oscuro</small>
            </div>
            <div className="variant variant--icon">
              <span className="app-icon">
                <BrandMark size={30} tone="inverse" />
              </span>
              <strong>Icono</strong>
              <small>aplicación y favicon</small>
            </div>
          </div>
        </article>
      </div>

      <div className="lockups">
        <div className="lockups__head">
          <div>
            <span className="tag">Lockups</span>
            <h3>La firma cambia de forma, no de jerarquía.</h3>
          </div>
          <div
            className="segmented"
            role="tablist"
            aria-label="Variantes de firma"
          >
            {LOCKUPS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={lockup === item.id}
                className={lockup === item.id ? 'is-active' : ''}
                onClick={() => setLockup(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className={`lockup-stage lockup-stage--${lockup}`}>
          <div className="lockup">
            <BrandMark size={lockup === 'compacto' ? 34 : 52} />
            <span className="lockup__text">
              <strong>FusionStructure</strong>
              {lockup === 'compacto' ? null : (
                <small>Make complexity legible.</small>
              )}
            </span>
          </div>
          <p className="lockup-stage__note">
            {LOCKUPS.find((item) => item.id === lockup)?.use}
          </p>
        </div>
      </div>

      <div className="misuse">
        <div className="misuse__head">
          <span className="tag">Lo que rompe la marca</span>
          <p>
            Seis usos que la vuelven ilegible o le hacen prometer algo que no
            es.
          </p>
        </div>
        <ul className="misuse__grid">
          {MISUSES.map((item) => (
            <li
              key={item.id}
              className={`misuse__item misuse__item--${item.id}`}
            >
              <span className="misuse__frame">
                <BrandMark
                  size={40}
                  tone={theme === 'noche' ? 'inverse' : 'signal'}
                />
              </span>
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </li>
          ))}
        </ul>
      </div>

      <RuleStrip index="Regla 02">
        El glifo identifica, el color agrupa y el nombre confirma. Si quitar el
        color deja dos herramientas iguales, el glifo está mal dibujado.
      </RuleStrip>

      <div className="family">
        <div className="family__head">
          <div>
            <span className="tag">Marca respaldada</span>
            <h3>Una madre neutra. Siete familias reconocibles.</h3>
            <p>
              Cada superficie hereda la retícula, el trazo y el nudo de la
              ménsula. Lo que cambia es el glifo funcional y el tono de familia;
              el estado real lo sigue definiendo el código.
            </p>
          </div>
          <ul className="family__legend">
            {Object.entries(FAMILY_META).map(([id, meta]) => (
              <li key={id} className={`family__legend-item family--${id}`}>
                <span className="family__swatch" aria-hidden="true" />
                <strong>{meta.label}</strong>
                <code>{meta.prefix}</code>
              </li>
            ))}
          </ul>
        </div>
        <div className="family__preview">
          {familyPreview.map((tool) => (
            <figure key={tool.id}>
              <ToolTile glyph={tool.glyph} family={tool.family} size={56} />
              <figcaption>
                <strong>{tool.name}</strong>
                <code>{tool.code}</code>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="family__mono">
          <span className="tag">Sin color</span>
          <div className="family__mono-row">
            {familyPreview.map((tool) => (
              <Glyph
                key={tool.id}
                id={tool.glyph}
                size={30}
                className="glyph--mono"
              />
            ))}
          </div>
          <p>La misma fila en tinta: el glifo debe bastar.</p>
        </div>
      </div>
    </section>
  );
};
