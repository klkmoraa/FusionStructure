/**
 * Catálogo del ecosistema, tal como lo fija el canon (FusionStructureBrand,
 * ficha 11 · Herramientas). El estado va antes que la promesa: si cambia aquí,
 * cambia primero allí.
 */
export type Lang = 'es' | 'en';
export type Localized = Readonly<Record<Lang, string>>;
export type ToolStatus = 'available' | 'experimental' | 'planned';
export type FamilyId = 'nucleo' | 'analisis' | 'modelo' | 'civil' | 'proyecto' | 'conexiones' | 'aprendizaje';

export interface Family {
  id: FamilyId;
  prefix: string;
  name: Localized;
  purpose: Localized;
  /** Glifo del logo de familia; Núcleo firma con la ménsula. */
  glyph: string | null;
}

export interface Tool {
  code: string;
  family: FamilyId;
  glyph: string;
  name: Localized;
  status: ToolStatus;
}

/** Herramientas con tarjeta ilustrada: imagen clay, qué hace y dónde se abre. */
export interface Showcase {
  code: string;
  image: string | null;
  summary: Localized;
  product?: 'fstructure' | 'fmodel';
}

export const SHOWCASE: readonly Showcase[] = [
  { code: 'FS-A01', image: 'solver-2d', product: 'fstructure', summary: { es: 'Marcos, vigas y armaduras: modela, resuelve y lee diagramas.', en: 'Frames, beams and trusses: model, solve and read diagrams.' } },
  { code: 'FS-M01', image: 'cad', product: 'fmodel', summary: { es: 'Dibujo técnico preciso: capas, bloques, presentaciones, DXF y PDF.', en: 'Precise drafting: layers, blocks, layouts, DXF and PDF.' } },
  { code: 'FS-A02', image: 'solver-3d', product: 'fstructure', summary: { es: 'Pórticos espaciales, modal y espectro de respuesta.', en: 'Space frames, modal and response spectrum.' } },
  { code: 'FS-A03', image: 'finite-elements', product: 'fstructure', summary: { es: 'Placas en 2D con mallas de Gmsh y salida a VTK.', en: '2D plates with Gmsh meshes and VTK output.' } },
  { code: 'FS-A04', image: null, product: 'fstructure', summary: { es: 'Concreto por NTC-CDMX, NSR-10 y E.060.', en: 'Concrete per NTC-CDMX, NSR-10 and E.060.' } },
  { code: 'FS-L01', image: 'classroom', product: 'fstructure', summary: { es: 'Ejemplos guiados: predice antes de ver el resultado.', en: 'Guided examples: predict before you see the result.' } },
  { code: 'FS-M02', image: 'bim', summary: { es: 'Modelo físico y analítico, relacionados.', en: 'Physical and analytical model, linked.' } },
  { code: 'FS-P02', image: 'quantities-costs', summary: { es: 'Medir antes de presupuestar.', en: 'Measure before you estimate.' } },
];

export const FAMILIES: readonly Family[] = [
  { id: 'nucleo', prefix: 'FS', glyph: null, name: { es: 'Núcleo', en: 'Core' }, purpose: { es: 'Proyecto, unidades, versiones y evidencia.', en: 'Project, units, versions and evidence.' } },
  { id: 'analisis', prefix: 'FS-A', glyph: 'solver2d', name: { es: 'Análisis', en: 'Analysis' }, purpose: { es: 'Solvers, comprobaciones y calidad numérica.', en: 'Solvers, checks and numerical quality.' } },
  { id: 'modelo', prefix: 'FS-M', glyph: 'bim', name: { es: 'Modelo', en: 'Model' }, purpose: { es: 'Dibujo, modelo constructivo y detallado.', en: 'Drawing, building model and detailing.' } },
  { id: 'civil', prefix: 'FS-C', glyph: 'terrain', name: { es: 'Civil', en: 'Civil' }, purpose: { es: 'Terreno, suelo y sistemas del sitio.', en: 'Terrain, soil and site systems.' } },
  { id: 'proyecto', prefix: 'FS-P', glyph: 'schedule', name: { es: 'Proyecto', en: 'Project' }, purpose: { es: 'Documentos, cantidades, costo y obra.', en: 'Documents, quantities, cost and site.' } },
  { id: 'conexiones', prefix: 'FS-I', glyph: 'connectors', name: { es: 'Conexiones', en: 'Connections' }, purpose: { es: 'Intercambio versionado con otras apps.', en: 'Versioned exchange with other apps.' } },
  { id: 'aprendizaje', prefix: 'FS-L', glyph: 'classroom', name: { es: 'Aprendizaje', en: 'Learning' }, purpose: { es: 'Aula, investigación y laboratorio.', en: 'Classroom, research and lab.' } },
];

