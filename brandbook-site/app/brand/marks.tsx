'use client';

import type { CSSProperties } from 'react';
import { GLYPHS, GLYPH_MARK, type GlyphId } from './generated/glyphs';
import { FAMILY_COLORS, type FamilyId } from './generated/palette';
import { STATUS_META, type StatusId } from './catalog';
import type { SignalId } from './system';

/**
 * La ménsula: un miembro vertical y dos voladizos cuyo peralte decrece
 * hacia la punta, como el diagrama de momento que los dimensiona.
 */
export const BrandMark = ({
  size = 40,
  tone = 'signal',
  title,
}: {
  size?: number;
  tone?: 'signal' | 'mono' | 'inverse';
  title?: string;
}) => (
  <svg
    className={`mark mark--${tone}`}
    width={size}
    height={size}
    viewBox="0 0 48 48"
    role={title ? 'img' : 'presentation'}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    <path className="mark__body" d={GLYPH_MARK.base} />
    <path className="mark__arm" d={GLYPH_MARK.arm} />
  </svg>
);

export const MarkConstruction = () => (
  <svg className="mark-construction" viewBox="0 0 48 48" aria-hidden="true">
    <g className="mark-construction__grid">
      {[8, 17, 26, 34, 41].map((x) => (
        <line key={`v${x}`} x1={x} y1={2} x2={x} y2={46} />
      ))}
      {[5, 14, 21, 30, 43].map((y) => (
        <line key={`h${y}`} x1={2} y1={y} x2={46} y2={y} />
      ))}
    </g>
    <path className="mark-construction__body" d={GLYPH_MARK.base} />
    <path className="mark-construction__arm" d={GLYPH_MARK.arm} />
    <g className="mark-construction__notes">
      <text x="18.5" y="3.6">
        9u
      </text>
      <text x="42.5" y="9">
        24u
      </text>
      <text x="35.5" y="34.5">
        17u
      </text>
      <text x="1.5" y="47">
        peralte 9u → 5u
      </text>
    </g>
  </svg>
);

export const Glyph = ({
  id,
  size = 32,
  className,
}: {
  id: GlyphId;
  size?: number;
  className?: string;
}) => (
  <svg
    className={`glyph ${className ?? ''}`}
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {GLYPHS[id]}
  </svg>
);

export const ToolTile = ({
  glyph,
  family,
  size = 46,
}: {
  glyph: GlyphId;
  family: FamilyId;
  size?: number;
}) => (
  <span
    className="tool-tile"
    style={
      {
        '--family-day': FAMILY_COLORS[family].day,
        '--family-night': FAMILY_COLORS[family].night,
        '--tile-size': `${size}px`,
      } as CSSProperties
    }
  >
    <Glyph id={glyph} size={Math.round(size * 0.62)} />
  </span>
);

export const StatusPill = ({
  status,
  compact = false,
}: {
  status: StatusId;
  compact?: boolean;
}) => (
  <span
    className={`status status--${status} ${compact ? 'status--compact' : ''}`}
  >
    <span className="status__dot" aria-hidden="true" />
    {STATUS_META[status].label}
  </span>
);

/** Diagramas de resultado usados como muestra del lenguaje gráfico. */
export const MiniDiagram = ({ type }: { type: SignalId }) => (
  <svg className="mini-diagram" viewBox="0 0 180 96" aria-hidden="true">
    <path className="mini-diagram__axis" d="M14 48H166" />
    {type === 'axial' ? (
      <>
        <path
          className="mini-diagram__signal"
          d="M26 48V34m18 14V26m18 22V18m18 30V13m18 35V19m18 29V28m18 20V37"
        />
        <path className="mini-diagram__ghost" d="M26 34h126" />
      </>
    ) : null}
    {type === 'moment' ? (
      <>
        <path
          className="mini-diagram__fill"
          d="M20 48C56 48 60 82 90 82s34-34 70-34v0H20Z"
        />
        <path
          className="mini-diagram__signal"
          d="M20 48C56 48 60 82 90 82s34-34 70-34"
        />
      </>
    ) : null}
    {type === 'shear' ? (
      <>
        <path
          className="mini-diagram__fill"
          d="m20 22 66 26-66 22Zm140 2L94 48l66 24Z"
        />
        <path
          className="mini-diagram__signal"
          d="m20 22 66 26-66 22m140-46L94 48l66 24"
        />
      </>
    ) : null}
    {type === 'deformed' ? (
      <>
        <path className="mini-diagram__ghost" d="M22 26h136" />
        <path
          className="mini-diagram__signal"
          d="M22 26c30 0 32 50 68 50s40-50 68-50"
        />
        <circle className="mini-diagram__point" cx="22" cy="26" r="3.4" />
        <circle className="mini-diagram__point" cx="158" cy="26" r="3.4" />
      </>
    ) : null}
    {type === 'yield' ? (
      <>
        <path
          className="mini-diagram__ghost"
          d="M24 74 58 24l32 50 34-50 32 50"
        />
        <path
          className="mini-diagram__signal"
          d="M24 74 90 24l66 50M58 24l66 50"
        />
        <circle className="mini-diagram__point" cx="90" cy="24" r="4.4" />
      </>
    ) : null}
    {type === 'attention' ? (
      <>
        <path
          className="mini-diagram__ghost"
          d="M20 48h140"
          strokeDasharray="5 5"
        />
        <path className="mini-diagram__signal" d="M20 62c28 0 26-30 52-30" />
        <path
          className="mini-diagram__signal"
          d="M108 32h52"
          strokeDasharray="6 6"
        />
        <circle className="mini-diagram__point" cx="90" cy="32" r="4.4" />
      </>
    ) : null}
  </svg>
);
