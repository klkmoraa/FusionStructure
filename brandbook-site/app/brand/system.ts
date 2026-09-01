/**
 * Sistema visual y verbal de FusionStructure.
 *
 * Aquí viven las decisiones: qué significa cada color, cuánto dura cada
 * transición, qué nivel tiene cada superficie y cómo se escribe. La hoja
 * `app/globals.css` implementa estos valores como variables CSS.
 */

export type SectionId =
  | 'norte'
  | 'identidad'
  | 'herramientas'
  | 'color'
  | 'tipografia'
  | 'movimiento'
  | 'materia'
  | 'iconografia'
  | 'patrones'
  | 'referencias'
  | 'voz'
  | 'entrega';

export const SECTIONS: readonly {
  id: SectionId;
  index: string;
  label: string;
  detail: string;
}[] = [
  { id: 'norte', index: '01', label: 'Norte', detail: 'qué debe sentirse' },
  {
    id: 'identidad',
    index: '02',
    label: 'Identidad',
    detail: 'la marca y su familia',
  },
  {
    id: 'herramientas',
    index: '03',
    label: 'Herramientas',
    detail: '25 superficies con estado',
  },
  {
    id: 'color',
    index: '04',
    label: 'Color',
    detail: 'señal, familia y estado',
  },
  {
    id: 'tipografia',
    index: '05',
    label: 'Tipografía',
    detail: 'leer sin traducir',
  },
  {
    id: 'movimiento',
    index: '06',
    label: 'Movimiento',
    detail: 'respuesta, no ruido',
  },
  {
    id: 'materia',
    index: '07',
    label: 'Materia',
    detail: 'capas que orientan',
  },
  {
    id: 'iconografia',
    index: '08',
    label: 'Iconografía',
    detail: 'dibujar como se calcula',
  },
  {
    id: 'patrones',
    index: '09',
    label: 'Patrones',
    detail: 'orden que se adapta',
  },
  {
    id: 'referencias',
    index: '10',
    label: 'Referencias',
    detail: 'el sistema en producto',
  },
  {
    id: 'voz',
    index: '11',
    label: 'Voz',
    detail: 'lenguaje que no promete de más',
  },
  { id: 'entrega', index: '12', label: 'Entrega', detail: 'tokens y guardas' },
];

/** Señales de resultado: pertenecen al dato, nunca a la decoración. */
export const SIGNALS = [
  {
    id: 'axial',
    name: 'Axial',
    short: 'N',
    unit: 'kN',
    day: '#1B75B0',
    night: '#63C5FF',
    token: '--fs-signal-axial',
    use: 'fuerza normal',
    description: 'Tensión y compresión a lo largo del miembro.',
  },
  {
    id: 'moment',
    name: 'Momento',
    short: 'M',
    unit: 'kN·m',
    day: '#B8412F',
    night: '#FF8E80',
    token: '--fs-signal-moment',
    use: 'flexión',
    description: 'Diagramas de momento, giros y zonas dominadas por flexión.',
  },
  {
    id: 'shear',
    name: 'Cortante',
    short: 'V',
    unit: 'kN',
    day: '#277654',
    night: '#55C990',
    token: '--fs-signal-shear',
    use: 'fuerza transversal',
    description: 'Cortante y transferencia entre elementos.',
  },
  {
    id: 'deformed',
    name: 'Deformada',
    short: 'Δ',
    unit: 'mm',
    day: '#6A57C8',
    night: '#9B87FF',
    token: '--fs-signal-deformed',
    use: 'geometría desplazada',
    description: 'Distingue la forma desplazada de la geometría original.',
  },
  {
    id: 'yield',
    name: 'Fluencia',
    short: 'Fy',
    unit: 'estado',
    day: '#B44A7E',
    night: '#EF7AB9',
    token: '--fs-signal-yield',
    use: 'estado límite local',
    description: 'Plastificación, líneas de fluencia y estados límite locales.',
  },
  {
    id: 'attention',
    name: 'Atención',
    short: '!',
    unit: 'revisión',
    day: '#8A6110',
    night: '#F3C553',
    token: '--fs-signal-attention',
    use: 'dato incompleto',
    description:
      'Pide revisión, marca supuestos y señala información faltante.',
  },
] as const;

export type SignalId = (typeof SIGNALS)[number]['id'];

