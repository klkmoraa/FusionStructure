'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { BrandMark } from '../brand/marks';
import { SIGNALS, type SectionId } from '../brand/system';
import { STATUS_COUNTS, STATUS_META } from '../brand/catalog';
import { Eyebrow, useBrandbook } from '../brand/ui';

const BEATS = [
  {
    id: 'modelo',
    label: 'Modelo',
    note: 'geometría, apoyos y cargas declaradas',
  },
  {
    id: 'analisis',
    label: 'Análisis',
    note: 'equilibrio resuelto con su tolerancia',
  },
  { id: 'lectura', label: 'Lectura', note: 'el diagrama dice qué gobierna' },
  {
    id: 'decision',
    label: 'Decisión',
    note: 'la traza queda unida al resultado',
  },
] as const;

/**
 * Tablero del héroe: el mismo pórtico recorre modelo, análisis, lectura y
 * decisión. Cada fase enciende una capa; ninguna capa aparece sin su rótulo.
 */
const AnalysisBoard = ({ beat }: { beat: number }) => {
  const { activeSignal } = useBrandbook();
  const signal = SIGNALS.find((item) => item.id === activeSignal) ?? SIGNALS[0];

  return (
    <div className={`board board--beat-${beat}`} data-signal={activeSignal}>
      <div className="board__chrome">
        <span className="board__dot" aria-hidden="true" />
        <span>pórtico-04 · marco plano</span>
        <code>12.00 × 4.20 m</code>
      </div>

      <p className="visually-hidden">
        Pórtico de dos columnas con carga distribuida, deformada y diagrama de
        resultado para la señal activa.
      </p>

      <svg className="board__canvas" viewBox="0 0 520 320" aria-hidden="true">
        <defs>
          <pattern
            id="board-grid"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <path d="M26 0H0v26" fill="none" />
          </pattern>
        </defs>
        <rect
          className="board__grid"
          x="0"
          y="0"
          width="520"
          height="320"
          fill="url(#board-grid)"
        />

        <g className="board__axes">
          <path d="M40 288h440" />
          <path d="M40 288V44" />
          <text x="484" y="292">
            X
          </text>
          <text x="30" y="46">
            Y
          </text>
        </g>

        <g className="board__loads">
          {[150, 210, 270, 330].map((x, index) => (
            <g key={x} style={{ animationDelay: `${index * 70}ms` }}>
              <path d={`M${x} 44v34`} />
              <path d={`m${x - 5} 72 5 8 5-8z`} className="board__arrow" />
            </g>
          ))}
          <text x="240" y="34">
            8.0 kN/m
          </text>
        </g>

        <g className="board__frame">
          <path d="M96 96h288" />
          <path d="M96 96v192" />
          <path d="M384 96v192" />
        </g>

        <g className="board__supports">
          <path d="M96 288 82 308h28z" />
          <path d="M384 288 370 308h28z" />
          <path d="M76 310h40M364 310h40" />
        </g>

        <path
          className="board__deformed"
          d="M96 96c0 0 44 6 96 34s96 34 96 34 52-2 96-34"
        />

        <g className="board__diagram">
          <path
            className="board__diagram-fill"
            d="M96 96c58 0 66 92 144 92s86-92 144-92v0H96Z"
          />
          <path
            className="board__diagram-line"
            d="M96 96c58 0 66 92 144 92s86-92 144-92"
          />
        </g>

        <g className="board__nodes">
          <circle cx="96" cy="96" r="5" />
          <circle cx="384" cy="96" r="5" />
          <circle cx="240" cy="96" r="4" />
        </g>

        <g className="board__station">
          <path d="M240 60v230" />
          <circle cx="240" cy="188" r="6" />
        </g>
      </svg>

      <div className="board__readout">
        <div className="board__result">
          <span className="board__result-tag">{signal.short}</span>
          <strong>
            {signal.id === 'moment' ? '−148.6' : null}
            {signal.id === 'axial' ? '248.2' : null}
            {signal.id === 'shear' ? '96.4' : null}
            {signal.id === 'deformed' ? '11.7' : null}
            {signal.id === 'yield' ? '0.82' : null}
            {signal.id === 'attention' ? '1' : null}
          </strong>
          <small>
            {signal.id === 'yield' ? 'demanda / capacidad' : null}
            {signal.id === 'attention' ? 'supuesto sin declarar' : signal.unit}
          </small>
        </div>
        <dl className="board__meta">
          <div>
            <dt>método</dt>
            <dd>lineal · P-Δ</dd>
          </div>
          <div>
            <dt>tolerancia</dt>
            <dd>1e−6</dd>
          </div>
          <div>
            <dt>revisión</dt>
            <dd>v4</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const Hero = ({ onGoTo }: { onGoTo: (id: SectionId) => void }) => {
  const { motionMode } = useBrandbook();
  const [cycled, setCycled] = useState(0);
  const calm = motionMode === 'calma';
  const beat = calm ? BEATS.length - 1 : cycled;

  useEffect(() => {
    if (calm) return;
    const timer = window.setInterval(() => {
      setCycled((current) => (current + 1) % BEATS.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [calm]);

  return (
    <section id="norte" className="section hero">
      <div className="hero__copy">
        <Eyebrow>FusionStructure · sistema visual y verbal</Eyebrow>
        <h1 aria-label="Make complexity legible.">
          <span className="hero__word">Make</span>
          <span className="hero__word">complexity</span>
          <em className="hero__word">legible.</em>
        </h1>
        <p className="hero__lead">
          Un modelo, un resultado y una decisión deben leerse igual en pantalla,
          en papel y en obra. Este documento fija cómo se ve, cómo se mueve y
          cómo habla esa continuidad.
        </p>

        <div className="hero__actions">
          <button
            type="button"
            className="action action--primary"
            onClick={() => onGoTo('herramientas')}
          >
            Ver las 25 superficies <ArrowUpRight size={16} />
          </button>
          <button
            type="button"
            className="action"
            onClick={() => onGoTo('identidad')}
          >
            Empezar por la marca <ArrowDown size={16} />
          </button>
        </div>

        <ul className="hero__ledger">
          {(['disponible', 'experimental', 'planeado'] as const).map(
            (status) => (
              <li key={status}>
                <span
                  className={`status-dot status-dot--${status}`}
                  aria-hidden="true"
                />
                <strong>{STATUS_COUNTS[status] ?? 0}</strong>
                <small>{STATUS_META[status].label}</small>
              </li>
            ),
          )}
          <li className="hero__ledger-note">
            <BrandMark size={18} tone="mono" />
            <small>estado verificable, no promesa comercial</small>
          </li>
        </ul>
      </div>

      <div className="hero__stage">
        <AnalysisBoard beat={beat} />
        <ol className="hero__beats">
          {BEATS.map((item, index) => (
            <li key={item.id} className={index === beat ? 'is-active' : ''}>
              <button type="button" onClick={() => setCycled(index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
