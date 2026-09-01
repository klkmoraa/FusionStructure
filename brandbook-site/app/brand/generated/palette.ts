/* Generado por scripts/build-brand-assets.mjs. No editar a mano. */
import type { GlyphId } from './glyphs';

export type FamilyId =
  | 'nucleo'
  | 'analisis'
  | 'modelo'
  | 'civil'
  | 'proyecto'
  | 'interop'
  | 'aprendizaje';

export const FAMILY_COLORS: Record<
  FamilyId,
  { day: string; night: string; label: string }
> = {
  nucleo: { day: '#3F4A50', night: '#AEB9BE', label: 'Núcleo' },
  analisis: { day: '#1B75B0', night: '#63C5FF', label: 'Análisis' },
  modelo: { day: '#B8412F', night: '#FF8E80', label: 'Modelo' },
  civil: { day: '#277654', night: '#55C990', label: 'Civil' },
  proyecto: { day: '#8A6110', night: '#F3C553', label: 'Proyecto' },
  interop: { day: '#6A57C8', night: '#9B87FF', label: 'Interoperabilidad' },
  aprendizaje: { day: '#B44A7E', night: '#EF7AB9', label: 'Aprendizaje' },
};

export const TOOL_BINDINGS: Record<
  string,
  { glyph: GlyphId; family: FamilyId }
> = {
  proyecto: { glyph: 'project', family: 'nucleo' },
  calidad: { glyph: 'quality', family: 'nucleo' },
  memoria: { glyph: 'memo', family: 'nucleo' },
  intercambio: { glyph: 'exchange', family: 'nucleo' },
  biblioteca: { glyph: 'library', family: 'nucleo' },
  offline: { glyph: 'offline', family: 'nucleo' },
  asistencia: { glyph: 'assist', family: 'nucleo' },
  'fs-a01': { glyph: 'solver2d', family: 'analisis' },
  'fs-a02': { glyph: 'solver3d', family: 'analisis' },
  'fs-a03': { glyph: 'fem', family: 'analisis' },
  'fs-a04': { glyph: 'materials', family: 'analisis' },
  'fs-m01': { glyph: 'cad', family: 'modelo' },
  'fs-m02': { glyph: 'bim', family: 'modelo' },
  'fs-m03': { glyph: 'detail', family: 'modelo' },
  'fs-c01': { glyph: 'terrain', family: 'civil' },
  'fs-c02': { glyph: 'geotech', family: 'civil' },
  'fs-c03': { glyph: 'water', family: 'civil' },
  'fs-p01': { glyph: 'docs', family: 'proyecto' },
  'fs-p02': { glyph: 'cost', family: 'proyecto' },
  'fs-p03': { glyph: 'schedule', family: 'proyecto' },
  'fs-i01': { glyph: 'connectors', family: 'interop' },
  'fs-l01': { glyph: 'classroom', family: 'aprendizaje' },
  'fs-l02': { glyph: 'research', family: 'aprendizaje' },
  'fs-l03': { glyph: 'lab', family: 'aprendizaje' },
  'fs-l04': { glyph: 'mentoring', family: 'aprendizaje' },
};
