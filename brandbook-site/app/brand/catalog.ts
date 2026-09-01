/**
 * Catálogo de superficies de FusionStructure.
 *
 * El texto proviene de `docs/catalogo-herramientas.md` y
 * `docs/alcance-funcional.md`. El estado es el del repositorio, no una
 * promesa comercial: si el código cambia, este archivo cambia con él.
 *
 * `reference` nombra superficies que se estudiaron como referencia de
 * categoría. No implica equivalencia, compatibilidad ni reemplazo.
 */
import type { FamilyId } from './generated/palette';
import type { GlyphId } from './generated/glyphs';

export type StatusId =
  | 'disponible'
  | 'experimental'
  | 'planeado'
  | 'no-comprometido';

export type Tool = {
  id: string;
  code: string;
  name: string;
  family: FamilyId;
  glyph: GlyphId;
  status: StatusId;
  role: string;
  summary: string;
  today: string;
  next: string;
  gate: string;
  reference: string;
};

export const STATUS_META: Record<
  StatusId,
  { label: string; meaning: string; rule: string }
> = {
  disponible: {
    label: 'Disponible',
    meaning: 'Existe una ruta utilizable dentro del alcance documentado.',
    rule: 'Se puede usar hoy. No equivale a certificación ni a obra.',
  },
  experimental: {
    label: 'Experimental',
    meaning: 'Implementación parcial o validación todavía insuficiente.',
    rule: 'Se muestra con sus límites y nunca como resultado final.',
  },
  planeado: {
    label: 'Planeado',
    meaning: 'Objetivo aprobado para una fase futura.',
    rule: 'Se dibuja, no se insinúa como existente.',
  },
  'no-comprometido': {
    label: 'No comprometido',
    meaning: 'Idea sin contrato, sin fecha y sin promesa.',
    rule: 'Solo aparece cuando la conversación es sobre dirección.',
  },
};

export const FAMILY_META: Record<
  FamilyId,
  { label: string; prefix: string; purpose: string }
> = {
  nucleo: {
    label: 'Núcleo',
    prefix: '···',
    purpose: 'proyecto, unidades, versiones y evidencia compartida',
  },
  analisis: {
    label: 'Análisis',
    prefix: 'FS-A',
    purpose: 'solvers, comprobaciones y calidad numérica',
  },
  modelo: {
    label: 'Modelo',
    prefix: 'FS-M',
    purpose: 'dibujo, modelo constructivo y detallado',
  },
  civil: {
    label: 'Civil',
    prefix: 'FS-C',
    purpose: 'terreno, suelo y sistemas físicos del sitio',
  },
  proyecto: {
    label: 'Proyecto',
    prefix: 'FS-P',
    purpose: 'documentos, cantidades, costo, programa y campo',
  },
  interop: {
    label: 'Interoperabilidad',
    prefix: 'FS-I',
    purpose: 'intercambio versionado con otras aplicaciones',
  },
  aprendizaje: {
    label: 'Aprendizaje',
    prefix: 'FS-L',
    purpose: 'aula, investigación, laboratorio y trayectoria',
  },
};