/** Rampa neutra. Un solo eje de grises cálidos para papel y carbón. */
export const NEUTRALS = [
  { step: '000', day: '#FFFEFA', night: '#0E1113', role: 'papel elevado' },
  { step: '050', day: '#F7F6F1', night: '#14171A', role: 'fondo' },
  { step: '100', day: '#EDEFE9', night: '#1B1F22', role: 'superficie' },
  { step: '200', day: '#DDE2DC', night: '#252A2E', role: 'superficie hundida' },
  { step: '300', day: '#C6CDC6', night: '#333A3E', role: 'filete suave' },
  { step: '400', day: '#A7B1A9', night: '#465055', role: 'filete visible' },
  { step: '500', day: '#7E8A84', night: '#5E6A6F', role: 'texto de apoyo' },
  { step: '600', day: '#5C6A6F', night: '#8B9599', role: 'texto secundario' },
  { step: '700', day: '#3F4A50', night: '#B4BDC0', role: 'texto fuerte' },
  { step: '900', day: '#14171A', night: '#F2F4F3', role: 'tinta' },
] as const;

export const SURFACE_LEVELS = [
  {
    id: 'plano',
    name: 'Plano',
    use: 'rejilla, tablas y filas técnicas',
    rule: 'filete suave, sin sombra',
  },
  {
    id: 'interior',
    name: 'Interior',
    use: 'cavidad de interacción',
    rule: 'fondo hundido, separación contenida',
  },
  {
    id: 'elevado',
    name: 'Elevado',
    use: 'paneles, barras e inspector',
    rule: 'superficie definida, sombra corta',
  },
  {
    id: 'flotante',
    name: 'Flotante',
    use: 'menús, popovers y avisos',
    rule: 'filete y sombra de contacto',
  },
  {
    id: 'hoja',
    name: 'Hoja',
    use: 'superficies que nacen de un borde',
    rule: 'entra desde su origen, no aparece al centro',
  },
  {
    id: 'modal',
    name: 'Modal',
    use: 'interrupciones que exigen decisión',
    rule: 'velo, foco atrapado y salida evidente',
  },
] as const;

export const MOTION_TOKENS = [
  {
    name: 'Instante',
    value: '90ms',
    token: '--fs-instant',
    use: 'presionar y soltar',
  },
  {
    name: 'Rápido',
    value: '140ms',
    token: '--fs-quick',
    use: 'foco, hover y control',
  },
  {
    name: 'Puente',
    value: '200ms',
    token: '--fs-bridge',
    use: 'cambio de plano',
  },
  {
    name: 'Revelar',
    value: '280ms',
    token: '--fs-reveal',
    use: 'contenido contextual',
  },
  {
    name: 'Trazo',
    value: '520ms',
    token: '--fs-trace',
    use: 'dibujar un resultado',
  },
  {
    name: 'Pulso',
    value: '1400ms',
    token: '--fs-pulse',
    use: 'espera y proceso',
  },
] as const;

export const EASINGS = [
  {
    name: 'Salida',
    token: '--fs-ease',
    value: 'cubic-bezier(.2,.8,.2,1)',
    use: 'casi todo',
  },
  {
    name: 'Entrada',
    token: '--fs-ease-in',
    value: 'cubic-bezier(.5,0,.75,0)',
    use: 'algo que se va',
  },
  {
    name: 'Firme',
    token: '--fs-ease-firm',
    value: 'cubic-bezier(.65,0,.35,1)',
    use: 'estados y conmutadores',
  },
] as const;

export const MOTION_DEMOS = [
  {
    id: 'llegar',
    label: 'Llegar',
    note: 'entrada desde su origen',
    rule: 'Un panel entra desde el borde que lo generó, nunca desde el centro.',
  },
  {
    id: 'conectar',
    label: 'Conectar',
    note: 'relación entre superficies',
    rule: 'La línea de relación se dibuja antes de que aparezca el detalle.',
  },
  {
    id: 'confirmar',
    label: 'Confirmar',
    note: 'estado guardado',
    rule: 'La confirmación ocupa el lugar del control, no una esquina lejana.',
  },
  {
    id: 'comparar',
    label: 'Comparar',
    note: 'dos revisiones',
    rule: 'La comparación mantiene ejes y escala; solo cambia el trazo.',
  },
  {
    id: 'deshacer',
    label: 'Deshacer',
    note: 'volver sin castigo',
    rule: 'Deshacer devuelve la geometría por el mismo camino que la trajo.',
  },
  {
    id: 'esperar',
    label: 'Esperar',
    note: 'proceso en curso',
    rule: 'La espera muestra avance real o dice que no puede estimarlo.',
  },
] as const;

