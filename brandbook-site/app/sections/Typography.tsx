'use client';

import { useState } from 'react';
import { NUMBER_RULES, TYPE_SCALE } from '../brand/system';
import { CopyChip, RuleStrip, SectionIntro } from '../brand/ui';

const WEIGHTS = [400, 500, 600, 700] as const;

export const Typography = () => {
  const [weight, setWeight] = useState<number>(600);

  return (
    <section id="tipografia" className="section typography">
      <SectionIntro
        index="05"
        eyebrow="Tipografía · dos voces"
        title="La jerarquía se entiende antes de leerse."
        body="Una sans geométrica para orientar y actuar; una monoespaciada para todo lo que se compara: unidades, coordenadas, versiones, hashes y procedencia. Si un dato se puede alinear en columna, va en mono."
      />

      <div className="type-lab">
        <div className="type-canvas">
          <span className="type-canvas__label">Space Grotesk · display</span>
          <p className="type-display" style={{ fontWeight: weight }}>
            One clear
            <br />
            <em>next step.</em>
          </p>
          <div className="type-canvas__foot">
            <span>La claridad puede tener carácter.</span>
            <code>wght {weight}</code>
          </div>
        </div>

        <div className="panel type-panel">
          <div className="panel__label">
            <span>Peso</span>
            <code>400—700</code>
          </div>
          <fieldset className="segmented segmented--tight">
            <legend className="visually-hidden">Peso tipográfico</legend>
            {WEIGHTS.map((value) => (
              <button
                key={value}
                type="button"
                className={weight === value ? 'is-active' : ''}
                onClick={() => setWeight(value)}
              >
                {value}
              </button>
            ))}
          </fieldset>
          <ul className="type-stack">
            <li>
              <strong>Display · Space Grotesk</strong>
              <small>títulos, marca y una idea por pantalla</small>
            </li>
            <li>
              <strong>Interfaz · Inter</strong>
              <small>controles, listas y lectura larga</small>
            </li>
            <li>
              <strong>Dato · IBM Plex Mono</strong>
              <small>unidad, versión, coordenada y token</small>
            </li>
          </ul>
          <p className="type-panel__note">
            Las tres respaldan con la pila del sistema. Si la fuente no carga,
            la jerarquía sigue en pie porque vive en el tamaño y el espacio.
          </p>
        </div>
      </div>

      <div className="type-scale">
        {TYPE_SCALE.map((step) => (
          <article key={step.role}>
            <span>{step.role}</span>
            <strong>{step.size}</strong>
            <code>línea {step.line}</code>
            <small>{step.use}</small>
          </article>
        ))}
      </div>

      <div className="numbers">
        <div className="numbers__head">
          <span className="tag">Números</span>
          <h3>Un dato mal escrito es un dato equivocado.</h3>
          <p>
            La tipografía de datos usa cifras tabulares para que las columnas se
            puedan comparar sin leer cada renglón.
          </p>
        </div>
        <ul className="numbers__list">
          {NUMBER_RULES.map((rule) => (
            <li key={rule.rule}>
              <strong>{rule.rule}</strong>
              <span className="numbers__good">
                <code>{rule.good}</code> así
              </span>
              <span className="numbers__bad">
                <code>{rule.bad}</code> así no
              </span>
            </li>
          ))}
        </ul>
        <div className="numbers__tokens">
          <CopyChip value="font-variant-numeric: tabular-nums" />
          <CopyChip value="--fs-font-data" />
        </div>
      </div>

      <RuleStrip index="Regla 05">
        Si el texto necesita explicarse dos veces, el problema es la jerarquía,
        no el tamaño.
      </RuleStrip>
    </section>
  );
};
