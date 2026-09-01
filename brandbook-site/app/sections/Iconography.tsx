'use client';

import { Glyph, MiniDiagram } from '../brand/marks';
import { TOOLS } from '../brand/catalog';
import { SIGNALS } from '../brand/system';
import { RuleStrip, SectionIntro } from '../brand/ui';

const DRAWING_RULES = [
  {
    index: '01',
    title: 'Retícula de 48',
    body: 'Todo glifo se dibuja en 48u con 8u de aire. Las líneas caen en múltiplos de 1u.',
  },
  {
    index: '02',
    title: 'Trazo 2.6',
    body: 'Un solo grosor, extremos redondos y uniones a inglete. El peso no jerarquiza: lo hace la posición.',
  },
  {
    index: '03',
    title: 'Dos tintas',
    body: 'Color de familia para la estructura del glifo; grafito para el dato que la ocupa.',
  },
  {
    index: '04',
    title: 'Nudo visible',
    body: 'Donde dos miembros se encuentran hay un punto. El encuentro es información.',
  },
  {
    index: '05',
    title: 'Sin metáforas prestadas',
    body: 'Nada de estetoscopios, libros ni cascos: el glifo dibuja el objeto real del dominio.',
  },
  {
    index: '06',
    title: 'Prueba a 20 px',
    body: 'Si a 20 px dos glifos se confunden, se rediseña el que llegó después.',
  },
] as const;

export const Iconography = () => (
  <section id="iconografia" className="section iconography">
    <SectionIntro
      index="08"
      eyebrow="Iconografía · gramática"
      title="Dibujar como se calcula."
      body="Los veinticinco glifos usan la misma retícula, el mismo trazo y el mismo nudo. Ninguno toma prestada una metáfora de otra categoría: si la superficie mide cantidades, el glifo mide; si detalla una conexión, el glifo tiene pernos."
    />

    <ul className="glyph-grid">
      {TOOLS.map((tool) => (
        <li key={tool.id} className={`glyph-cell family--${tool.family}`}>
          <Glyph id={tool.glyph} size={38} />
          <strong>{tool.name}</strong>
          <code>{tool.code}</code>
        </li>
      ))}
    </ul>

    <div className="drawing-rules">
      {DRAWING_RULES.map((rule) => (
        <article key={rule.index}>
          <span>{rule.index}</span>
          <strong>{rule.title}</strong>
          <p>{rule.body}</p>
        </article>
      ))}
    </div>

    <div className="diagram-language">
      <div className="diagram-language__head">
        <span className="tag">Lenguaje de diagramas</span>
        <h3>El resultado se dibuja siempre igual.</h3>
        <p>
          Mismo eje, misma dirección de signo, misma relación entre trazo lleno
          y trazo fantasma. Cambiar de módulo no debe obligar a reaprender un
          diagrama.
        </p>
      </div>
      <div className="diagram-grid">
        {SIGNALS.map((signal) => (
          <figure key={signal.id} className={`signal--${signal.id}`}>
            <figcaption>
              <strong>{signal.name}</strong>
              <code>
                {signal.short} · {signal.unit}
              </code>
            </figcaption>
            <MiniDiagram type={signal.id} />
            <small>{signal.description}</small>
          </figure>
        ))}
      </div>
    </div>

    <RuleStrip index="Regla 08">
      Un glifo nuevo entra al sistema cuando se puede distinguir en tinta, a 20
      px y sin su etiqueta.
    </RuleStrip>
  </section>
);