export type MotionDemoId = (typeof MOTION_DEMOS)[number]['id'];

export const TYPE_SCALE = [
  {
    role: 'Display',
    size: 'clamp(46px, 7vw, 108px)',
    line: '0.94',
    use: 'una idea que abre',
  },
  {
    role: 'Título',
    size: 'clamp(28px, 3.4vw, 44px)',
    line: '1.08',
    use: 'el tema de la sección',
  },
  {
    role: 'Subtítulo',
    size: '20px',
    line: '1.3',
    use: 'la promesa del bloque',
  },
  {
    role: 'Lectura',
    size: '16px',
    line: '1.55',
    use: 'el párrafo que acompaña',
  },
  { role: 'Interfaz', size: '14px', line: '1.4', use: 'controles y listas' },
  {
    role: 'Dato',
    size: '12.5px',
    line: '1.35',
    use: 'mono: unidad, versión, coordenada',
  },
  {
    role: 'Etiqueta',
    size: '10.5px',
    line: '1.2',
    use: 'mono en mayúsculas, 0.14em',
  },
] as const;

export const NUMBER_RULES = [
  { rule: 'La unidad viaja con el número', good: '248.2 kN', bad: '248.2' },
  { rule: 'El signo es información', good: '−12.4 kN·m', bad: '12.4 kN·m' },
  { rule: 'La precisión no se infla', good: '3.47 mm', bad: '3.4700000 mm' },
  { rule: 'La escala se declara', good: 'Δ ×120', bad: 'deformada' },
  {
    rule: 'La versión acompaña al resultado',
    good: 'v4 · 23/05',
    bad: 'actual',
  },
] as const;

/** Voz: cuatro principios, y su consecuencia práctica. */
export const VOICE_PRINCIPLES = [
  {
    id: 'estado',
    title: 'Primero el estado',
    body: 'Antes de explicar una función se dice si está disponible, es experimental o está planeada.',
  },
  {
    id: 'limite',
    title: 'El límite es parte del dato',
    body: 'Un número llega con unidad, método y supuesto. Un resultado sin límites no está terminado.',
  },
  {
    id: 'accion',
    title: 'Una frase, una acción',
    body: 'La etiqueta dice qué va a pasar. Si la acción es destructiva, lo dice antes de ocurrir.',
  },
  {
    id: 'persona',
    title: 'La persona decide',
    body: 'El producto propone, calcula y explica. La responsabilidad técnica sigue siendo de quien firma.',
  },
] as const;

/** Reescrituras: la izquierda promete, la derecha se puede sostener. */
export const VOICE_REWRITES = [
  {
    id: 'certificado',
    context: 'Resultado de análisis',
    before: 'Análisis certificado y listo para construcción.',
    after:
      'Análisis lineal resuelto. Requiere revisión profesional antes de usarse en obra.',
    why: 'Ninguna puerta del repositorio certifica un resultado ni autoriza una obra.',
  },
  {
    id: 'exacto',
    context: 'Precisión',
    before: 'Cálculo exacto con precisión garantizada.',
    after:
      'Equilibrio verificado con tolerancia 1e-6. El modelo y sus hipótesis siguen siendo tuyos.',
    why: 'La exactitud depende del modelo, no del motor.',
  },
  {
    id: 'error',
    context: 'Error de modelo',
    before: 'Ocurrió un error inesperado.',
    after:
      'El nudo B4 no tiene apoyo ni continuidad: la estructura es un mecanismo. Revisa B4.',
    why: 'Un error debe nombrar el objeto y la siguiente acción.',
  },
  {
    id: 'vacio',
    context: 'Estado vacío',
    before: 'No hay datos disponibles.',
    after:
      'Todavía no hay resultados. Analiza el modelo para ver reacciones y diagramas.',
    why: 'Un vacío explica qué falta y ofrece la acción que lo llena.',
  },
  {
    id: 'ia',
    context: 'Asistencia',
    before: 'La IA optimizó tu estructura automáticamente.',
    after:
      'Propuesta de asistencia: reducir IPE 300 a IPE 270 en 4 miembros. Revisa y confirma.',
    why: 'La asistencia propone; ejecutar sin confirmación oculta la decisión.',
  },
  {
    id: 'destructivo',
    context: 'Acción destructiva',
    before: '¿Continuar?',
    after:
      'Eliminar 12 miembros y sus cargas. Se puede deshacer en esta sesión.',
    why: 'Antes de destruir se dice qué se pierde y si hay regreso.',
  },
  {
    id: 'planeado',
    context: 'Módulo futuro',
    before: 'Presupuestos integrados con tu modelo.',
    after:
      'Cantidades y costos: planeado. Hoy no existe medición derivada del modelo.',
    why: 'Una intención no se escribe en presente.',
  },
  {
    id: 'norma',
    context: 'Normativa',
    before: 'Cumple con la norma aplicable.',
    after:
      'Se evaluó fluencia por tensión axial. Faltan pandeo, aplastamiento y ruptura neta.',
    why: 'Cumplir se demuestra estado límite por estado límite.',
  },
] as const;

