'use client';

import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import {
  GLOSSARY,
  MICROCOPY,
  VOICE_PRINCIPLES,
  VOICE_REWRITES,
} from '../brand/system';
import { RuleStrip, SectionIntro } from '../brand/ui';

export const Voice = () => {
  const [rewrite, setRewrite] = useState<string>(VOICE_REWRITES[0].id);
  const active =
    VOICE_REWRITES.find((item) => item.id === rewrite) ?? VOICE_REWRITES[0];

  return (
    <section id="voz" className="section voice">
      <SectionIntro
        index="11"
        eyebrow="Voz · verdad del producto"
        title="Claro sobre lo que existe. Preciso sobre lo que falta."
        body="La confianza no se construye con adjetivos: se construye declarando el estado, nombrando el límite y diciendo qué información está conectada con qué. Una frase que no se puede sostener con el código es una frase que hay que reescribir."
      />

      <div className="voice-principles">
        {VOICE_PRINCIPLES.map((principle, index) => (
          <article key={principle.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{principle.title}</strong>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>

      <div className="rewriter">
        <div className="rewriter__head">
          <span className="tag">Reescritura</span>
          <h3>La misma idea, sostenible.</h3>
          <p>
            Elige una frase típica y mira qué queda cuando se le quita la
            promesa.
          </p>
        </div>

        <div className="rewriter__body">
          <ul
            className="rewriter__list"
            role="tablist"
            aria-label="Frases para reescribir"
          >
            {VOICE_REWRITES.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={rewrite === item.id}
                  className={rewrite === item.id ? 'is-active' : ''}
                  onClick={() => setRewrite(item.id)}
                >
                  <small>{item.context}</small>
                  <span>{item.before}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="rewriter__stage">
            <div className="rewriter__card rewriter__card--before">
              <span className="rewriter__badge">
                <X size={13} /> promete
              </span>
              <p>{active.before}</p>
            </div>
            <ArrowRight
              className="rewriter__arrow"
              size={20}
              aria-hidden="true"
            />
            <div className="rewriter__card rewriter__card--after">
              <span className="rewriter__badge">
                <Check size={13} /> sostiene
              </span>
              <p>{active.after}</p>
            </div>
            <p className="rewriter__why">
              <strong>Por qué:</strong> {active.why}
            </p>
          </div>
        </div>
      </div>

      <div className="microcopy">
        {MICROCOPY.map((group) => (
          <article key={group.id}>
            <div className="microcopy__head">
              <span className="tag">{group.group}</span>
            </div>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="glossary">
        <div className="glossary__head">
          <span className="tag">Glosario</span>
          <p>
            Seis palabras que significan lo mismo en la interfaz, en la
            documentación y en una conversación con quien revisa.
          </p>
        </div>
        <dl>
          {GLOSSARY.map((entry) => (
            <div key={entry.term}>
              <dt>{entry.term}</dt>
              <dd>{entry.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>

      <RuleStrip index="Regla 11">
        FusionStructure no sustituye el criterio de una persona responsable, la
        revisión independiente ni la normativa aplicable. Escribir como si lo
        hiciera es un error de marca.
      </RuleStrip>
    </section>
  );
};
