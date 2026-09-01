'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import { SURFACE_LEVELS } from '../brand/system';
import { StatusPill } from '../brand/marks';
import { RuleStrip, SectionIntro } from '../brand/ui';

export const Material = () => {
  const [level, setLevel] = useState<string>('elevado');
  const active =
    SURFACE_LEVELS.find((item) => item.id === level) ?? SURFACE_LEVELS[0];

  return (
    <section id="materia" className="section material">
      <SectionIntro
        index="07"
        eyebrow="Materia · profundidad"
        title="La profundidad también comunica."
        body="Borde, espacio y sombra dicen qué está arriba, qué se puede presionar y qué superficie contiene la decisión actual. Seis niveles, ni uno más: apilar tarjetas no es jerarquía."
      />

      <div className="material-lab">
        <div className="material-stage">
          <div className="material-stage__mesh" aria-hidden="true" />
          <div className={`material-card material-card--${level}`}>
            <div className="material-card__head">
              <span>proyecto · noroeste</span>
              <StatusPill status="disponible" compact />
            </div>
            <strong>Envolvente de momento</strong>
            <div className="material-card__trace" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="material-card__foot">
              <code>Mmax −148.6 kN·m</code>
              <span>v4 · hoy 10:15</span>
            </div>
          </div>
        </div>

        <div className="panel material-controls">
          <div className="panel__label">
            <span>Nivel</span>
            <code>data-level</code>
          </div>
          <div className="material-picker">
            {SURFACE_LEVELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={level === item.id ? 'is-active' : ''}
                onClick={() => setLevel(item.id)}
              >
                <strong>{item.name}</strong>
                <small>{item.use}</small>
              </button>
            ))}
          </div>
          <p className="material-controls__rule">{active.rule}</p>
        </div>
      </div>

      <div className="components">
        <div className="components__head">
          <span className="tag">Componentes</span>
          <h3>La geometría no cambia entre temas.</h3>
          <p>
            Cambian el papel, la tinta y la profundidad. Nunca la altura ni el
            trazo.
          </p>
        </div>

        <div className="components__row">
          <article className="component-block">
            <div className="component-block__label">
              <span>01 · botones</span>
              <code>36 px</code>
            </div>
            <div className="button-showcase">
              <button type="button" className="ui-button ui-button--primary">
                <Sparkles size={14} /> Analizar
              </button>
              <button type="button" className="ui-button">
                Comparar revisiones
              </button>
              <button type="button" className="ui-button ui-button--quiet">
                Ver detalle <ArrowUpRight size={13} />
              </button>
              <button type="button" className="ui-button ui-button--danger">
                Eliminar 12 miembros
              </button>
              <button type="button" className="ui-button" disabled>
                Sin resultados
              </button>
            </div>
            <p>
              La etiqueta anticipa el resultado. Lo destructivo cuenta cuánto
              destruye.
            </p>
          </article>

          <article className="component-block">
            <div className="component-block__label">
              <span>02 · entradas</span>
              <code>unidad visible</code>
            </div>
            <div className="field-showcase">
              <label className="field">
                <span>Carga distribuida</span>
                <span className="field__control">
                  <input type="text" defaultValue="8.00" inputMode="decimal" />
                  <code>kN/m</code>
                </span>
              </label>
              <label className="field field--warn">
                <span>Longitud</span>
                <span className="field__control">
                  <input type="text" defaultValue="12" inputMode="decimal" />
                  <code>?</code>
                </span>
                <small>Declara la unidad antes de analizar.</small>
              </label>
            </div>
            <p>La unidad vive dentro del campo, no en una leyenda lejana.</p>
          </article>
        </div>

        <div className="feedback-strip">
          <div className="feedback feedback--ok">
            <CheckCircle2 size={16} />
            <span>
              <strong>Listo</strong>
              <small>Equilibrio verificado con tolerancia 1e−6.</small>
            </span>
          </div>
          <div className="feedback feedback--warn">
            <AlertTriangle size={16} />
            <span>
              <strong>Revisar</strong>
              <small>Falta declarar la unidad de la carga en 2 miembros.</small>
            </span>
          </div>
          <div className="feedback feedback--info">
            <Info size={16} />
            <span>
              <strong>Contexto</strong>
              <small>
                El resultado corresponde a la revisión v4 del modelo.
              </small>
            </span>
          </div>
        </div>

        <div className="table-demo">
          <div className="table-demo__head">
            <span>03 · tablas</span>
            <code>cifras tabulares</code>
          </div>
          <table>
            <thead>
              <tr>
                <th>Miembro</th>
                <th>N</th>
                <th>V</th>
                <th>M</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>B1</td>
                <td>248.20</td>
                <td>96.40</td>
                <td>−148.60</td>
                <td>
                  <StatusPill status="disponible" compact />
                </td>
              </tr>
              <tr>
                <td>B4</td>
                <td>112.05</td>
                <td>44.10</td>
                <td>−61.30</td>
                <td>
                  <span className="cell-warn">revisar</span>
                </td>
              </tr>
              <tr>
                <td>C2</td>
                <td>−318.44</td>
                <td>12.80</td>
                <td>28.90</td>
                <td>
                  <StatusPill status="disponible" compact />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <RuleStrip index="Regla 07">
        Una superficie declara su nivel por posición, espacio y filete antes que
        por decoración.
      </RuleStrip>
    </section>
  );
};
