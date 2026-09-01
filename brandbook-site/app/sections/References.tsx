'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { RuleStrip, SectionIntro } from '../brand/ui';

const MOCKUPS = [
  {
    id: 'day-analysis',
    mode: 'dia',
    format: 'landscape',
    src: '/mockups/fusionstructure-desktop-day.png',
    title: 'Mesa de análisis',
    note: 'Modelo, resultados e inspector comparten un solo campo de trabajo.',
  },
  {
    id: 'day-projects',
    mode: 'dia',
    format: 'landscape',
    src: '/mockups/day-project-hub.png',
    title: 'Continuidad de proyecto',
    note: 'Fases, versiones y siguiente acción sin convertir el inicio en un tablero genérico.',
  },
  {
    id: 'day-model',
    mode: 'dia',
    format: 'landscape',
    src: '/mockups/day-model-loads.png',
    title: 'Modelado directo',
    note: 'La carga nace del elemento seleccionado y la profundidad explica la relación.',
  },
  {
    id: 'day-compare',
    mode: 'dia',
    format: 'landscape',
    src: '/mockups/day-results-compare.png',
    title: 'Comparación estructural',
    note: 'Las señales se alinean por significado: comparar no obliga a traducir.',
  },
  {
    id: 'day-field',
    mode: 'dia',
    format: 'portrait',
    src: '/mockups/day-mobile-field-review.png',
    title: 'Revisión de campo',
    note: 'Una incidencia, su evidencia y un siguiente paso visible en móvil.',
  },
  {
    id: 'night-model',
    mode: 'noche',
    format: 'landscape',
    src: '/mockups/night-model-editor.png',
    title: 'Modelo en carbón',
    note: 'Carbón neutro con superficies elevadas y señal de alta legibilidad.',
  },
  {
    id: 'night-results',
    mode: 'noche',
    format: 'landscape',
    src: '/mockups/night-results-explorer.png',
    title: 'Explorador de resultados',
    note: 'Diagramas sincronizados, estación seleccionada y deformada vinculada.',
  },
  {
    id: 'night-trace',
    mode: 'noche',
    format: 'landscape',
    src: '/mockups/night-decision-trace.png',
    title: 'Traza de decisión',
    note: 'Modelo, análisis, incidencia y evidencia dentro de una secuencia reversible.',
  },
  {
    id: 'night-report',
    mode: 'noche',
    format: 'landscape',
    src: '/mockups/night-report-evidence.png',
    title: 'Reporte y procedencia',
    note: 'El documento conserva vínculos visibles con modelo, resultado y versión.',
  },
  {
    id: 'night-mobile',
    mode: 'noche',
    format: 'portrait',
    src: '/mockups/night-mobile-results.png',
    title: 'Resultados móviles',
    note: 'Foco táctil y significado estructural en poco espacio.',
  },
] as const;

export const References = () => (
  <section id="referencias" className="section references">
    <SectionIntro
      index="10"
      eyebrow="Referencias · el sistema en producto"
      title="Una identidad, cualquier superficie."
      body="Estas piezas fijan proporción, densidad, jerarquía y profundidad. No son pantallas finales ni evidencia de capacidades: son el criterio con el que se diseñan las siguientes."
    />

    <div className="device-references">
      <figure className="device-reference">
        <div className="device-reference__head">
          <span>estudio de dispositivo · día</span>
          <strong>escritorio + teléfono</strong>
        </div>
        <Image
          unoptimized
          src="/mockups/device-day-studio.png"
          alt="FusionStructure en monitor y teléfono, modo día"
          width={1584}
          height={992}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </figure>
      <figure className="device-reference device-reference--night">
        <div className="device-reference__head">
          <span>estudio de dispositivo · noche</span>
          <strong>carbón neutro</strong>
        </div>
        <Image
          unoptimized
          src="/mockups/device-night-studio.png"
          alt="FusionStructure en monitor y teléfono, modo noche"
          width={1584}
          height={992}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </figure>
    </div>

    {(['dia', 'noche'] as const).map((mode) => (
      <div className={`mockup-group mockup-group--${mode}`} key={mode}>
        <div className="mockup-group__head">
          <span>
            {mode === 'dia' ? 'día · papel técnico' : 'noche · carbón'}
          </span>
          <code>05 referencias</code>
        </div>
        <div className="mockup-gallery">
          {MOCKUPS.filter((item) => item.mode === mode).map((item) => (
            <figure
              className={`mockup-frame mockup-frame--${item.format}`}
              key={item.id}
            >
              <div className="mockup-frame__bar">
                <span>
                  <ImageIcon size={12} />{' '}
                  {item.format === 'portrait' ? 'móvil' : 'escritorio'}
                </span>
                <code>{item.id}</code>
              </div>
              <Image
                unoptimized
                src={item.src}
                alt={`Referencia de FusionStructure: ${item.title}`}
                width={item.format === 'portrait' ? 943 : 1584}
                height={item.format === 'portrait' ? 1677 : 992}
                sizes={
                  item.format === 'portrait'
                    ? '(max-width: 620px) 100vw, 420px'
                    : '(max-width: 900px) 100vw, 50vw'
                }
              />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    ))}

    <RuleStrip index="Regla 10">
      Aplicar principios, no copiar pantallas: papel técnico, sombra corta,
      color con significado y movimiento que explica procedencia.
    </RuleStrip>
  </section>
);
