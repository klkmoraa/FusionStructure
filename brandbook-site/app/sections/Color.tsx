'use client';

import { useMemo } from 'react';
import { MiniDiagram } from '../brand/marks';
import { NEUTRALS, SIGNALS } from '../brand/system';
import { FAMILY_COLORS, type FamilyId } from '../brand/generated/palette';
import { FAMILY_META } from '../brand/catalog';
import { CopyChip, RuleStrip, SectionIntro, useBrandbook } from '../brand/ui';

const channel = (value: number) => {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const clean = hex.replace('#', '');
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** Contraste WCAG 2.1 entre dos colores sólidos. */
export const contrastRatio = (a: string, b: string) => {
  const first = luminance(a);
  const second = luminance(b);
  const light = Math.max(first, second);
  const dark = Math.min(first, second);
  return (light + 0.05) / (dark + 0.05);
};

const ratioLabel = (ratio: number) => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA · gráfico';
  return 'insuficiente';
};

export const Color = () => {
  const { theme, activeSignal, setActiveSignal } = useBrandbook();
  const isNight = theme === 'noche';
  const paper = isNight ? '#14171A' : '#F7F6F1';

  const signal = SIGNALS.find((item) => item.id === activeSignal) ?? SIGNALS[0];
  const signalHex = isNight ? signal.night : signal.day;

  const families = useMemo(
    () =>
      (Object.keys(FAMILY_COLORS) as FamilyId[]).map((id) => {
        const hex = isNight ? FAMILY_COLORS[id].night : FAMILY_COLORS[id].day;
        return { id, hex, ratio: contrastRatio(hex, paper) };
      }),
    [isNight, paper],
  );

  return (
    <section id="color" className="section color">
      <SectionIntro
        index="04"
        eyebrow="Color · tres escalas"
        title="El color explica una relación o no se usa."
        body="Las señales pertenecen al resultado, las familias a la herramienta y los estados a la verdad del producto. Los fondos se quedan quietos para que las tres escalas sigan significando algo."
      />

      <div className="signal-lab">
        <div
          className="signal-list"
          role="tablist"
          aria-label="Señales de resultado"
        >
          {SIGNALS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeSignal === item.id}
              className={`signal-row signal-row--${item.id} ${activeSignal === item.id ? 'is-active' : ''}`}
              onClick={() => setActiveSignal(item.id)}
            >
              <span className="signal-row__swatch" aria-hidden="true" />
              <span className="signal-row__copy">
                <strong>{item.name}</strong>
                <small>{item.use}</small>
              </span>
              <code>{item.short}</code>
            </button>
          ))}
        </div>

        <div className={`signal-stage signal--${signal.id}`}>
          <div className="signal-stage__top">
            <span>
              activo · {signal.name} <code>{signal.unit}</code>
            </span>
            <div className="signal-stage__chips">
              <CopyChip value={signal.token} />
              <CopyChip value={signalHex} />
            </div>
          </div>

          <div className="signal-stage__plot">
            <MiniDiagram type={signal.id} />
          </div>

          <p className="signal-stage__description">{signal.description}</p>

          <dl className="signal-stage__rules">
            <div>
              <dt>usar en</dt>
              <dd>línea · punto · estado · etiqueta</dd>
            </div>
            <div>
              <dt>evitar</dt>
              <dd>fondo completo · relleno decorativo · texto largo</dd>
            </div>
            <div>
              <dt>contraste</dt>
              <dd>
                {contrastRatio(signalHex, paper).toFixed(2)}:1 ·{' '}
                {ratioLabel(contrastRatio(signalHex, paper))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <RuleStrip index="Regla 04">
        Si el color no explica una relación del dominio, se elimina antes de
        discutirlo.
      </RuleStrip>

      <div className="palette-block">
        <div className="palette-block__head">
          <span className="tag">Familias</span>
          <p>
            Emparentadas con las señales, pero más profundas: la señal pertenece
            al dato y la familia a la herramienta. Nunca se usan como resultado.
          </p>
        </div>
        <ul className="family-palette">
          {families.map((item) => (
            <li key={item.id} className={`family--${item.id}`}>
              <span className="family-palette__chip" aria-hidden="true" />
              <div>
                <strong>{FAMILY_META[item.id].label}</strong>
                <small>{FAMILY_META[item.id].purpose}</small>
              </div>
              <div className="family-palette__data">
                <CopyChip value={item.hex} />
                <span
                  className={
                    item.ratio >= 4.5
                      ? 'is-pass'
                      : item.ratio >= 3
                        ? 'is-warn'
                        : 'is-fail'
                  }
                >
                  {item.ratio.toFixed(2)}:1 · {ratioLabel(item.ratio)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="palette-block">
        <div className="palette-block__head">
          <span className="tag">Neutros</span>
          <p>
            Una sola rampa cálida para día y noche. Cada paso tiene un papel;
            ninguno se usa «porque se ve bien».
          </p>
        </div>
        <ul className="neutral-ramp">
          {NEUTRALS.map((step) => (
            <li key={step.step}>
              <span
                className="neutral-ramp__swatch"
                style={{ background: isNight ? step.night : step.day }}
                aria-hidden="true"
              />
              <code>{step.step}</code>
              <small>{step.role}</small>
              <CopyChip value={isNight ? step.night : step.day} />
            </li>
          ))}
        </ul>
      </div>

      <div className="theme-pair">
        <article className="theme-pair__card theme-pair__card--day">
          <span className="tag">Día · papel técnico</span>
          <strong>Fondo tranquilo, tinta densa.</strong>
          <p>
            El papel cálido baja el brillo sin apagar el trazo. La señal aparece
            en tono profundo para sostener 4.5:1 sobre fondo claro.
          </p>
        </article>
        <article className="theme-pair__card theme-pair__card--night">
          <span className="tag">Noche · carbón</span>
          <strong>Carbón neutro, nunca negro puro.</strong>
          <p>
            En noche la misma señal sube de luminosidad. El significado no
            cambia: cambia el valor para conservar la lectura.
          </p>
        </article>
      </div>
    </section>
  );
};
