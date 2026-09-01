'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import {
  EASINGS,
  MOTION_DEMOS,
  MOTION_TOKENS,
  type MotionDemoId,
} from '../brand/system';
import { CopyChip, RuleStrip, SectionIntro, useBrandbook } from '../brand/ui';

export const Motion = () => {
  const { motionMode } = useBrandbook();
  const [demo, setDemo] = useState<MotionDemoId>('llegar');
  const [replay, setReplay] = useState(0);
  const active =
    MOTION_DEMOS.find((item) => item.id === demo) ?? MOTION_DEMOS[0];

  return (
    <section id="movimiento" className="section motion">
      <SectionIntro
        index="06"
        eyebrow="Movimiento · respuesta"
        title="El movimiento dice qué cambió y de dónde vino."
        body="Nada entra desde el centro sin motivo. Un panel llega desde su borde, una relación se dibuja antes de explicarse y una confirmación ocupa el lugar del control que la produjo. Apagar el movimiento nunca quita información."
      />

      <div className="motion-lab">
        <div
          className={`motion-screen motion-screen--${demo}`}
          key={`${demo}-${replay}`}
        >
          <div className="motion-screen__bar">
            <span>
              <span className="live-dot" aria-hidden="true" />
              {motionMode === 'calma' ? 'modo calma' : 'vista activa'}
            </span>
            <code>{active.label.toLowerCase()}</code>
          </div>

          <div className="motion-screen__canvas">
            <div className="motion-panel motion-panel--base">
              <span>modelo</span>
              <div className="motion-panel__lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="motion-panel motion-panel--incoming">
              <span>inspector</span>
              <strong>−148.6 kN·m</strong>
              <small>nudo B4 · v4</small>
            </div>
            <svg
              className="motion-link"
              viewBox="0 0 240 120"
              aria-hidden="true"
            >
              <path d="M20 92C90 92 120 30 220 30" />
            </svg>
            <div className="motion-confirm">
              <span aria-hidden="true">✓</span>
              Versión local guardada
            </div>
            <div className="motion-compare" aria-hidden="true">
              <i className="motion-compare__a" />
              <i className="motion-compare__b" />
            </div>
            <div className="motion-progress" aria-hidden="true">
              <i />
            </div>
          </div>

          <p className="motion-screen__rule">{active.rule}</p>
        </div>

        <div className="panel motion-controls">
          <div className="panel__label">
            <span>Seis mensajes</span>
            <code>uno a la vez</code>
          </div>
          <div className="motion-picker">
            {MOTION_DEMOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={demo === item.id ? 'is-active' : ''}
                onClick={() => {
                  setDemo(item.id);
                  setReplay((value) => value + 1);
                }}
              >
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="action action--quiet"
            onClick={() => setReplay((value) => value + 1)}
          >
            <RotateCcw size={14} /> Repetir
          </button>
        </div>
      </div>

      <div className="token-grid">
        {MOTION_TOKENS.map((token) => (
          <article key={token.name} className="motion-token">
            <span>{token.name}</span>
            <strong>{token.value}</strong>
            <small>{token.use}</small>
            <CopyChip value={token.token} />
          </article>
        ))}
      </div>

      <div className="easing-row">
        {EASINGS.map((easing) => (
          <article key={easing.name}>
            <div className="easing-row__track" aria-hidden="true">
              <i style={{ transitionTimingFunction: easing.value }} />
            </div>
            <strong>{easing.name}</strong>
            <code>{easing.value}</code>
            <small>{easing.use}</small>
          </article>
        ))}
      </div>

      <RuleStrip index="Regla 06">
        Con <code>prefers-reduced-motion</code> o en modo calma, toda transición
        cae a cero y el contenido queda en su estado final. Nada se pierde.
      </RuleStrip>

      <div className="brand-film">
        <div className="brand-film__copy">
          <span className="tag">Pieza de marca</span>
          <h3>Del modelo a una decisión legible.</h3>
          <p>
            Diez segundos con la misma gramática: llegar, conectar, confirmar.
            La pieza no muestra una función que no exista.
          </p>
          <dl>
            <div>
              <dt>formato</dt>
              <dd>1920 × 1080 · 30 fps</dd>
            </div>
            <div>
              <dt>uso</dt>
              <dd>portada, presentación, encabezado</dd>
            </div>
          </dl>
        </div>
        <figure className="brand-film__player">
          <div className="brand-film__bar">
            <span>
              <Play size={12} /> motion study
            </span>
            <code>10.8s</code>
          </div>
          <video
            controls
            muted
            loop
            playsInline
            preload="metadata"
            poster="/motion/fusionstructure-brand-motion-poster.png"
            aria-label="Animación de marca de FusionStructure"
          >
            <source
              src="/motion/fusionstructure-brand-motion.mp4"
              type="video/mp4"
            />
          </video>
        </figure>
      </div>
    </section>
  );
};