const t = (code: string, family: FamilyId, glyph: string, es: string, en: string, status: ToolStatus): Tool => ({ code, family, glyph, name: { es, en }, status });

export const TOOLS: readonly Tool[] = [
  t('FS', 'nucleo', 'project', 'Proyecto local', 'Local project', 'available'),
  t('FS', 'nucleo', 'quality', 'Calidad del resultado', 'Result quality', 'available'),
  t('FS', 'nucleo', 'memo', 'Memoria técnica', 'Technical report', 'available'),
  t('FS', 'nucleo', 'exchange', 'Intercambio', 'Exchange', 'available'),
  t('FS', 'nucleo', 'library', 'Biblioteca personal', 'Personal library', 'available'),
  t('FS', 'nucleo', 'offline', 'Sin conexión', 'Offline', 'available'),
  t('FS', 'nucleo', 'assist', 'Asistencia local', 'Local assistance', 'experimental'),
  t('FS-A01', 'analisis', 'solver2d', 'FStructure 2D', 'FStructure 2D', 'available'),
  t('FS-A02', 'analisis', 'solver3d', 'Solver 3D', '3D solver', 'experimental'),
  t('FS-A03', 'analisis', 'fem', 'Elementos finitos', 'Finite elements', 'experimental'),
  t('FS-A04', 'analisis', 'materials', 'Diseño', 'Design', 'experimental'),
  t('FS-M01', 'modelo', 'cad', 'FModel · CAD 2D', 'FModel · 2D CAD', 'available'),
  t('FS-M02', 'modelo', 'bim', 'Modelo BIM', 'BIM model', 'planned'),
  t('FS-M03', 'modelo', 'detail', 'Detallado', 'Detailing', 'planned'),
  t('FS-C01', 'civil', 'terrain', 'Terreno', 'Terrain', 'planned'),
  t('FS-C02', 'civil', 'geotech', 'Geotecnia', 'Geotechnics', 'planned'),
  t('FS-C03', 'civil', 'water', 'Agua y drenaje', 'Water and drainage', 'planned'),
  t('FS-P01', 'proyecto', 'docs', 'Documentos', 'Documents', 'planned'),
  t('FS-P02', 'proyecto', 'cost', 'Cantidades y costos', 'Quantities and costs', 'planned'),
  t('FS-P03', 'proyecto', 'schedule', 'Programa y campo', 'Schedule and site', 'planned'),
  t('FS-I01', 'conexiones', 'connectors', 'Conectores', 'Connectors', 'planned'),
  t('FS-L01', 'aprendizaje', 'classroom', 'Aula estructural', 'Structural classroom', 'available'),
  t('FS-L02', 'aprendizaje', 'research', 'Taller de investigación', 'Research workshop', 'planned'),
  t('FS-L03', 'aprendizaje', 'lab', 'Laboratorio reproducible', 'Reproducible lab', 'planned'),
  t('FS-L04', 'aprendizaje', 'mentoring', 'Tutoría', 'Mentoring', 'planned'),
];

export const countByStatus = (tools: readonly Tool[] = TOOLS): Record<ToolStatus, number> => {
  const counts: Record<ToolStatus, number> = { available: 0, experimental: 0, planned: 0 };
  for (const tool of tools) counts[tool.status] += 1;
  return counts;
};