export const MICROCOPY = [
  {
    id: 'botones',
    group: 'Botones',
    items: [
      {
        label: 'Analizar',
        note: 'la acción principal nombra el verbo del dominio',
      },
      {
        label: 'Comparar revisiones',
        note: 'el objeto aparece cuando hay más de uno posible',
      },
      { label: 'Guardar versión local', note: 'dice dónde queda' },
      { label: 'Eliminar 12 miembros', note: 'lo destructivo cuenta cuánto' },
    ],
  },
  {
    id: 'estados',
    group: 'Estados vacíos',
    items: [
      { label: 'Sin resultados todavía', note: 'temporal, no negativo' },
      {
        label: 'Analiza para ver diagramas',
        note: 'la salida está en la misma frase',
      },
      {
        label: 'Este proyecto no tiene cargas',
        note: 'nombra el objeto que falta',
      },
      { label: 'Importación DXF parcial', note: 'declara el alcance real' },
    ],
  },
  {
    id: 'avisos',
    group: 'Avisos',
    items: [
      {
        label: 'Revisa la unidad de la carga',
        note: 'la revisión es una tarea, no un regaño',
      },
      {
        label: 'Resultado desactualizado respecto al modelo',
        note: 'relación, no alarma',
      },
      {
        label: 'Solver 3D: dominio experimental',
        note: 'el estado precede al contenido',
      },
      {
        label: 'Sin conexión: guardado local',
        note: 'confirma que no se perdió nada',
      },
    ],
  },
] as const;

export const GLOSSARY = [
  {
    term: 'Modelo',
    meaning: 'la representación editable: nudos, miembros, apoyos y cargas.',
  },
  {
    term: 'Resultado',
    meaning: 'lo derivado de un análisis; se versiona, no se edita.',
  },
  {
    term: 'Procedencia',
    meaning: 'de qué modelo, motor, versión y supuestos nació un dato.',
  },
  {
    term: 'Revisión',
    meaning: 'un estado congelado del proyecto que se puede comparar.',
  },
  {
    term: 'Traza',
    meaning: 'el camino visible entre entrada, método y conclusión.',
  },
  {
    term: 'Puerta',
    meaning:
      'la comprobación mínima que un módulo debe pasar para cambiar de estado.',
  },
] as const;

export const APPLICATIONS = [
  {
    id: 'icono',
    title: 'Icono de aplicación',
    note: 'Ménsula en negativo sobre carbón. El brazo de señal es el único color.',
  },
  {
    id: 'memoria',
    title: 'Portada de memoria',
    note: 'Marca, proyecto, revisión y estado en la misma línea de lectura.',
  },
  {
    id: 'social',
    title: 'Tarjeta social',
    note: 'Una idea, un diagrama y el estado del producto. Nunca una promesa.',
  },
  {
    id: 'terminal',
    title: 'Banner de consola',
    note: 'La marca también existe en monoespaciado: versión, motor y tolerancia.',
  },
] as const;

export const HANDOFF_CHECKS = [
  'El color usado explica una relación del dominio.',
  'El estado (Disponible, Experimental, Planeado) aparece antes que la promesa.',
  'Cada número lleva unidad, signo y precisión declarada.',
  'La animación se puede apagar sin perder información.',
  'El foco es visible con teclado en día y en noche.',
  'El glifo distingue la herramienta incluso sin color.',
] as const;