export const TOOLS: readonly Tool[] = [
  {
    id: 'proyecto',
    code: 'NÚCLEO',
    name: 'Proyecto local',
    family: 'nucleo',
    glyph: 'project',
    status: 'disponible',
    role: 'la unidad que todo comparte',
    summary:
      'Un proyecto con identidad, unidades, configuración, versiones locales y recuperación. Todas las superficies leen y escriben aquí.',
    today:
      'Proyecto, configuración, unidades, persistencia local, recuperación, versiones y cambios reversibles.',
    next: 'Identidad estable entre dominios, permisos y sincronización opcional sin romper el flujo local.',
    gate: 'Guardar, recuperar y deshacer sin pérdida silenciosa de información.',
    reference: 'Gestores de proyecto de escritorio',
  },
  {
    id: 'calidad',
    code: 'NÚCLEO',
    name: 'Calidad del resultado',
    family: 'nucleo',
    glyph: 'quality',
    status: 'disponible',
    role: 'auditoría antes de creer',
    summary:
      'Auditoría de cargas, diagnósticos, certificado numérico limitado y trazabilidad de cada resultado.',
    today:
      'Auditoría de cargas, diagnósticos, fiabilidad y traza del resultado dentro del alcance del solver 2D.',
    next: 'Más casos patológicos, tolerancias declaradas y comparación entre revisiones.',
    gate: 'Un resultado sin unidades, método y límites visibles no se presenta como conclusión.',
    reference: 'Prácticas de verificación numérica',
  },
  {
    id: 'memoria',
    code: 'NÚCLEO',
    name: 'Memoria técnica',
    family: 'nucleo',
    glyph: 'memo',
    status: 'disponible',
    role: 'el cálculo, escrito',
    summary:
      'Memoria PDF con anexos, diagramas, procedimiento y materiales, más expediente portable y vista previa.',
    today:
      'Memoria PDF, anexos, diagramas, procedimiento, materiales, expediente portable y vista previa.',
    next: 'Plantillas por jurisdicción, firma de revisión y comparación entre entregas.',
    gate: 'El documento declara generador, versión del modelo y estado; no simula un plano sellado.',
    reference: 'Memorias de cálculo de despacho',
  },
  {
    id: 'intercambio',
    code: 'NÚCLEO',
    name: 'Intercambio actual',
    family: 'nucleo',
    glyph: 'exchange',
    status: 'disponible',
    role: 'salir sin quedar encerrado',
    summary:
      'JSON de proyecto, SVG, PNG, CSV, enlaces compartibles e importación DXF ASCII de un subconjunto.',
    today:
      'Exportación JSON/SVG/PNG/CSV, enlaces compartibles e importación DXF de un subconjunto.',
    next: 'Cobertura DXF mayor, reporte de pérdidas y round-trip probado.',
    gate: 'Toda importación declara qué entendió, qué ignoró y en qué unidades.',
    reference: 'DXF, CSV, JSON',
  },
  {
    id: 'biblioteca',
    code: 'NÚCLEO',
    name: 'Biblioteca personal',
    family: 'nucleo',
    glyph: 'library',
    status: 'disponible',
    role: 'lo que ya resolviste',
    summary:
      'Secciones, vistas, favoritos y preferencias locales que acompañan a la persona entre proyectos.',
    today: 'Secciones, vistas, favoritos y preferencias locales.',
    next: 'Catálogos compartibles con procedencia y versión de cada perfil.',
    gate: 'Una sección guardada conserva origen, unidades y fecha.',
    reference: 'Catálogos de perfiles',
  },
  {
    id: 'offline',
    code: 'NÚCLEO',
    name: 'Trabajo sin conexión',
    family: 'nucleo',
    glyph: 'offline',
    status: 'disponible',
    role: 'el taller no siempre tiene red',
    summary:
      'Shell PWA, almacenamiento local y aviso controlado de actualización: trabajar offline es capacidad base.',
    today:
      'Shell PWA, almacenamiento local y aviso controlado de actualización.',
    next: 'Resolución de conflictos al reconectar y respaldo explícito.',
    gate: 'Ninguna actualización descarta trabajo local sin avisar.',
    reference: 'Aplicaciones locales primero',
  },
  {
    id: 'asistencia',
    code: 'NÚCLEO',
    name: 'Asistencia local',
    family: 'nucleo',
    glyph: 'assist',
    status: 'experimental',
    role: 'propone, no decide',
    summary:
      'Propuestas de comandos locales. No debe ocultar ni ejecutar acciones ambiguas sin confirmación.',
    today:
      'Propuestas de comandos sobre el modelo abierto, siempre confirmables.',
    next: 'Explicación del porqué, vista previa del efecto y deshacer garantizado.',
    gate: 'Ninguna acción ambigua se ejecuta sin confirmación explícita.',
    reference: 'Paletas de comandos',
  },
  {
    id: 'fs-a01',
    code: 'FS-A01',
    name: 'FStructure',
    family: 'analisis',
    glyph: 'solver2d',
    status: 'disponible',
    role: 'Solver 2D · marcos, armaduras y vigas',
    summary:
      'El núcleo disponible: modelar, analizar y leer resultados con el procedimiento a la vista, en el navegador. FStructure es el nombre del módulo; Solver 2D es su rol en la familia.',
    today:
      'Nudos, miembros, apoyos, propiedades, cargas, casos y combinaciones; análisis lineal y P-Delta; reacciones, deformada, N-V-M, envolventes, influencia, pandeo y estudios modales.',
    next: 'Suite numérica independiente, más casos patológicos, contratos de signos y unidades, y oráculos externos.',
    gate: 'Equilibrio, compatibilidad, reacciones y desplazamientos contra casos manuales y un oráculo independiente.',
    reference: 'FTOOL, Edubeam, RFEM',
  },
  {
    id: 'fs-a02',
    code: 'FS-A02',
    name: 'Solver 3D',
    family: 'analisis',
    glyph: 'solver3d',
    status: 'experimental',
    role: 'marco espacial separado',
    summary:
      'Un dominio espacial aislado del 2D. Existe, resuelve casos elásticos lineales y no comparte contratos todavía.',
    today:
      'Marco espacial elástico lineal, seis grados de libertad por nodo, cargas nodales y fuerzas de extremo.',
    next: 'Transformaciones, liberaciones, resortes, cargas distribuidas, diafragmas, masa, dinámica y estabilidad.',
    gate: 'Marcos espaciales con rotaciones rígidas, simetría y equilibrio 3D; rechazo determinista de modelos singulares.',
    reference: 'ETABS, SAP2000, RFEM, OpenSees',
  },
  {
    id: 'fs-a03',
    code: 'FS-A03',
    name: 'Elementos finitos',
    family: 'analisis',
    glyph: 'fem',
    status: 'planeado',
    role: 'campos, mallas y convergencia',
    summary:
      'Mallas 2D/3D con materiales lineales y después no lineales. Las familias estructural, mecánica y geotécnica no se fingen como un solo modelo constitutivo.',
    today: 'Todavía no existe implementación.',
    next: 'Mallas, contactos, fronteras, etapas, adaptatividad, convergencia y campos de resultado.',
    gate: 'Patch tests, refinamiento de malla, conservación de equilibrio y comparación con soluciones analíticas.',
    reference: 'Ansys Mechanical, PLAXIS',
  },
  {
    id: 'fs-a04',
    code: 'FS-A04',
    name: 'Diseño por materiales',
    family: 'analisis',
    glyph: 'materials',
    status: 'experimental',
    role: 'demanda contra capacidad',
    summary:
      'Hoy existe un único estado límite de acero en tensión axial, deliberadamente inconcluso. No es diseño integral.',
    today:
      'Un componente separado del resultado de análisis, con material, sección, fuente normativa y bloqueos explícitos.',
    next: 'Concreto, madera y mampostería; paquetes normativos versionados; estados límite evaluados y ausentes visibles.',
    gate: 'Reproducir cada cláusula a mano y bloquear la conclusión cuando falte un estado límite.',
    reference: 'ETABS, Osdag, StructuralCodes',
  },
  {
    id: 'fs-m01',
    code: 'FS-M01',
    name: 'Dibujo CAD',
    family: 'modelo',
    glyph: 'cad',
    status: 'planeado',
    role: 'geometría precisa y abierta',
    summary:
      'Geometría 2D/3D con capas, bloques, referencias, cotas y restricciones. Una línea puede representar, pero no sustituye en silencio a una entidad del proyecto.',
    today: 'Todavía no existe implementación.',
    next: 'Capas, bloques, referencias externas, cotas, restricciones, estilos, layouts y exportación abierta.',
    gate: 'Tolerancias, snapping, deshacer, round-trip de formatos y cero cambios silenciosos de coordenadas.',
    reference: 'AutoCAD, Rhino',
  },
  {
    id: 'fs-m02',
    code: 'FS-M02',
    name: 'Modelo BIM',
    family: 'modelo',
    glyph: 'bim',
    status: 'planeado',
    role: 'físico y analítico, relacionados',
    summary:
      'Niveles, ejes, espacios, elementos, fases y vistas. IFC será un contrato de intercambio, no el modelo interno entero.',
    today: 'Todavía no existe implementación.',
    next: 'Elementos constructivos, clasificaciones, tablas y relación explícita entre modelo físico y analítico.',
    gate: 'Identidad estable, migraciones, comparación de versiones y pérdida de información declarada.',
    reference: 'Revit, Archicad, Tekla Structures',
  },
  {
    id: 'fs-m03',
    code: 'FS-M03',
    name: 'Detallado',
    family: 'modelo',
    glyph: 'detail',
    status: 'planeado',
    role: 'del cálculo a la fabricación',
    summary:
      'Conexiones, placas, pernos, soldaduras y refuerzo. Un resultado de análisis no se convierte automáticamente en detalle aprobado.',
    today: 'Todavía no existe implementación.',
    next: 'Numeración, dibujos de taller, ensambles, lista de materiales y paquetes de fabricación.',
    gate: 'Consistencia entre modelo, vistas, lista de materiales y archivo exportado.',
    reference: 'Tekla Structures, SolidWorks',
  },
  {
    id: 'fs-c01',
    code: 'FS-C01',
    name: 'Terreno',
    family: 'civil',
    glyph: 'terrain',
    status: 'planeado',
    role: 'el sitio como dato',
    summary:
      'Levantamientos, superficies, alineamientos y volúmenes con coordenadas, fuente y precisión como datos de primer nivel.',
    today: 'Todavía no existe implementación.',
    next: 'Puntos, TIN, curvas, parcelas, alineamientos, perfiles, corredores y corte/relleno.',
    gate: 'CRS, datum, unidades, precisión, fuente y balance de volúmenes registrados.',
    reference: 'Civil 3D, QGIS',
  },
  {
    id: 'fs-c02',
    code: 'FS-C02',
    name: 'Geotecnia',
    family: 'civil',
    glyph: 'geotech',
    status: 'planeado',
    role: 'suelo, agua y etapas',
    summary:
      'Estratos, nivel freático, excavaciones y estabilidad por etapas, con hipótesis constitutivas visibles.',
    today: 'Todavía no existe implementación.',
    next: 'Sostenimiento, flujo, consolidación e interacción suelo-estructura por fases.',
    gate: 'Benchmarks académicos, estudios de malla y advertencias claras sobre datos de campo faltantes.',
    reference: 'PLAXIS, GeoStudio',
  },
  {
    id: 'fs-c03',
    code: 'FS-C03',
    name: 'Agua y drenaje',
    family: 'civil',
    glyph: 'water',
    status: 'planeado',
    role: 'redes, cuencas y escenarios',
    summary:
      'Redes presurizadas, drenaje, lluvia, escurrimiento y almacenamiento con balances reproducibles.',
    today: 'Todavía no existe implementación.',
    next: 'Cuencas, bombas, calidad del agua y comparación de escenarios.',
    gate: 'Continuidad de masa y energía, estabilidad temporal y comparación contra archivos de ejemplo oficiales.',
    reference: 'EPANET, SWMM',
  },
  {
    id: 'fs-p01',
    code: 'FS-P01',
    name: 'Documentos',
    family: 'proyecto',
    glyph: 'docs',
    status: 'planeado',
    role: 'cada marca apunta a algo',
    summary:
      'Hojas, marcas, revisiones, incidencias y expediente final donde cada incidencia apunta a objeto, vista y revisión.',
    today:
      'La memoria técnica actual es una base disponible; la superficie coordinada todavía no existe.',
    next: 'Comparación de hojas, transmittals, RFI, submittals y responsables.',
    gate: 'Cada documento conserva generador, versión del modelo, estado, checksum y diferencia.',
    reference: 'Bluebeam, Navisworks',
  },
  {
    id: 'fs-p02',
    code: 'FS-P02',
    name: 'Cantidades y costos',
    family: 'proyecto',
    glyph: 'cost',
    status: 'planeado',
    role: 'medir antes de presupuestar',
    summary:
      'Takeoff, catálogos, análisis de precios unitarios y presupuesto, distinguiendo siempre medición derivada de captura manual.',
    today: 'Todavía no existe implementación.',
    next: 'Conceptos, materiales, mano de obra, equipo, indirectos y comparativos por revisión.',
    gate: 'Moneda, fecha de precios, unidad, rendimiento, fórmula, redondeo y fuente visibles.',
    reference: 'Neodata, Opus',
  },
  {
    id: 'fs-p03',
    code: 'FS-P03',
    name: 'Programa y campo',
    family: 'proyecto',
    glyph: 'schedule',
    status: 'planeado',
    role: 'la obra contra el plan',
    summary:
      'WBS, ruta crítica, recursos, avances y evidencia de campo unidos al elemento y a su costo.',
    today: 'Todavía no existe implementación.',
    next: 'Calendarios, riesgos, 4D, reportes diarios, seguridad, fotos e incidencias.',
    gate: 'Ruta crítica comprobada, zonas horarias explícitas, operación offline y evidencia ligada a actividad y versión.',
    reference: 'Primavera P6, Procore',
  },
  {
    id: 'fs-i01',
    code: 'FS-I01',
    name: 'Conectores',
    family: 'interop',
    glyph: 'connectors',
    status: 'planeado',
    role: 'intercambio con checkpoint',
    summary:
      'Adaptadores versionados con vista previa, diferencias, confirmación y punto de retorno. Lo actual es una base, no un hub.',
    today:
      'La importación DXF parcial y las exportaciones existentes; el hub versionado es todavía visión.',
    next: 'Adaptadores de Revit, AutoCAD, IFC, BCF, IDS y APIs de autoría.',
    gate: 'Snapshot inmutable de origen, diff añadido-cambiado-eliminado, idempotencia y checkpoint reversible.',
    reference: 'IFC, BCF, IDS, APS',
  },
  {
    id: 'fs-l01',
    code: 'FS-L01',
    name: 'Aula estructural',
    family: 'aprendizaje',
    glyph: 'classroom',
    status: 'disponible',
    role: 'predecir antes de revelar',
    summary:
      'Ejercicios guiados sobre el mismo modelo y el mismo análisis, con predicción propia antes del resultado.',
    today:
      'Ejercicios de viga, voladizo, pórtico y armadura; parámetros con unidades; ruta de construir, definir, analizar, comparar y concluir.',
    next: 'Biblioteca versionada de ejercicios, rúbricas y paquetes docentes portables.',
    gate: 'Cada ejercicio incluye respuesta manual u oráculo, convenciones, tolerancias y una conclusión que distingue predicción de resultado.',
    reference: 'FTOOL, Edubeam, IndeterminateBeam',
  },
  {
    id: 'fs-l02',
    code: 'FS-L02',
    name: 'Taller de investigación',
    family: 'aprendizaje',
    glyph: 'research',
    status: 'planeado',
    role: 'la pregunta y su evidencia',
    summary:
      'Problema, hipótesis, variables, método, fuentes y decisiones ligados a snapshots del proyecto.',
    today: 'Todavía no existe implementación.',
    next: 'Protocolo versionado, hitos, ética y bitácora de decisiones.',
    gate: 'El reporte puede reconstruirse desde fuentes, decisiones, datos y ejecuciones versionadas.',
    reference: 'Quarto, gestores bibliográficos',
  },
  {
    id: 'fs-l03',
    code: 'FS-L03',
    name: 'Laboratorio reproducible',
    family: 'aprendizaje',
    glyph: 'lab',
    status: 'planeado',
    role: 'otra máquina, mismo número',
    summary:
      'Datos, parámetros, motor, versión, tolerancia y artefactos por ejecución, atados a un snapshot del proyecto.',
    today: 'Todavía no existe implementación.',
    next: 'Notebooks, datasets, entornos, hashes, métricas y figuras versionadas.',
    gate: 'Otra máquina reconstruye el resultado o explica por qué no.',
    reference: 'JupyterLab, DVC',
  },
  {
    id: 'fs-l04',
    code: 'FS-L04',
    name: 'Tutoría y trayectoria',
    family: 'aprendizaje',
    glyph: 'mentoring',
    status: 'planeado',
    role: 'acuerdos con evidencia',
    summary:
      'Sesiones, acuerdos, hitos y bloqueos evaluados por evidencia del trabajo real, no por gamificación.',
    today: 'Todavía no existe implementación.',
    next: 'Agenda, responsables, criterios, alertas y próximas acciones ligadas al proyecto.',
    gate: 'Todo acuerdo puede cerrarse, reabrirse y auditarse; quitar el conector externo no destruye el expediente.',
    reference: 'LMS y gestores de tareas',
  },
];

export const STATUS_COUNTS = TOOLS.reduce<Record<string, number>>(
  (counts, tool) => ({
    ...counts,
    [tool.status]: (counts[tool.status] ?? 0) + 1,
  }),
  {},
);
