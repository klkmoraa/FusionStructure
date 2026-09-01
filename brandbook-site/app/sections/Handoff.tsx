'use client';

import { Check, Download, FileDown } from 'lucide-react';
import {
  EASINGS,
  HANDOFF_CHECKS,
  MOTION_TOKENS,
  NEUTRALS,
  SIGNALS,
} from '../brand/system';
import { FAMILY_COLORS, type FamilyId } from '../brand/generated/palette';
import { FAMILY_META, TOOLS } from '../brand/catalog';
import { BrandMark } from '../brand/marks';
import { CopyChip, SectionIntro, useBrandbook } from '../brand/ui';

const BRAND_ASSETS = [
  {
    href: '/brand/fusionstructure-mark.svg',
    name: 'Marca · señal',
    note: 'uso general, brazo en color de señal',
  },
  {
    href: '/brand/fusionstructure-mark-mono.svg',
    name: 'Marca · mono',
    note: 'documento, impresión y grabado',
  },
  {
    href: '/brand/fusionstructure-mark-inverse.svg',
    name: 'Marca · inversa',
    note: 'fondos oscuros',
  },
  {
    href: '/brand/fusionstructure-app-icon.svg',
    name: 'Icono de aplicación',
    note: 'carbón con esquina de 11u',
  },
  {
    href: '/brand/fusionstructure-lockup.svg',
    name: 'Firma horizontal',
    note: 'marca, nombre y principio',
  },
  {
    href: '/favicon.svg',
    name: 'Favicon',
    note: '16 px en adelante',
  },
] as const;

const buildTokenSheet = () => {
  const lines: string[] = [':root {'];
  for (const signal of SIGNALS) {
    lines.push(`  ${signal.token}: ${signal.day}; /* noche ${signal.night} */`);
  }
  for (const step of NEUTRALS) {
    lines.push(
      `  --fs-neutral-${step.step}: ${step.day}; /* noche ${step.night} */`,
    );
  }
  for (const id of Object.keys(FAMILY_COLORS) as FamilyId[]) {
    lines.push(
      `  --fs-family-${id}: ${FAMILY_COLORS[id].day}; /* noche ${FAMILY_COLORS[id].night} */`,
    );
  }
  for (const token of MOTION_TOKENS) {
    lines.push(`  ${token.token}: ${token.value};`);
  }
  for (const easing of EASINGS) {
    lines.push(`  ${easing.token}: ${easing.value};`);
  }
  lines.push('}');
  return lines.join('\n');
};

export const Handoff = () => {
  const { copyValue } = useBrandbook();
  const sheet = buildTokenSheet();

  return (
    <section id="entrega" className="section handoff">
      <SectionIntro
        index="12"
        eyebrow="Entrega · guardas"
        title="Un sistema se sostiene con guardas, no con buenas intenciones."
        body="Estos son los valores que propone el brandbook y las comprobaciones que un cambio debe pasar antes de considerarse listo. La aplicación todavía consume los suyos en src/design-system/tokens.css: alinear ambos es una migración pendiente, no un hecho. Si una guarda falla, se reporta el fallo: no se presenta como éxito."
      />

      <div className="handoff__grid">
        <article className="panel handoff__tokens">
          <div className="panel__label">
            <span>Hoja de tokens · propuesta</span>
            <code>css</code>
          </div>
          <pre>
            <code>{sheet}</code>
          </pre>
          <button
            type="button"
            className="action action--primary"
            onClick={() => copyValue(sheet, 'hoja de tokens')}
          >
            <Download size={15} /> Copiar la hoja completa
          </button>
          <p className="handoff__tokens-note">
            Valores propuestos por el brandbook. La aplicación conserva los de{' '}
            <code>src/design-system/tokens.css</code> hasta que exista una
            migración con capturas comparables y revisión de accesibilidad.
          </p>
        </article>

        <article className="panel handoff__checks">
          <div className="panel__label">
            <span>Antes de cerrar un cambio</span>
            <code>{HANDOFF_CHECKS.length}</code>
          </div>
          <ul>
            {HANDOFF_CHECKS.map((check) => (
              <li key={check}>
                <Check size={15} aria-hidden="true" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
          <p>
            Las puertas del repositorio (<code>npm run check</code>) no
            certifican una función: solo dicen que lo automatizado pasó.
          </p>
        </article>

        <article className="panel handoff__assets">
          <div className="panel__label">
            <span>Activos</span>
            <code>svg</code>
          </div>
          <ul>
            {BRAND_ASSETS.map((asset) => (
              <li key={asset.href}>
                <a href={asset.href} download>
                  <FileDown size={14} aria-hidden="true" />
                  <span>
                    <strong>{asset.name}</strong>
                    <small>{asset.note}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p>
            Los 25 glifos de herramienta viven en <code>/brand/tools/</code> con
            el identificador de cada superficie. Se regeneran con{' '}
            <code>npm run brand:assets</code>: no se editan a mano.
          </p>
        </article>

        <article className="panel handoff__inventory">
          <div className="panel__label">
            <span>Inventario</span>
            <code>{TOOLS.length} superficies</code>
          </div>
          <ul>
            {(Object.keys(FAMILY_META) as FamilyId[]).map((id) => (
              <li key={id} className={`family--${id}`}>
                <span className="handoff__swatch" aria-hidden="true" />
                <strong>{FAMILY_META[id].label}</strong>
                <small>{FAMILY_META[id].purpose}</small>
                <code>{TOOLS.filter((tool) => tool.family === id).length}</code>
              </li>
            ))}
          </ul>
          <div className="handoff__chips">
            <CopyChip
              value="brandbook-site/app/brand/system.ts"
              label="system.ts"
            />
            <CopyChip
              value="brandbook-site/scripts/glyph-library.mjs"
              label="glyph-library.mjs"
            />
          </div>
        </article>
      </div>

      <div className="handoff__closing">
        <BrandMark size={54} />
        <div>
          <h3>Make complexity legible.</h3>
          <p>
            FusionStructure es experimental. Este documento describe cómo se ve
            y cómo habla el producto, no promete cumplimiento normativo,
            exactitud para una obra real ni módulos terminados. Lo que existe
            está marcado como disponible; lo demás está dibujado, no prometido.
          </p>
        </div>
      </div>
    </section>
  );
};
