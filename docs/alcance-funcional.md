# Alcance funcional

Este documento separa el estado verificable del código de la dirección de producto. “Disponible” significa que existe una ruta identificable en el repositorio; no significa certificación, cobertura completa ni preparación para obra.

## Leyenda

| Estado | Significado |
|---|---|
| Disponible | implementación utilizable dentro del alcance actual |
| Experimental | implementación parcial, dominio aislado o validación todavía insuficiente |
| Planeado | objetivo aprobado para una fase futura |
| No comprometido | idea que no entra hasta investigar y definir contratos |

## Núcleo actual

| Área | Estado | Alcance |
|---|---|---|
| Proyecto local | Disponible | proyecto, configuración, unidades, persistencia local, recuperación, versiones y cambios reversibles |
| Modelo estructural 2D | Disponible | nudos, miembros, geometría, apoyos, propiedades, cargas nodales y de miembro, casos y combinaciones |
| Edición geométrica | Disponible | selección, edición numérica, movimiento, snapping, selección múltiple, división, reparación topológica, copiar/pegar y deshacer/rehacer |
| Generación estructural | Disponible | familias de vigas, voladizos, pórticos y escenas parametrizadas con revisión antes de aplicar |
| Análisis estructural | Disponible | solución lineal, P-Delta, diagramas N-V-M, deformada, reacciones, envolventes, líneas de influencia, pandeo y estudios modales |
| Calidad del resultado | Disponible | auditoría de cargas, diagnósticos, certificado numérico limitado, fiabilidad y trazabilidad del resultado |
| Métodos educativos | Disponible | métodos seleccionables, ejercicios, guías, progreso y traza educativa bajo demanda |
| Diseño por materiales | Experimental | un único componente inconcluso de fluencia de sección total para acero en tensión axial; no cubre diseño integral de acero ni concreto |
| Documentación técnica | Disponible | memoria PDF, anexos, diagramas, procedimiento, materiales, expediente portable y vista previa |
| Interoperabilidad actual | Disponible | JSON de proyecto, SVG, PNG, CSV, enlaces compartibles e importación DXF ASCII de un subconjunto |
| Biblioteca personal | Disponible | secciones, vistas, favoritos y preferencias locales |
| PWA y trabajo offline | Disponible | shell PWA, almacenamiento local y aviso controlado de actualización |
| Space 3D | Experimental | marco espacial elástico lineal separado, con limitaciones explícitas frente al dominio 2D |
| Asistencia local | Experimental | propuestas de comandos locales; no debe ocultar ni ejecutar acciones ambiguas sin confirmación |

### Unidades de presentación

El solver mantiene sus magnitudes internas en kN, m y rad. El proyecto puede elegir perfiles estándar (N, kN, MN, gf, kgf, t, lb o kip combinados con mm, cm, m, km, in, ft o yd) y crear un perfil personalizado con nombre propio, por ejemplo `T/M`. La selección se conserva en `settings.units`, se valida al importar y se aplica también a edición, canvas, resultados, biblioteca y memoria PDF; cambiarla no convierte ni muta los valores base del modelo.

## Mapa de superficies

La nomenclatura propuesta evita usar nombres de proveedores como si fueran módulos propios:

- `FS-A01 Solver 2D` — Disponible;
- `FS-A02 Solver 3D` — Experimental y separado;
- `FS-A03 Elementos finitos` — Planeado;
- `FS-A04 Diseño por materiales` — Experimental; sólo existe un check parcial de acero y el resto permanece planeado;
- `FS-M01 Dibujo CAD`, `FS-M02 Modelo BIM`, `FS-M03 Detallado` — Planeados;
- `FS-C01 Terreno`, `FS-C02 Geotecnia`, `FS-C03 Agua y drenaje` — Planeados;
- `FS-P01 Documentos`, `FS-P02 Cantidades y costos`, `FS-P03 Programa y campo` — Planeados;
- `FS-I01 Conectores` — Planeado; los formatos actuales son una base, no conectores completos de Revit o AutoCAD.
- `FS-L01 Aula estructural` — Disponible;
- `FS-L02 Taller de investigación`, `FS-L03 Laboratorio reproducible` y `FS-L04 Tutoría y trayectoria` — Planeados.

El detalle de capacidades y mejoras está en [Catálogo de herramientas](catalogo-herramientas.md).

## Capacidades que deben crecer desde el núcleo

### Arquitectura y diseño espacial

**Planeado:** muros, pisos, cubiertas, puertas, ventanas, espacios, niveles, ejes, vistas, anotaciones, láminas y relaciones entre modelo físico y representación documental.

Criterio: la geometría arquitectónica no debe ser una imagen independiente; debe poder relacionarse con elementos, espacios, fases y entregables.

### Ingeniería estructural

**Planeado:** diseño y comprobación de acero, concreto reforzado, mampostería, madera y cimentaciones; combinaciones normativas configurables; liberaciones, resortes, asentamientos, cargas de barra avanzadas, dinámica y no linealidad cuando cada dominio tenga validación propia.

Criterio: cada código o norma debe entrar como paquete versionado, con hipótesis, unidades, límites de aplicación y casos de prueba.

### Ingeniería civil, terreno e infraestructura

**Planeado:** topografía, superficies, alineamientos, perfiles, corredores, movimiento de tierras, redes de agua y drenaje, hidrología, hidráulica, pavimentos, georreferencia y cantidades.

Criterio: separar sistema de coordenadas, unidades, precisión geométrica y fuente de datos; no tratar un dibujo plano como sustituto de un modelo geoespacial.

### Instalaciones y coordinación interdisciplinaria

**Planeado:** sistemas MEP, rutas, equipos, zonas, interferencias, reservas, reglas de coordinación, incidencias y vistas federadas.

Criterio: toda coordinación debe poder señalar objeto, ubicación, versión, responsable, estado y evidencia.

### Documentos, revisión y control

**Planeado:** hojas, cajetines, índices, especificaciones, control de revisiones, comparación visual, comentarios, incidencias, RFI, submittals, aprobaciones, paquetes de entrega y PDF con anotaciones trazables.

Criterio: el documento debe conservar relación con la vista y la versión del modelo que lo produjo.

### Cantidades, costos y adquisiciones

**Planeado:** mediciones, partidas, catálogos, precios, desperdicios, presupuesto, comparativos, órdenes, proveedores, compras y vínculo entre cantidad, elemento y revisión.

Criterio: una cantidad manual debe distinguirse de una cantidad derivada del modelo y ambas deben poder auditarse.

### Planeación, ejecución y campo

**Planeado:** WBS, actividades, dependencias, ruta crítica, recursos, riesgos, avances, reportes diarios, checklists, seguridad, fotografías, incidencias, cambios, inspecciones y as-built.

Criterio: móvil y offline desde el diseño del módulo, con sincronización explícita y resolución de conflictos.

### Operación y mantenimiento

**Planeado:** entrega de activos, inventario, garantías, mantenimiento, inspecciones, historial de cambios y conexión entre activo construido y documentación vigente.

Criterio: esta fase depende de que la identidad y las revisiones del proyecto sean confiables desde el inicio.

### Conectores y aplicaciones externas

**Planeado:** adaptadores de Revit, AutoCAD, IFC/BCF/IDS y otras aplicaciones con snapshot, mapeo, unidades, coordenadas, validación, vista previa de diferencias, confirmación, procedencia y checkpoint reversible.

Criterio: un conector nunca modifica el proyecto silenciosamente ni presenta compatibilidad bidireccional antes de probar identidad, pérdida de datos, idempotencia y versiones soportadas. Véase [Arquitectura de conectores](arquitectura-conectores.md).

### Aprendizaje e investigación

**Disponible:** Aula estructural sobre el mismo modelo y análisis 2D, con ejercicios guiados, predicción, procedimiento, comparación y conclusión.

**Planeado:** protocolo de investigación, laboratorio reproducible, datasets y ejecuciones versionadas, referencias, tutorías, acuerdos, hitos y evidencias vinculadas al proyecto.

Criterio: la herramienta debe hacer visible el razonamiento y la reproducción; no resolver silenciosamente la tarea, inventar fuentes ni convertir progreso decorativo en evidencia. Véase [Ruta académica](ruta-academica.md).

## No comprometido todavía

No se debe anunciar como parte del producto terminado:

- BIM completo con todos los dominios y niveles de detalle;
- cumplimiento automático de cualquier norma;
- planos ejecutivos o documentos con validez profesional automática;
- colaboración multiusuario sin resolver permisos y conflictos;
- cálculo de cualquier tipo de estructura, instalación o infraestructura;
- reemplazo inmediato de software especializado de autoría, análisis, costos o programación;
- generación automática de decisiones de ingeniería sin revisión humana.

## Contrato para cada módulo futuro

Antes de incorporar una superficie al producto, debe responder:

1. ¿Qué entidades agrega o modifica?
2. ¿Qué unidad, sistema de coordenadas y precisión usa?
3. ¿Qué comando reversible representa cada cambio?
4. ¿Qué validaciones bloquean una entrada inválida?
5. ¿Cómo se guarda y versiona?
6. ¿Cómo se importa y exporta?
7. ¿Qué resultado es derivado y cómo se invalida?
8. ¿Qué evidencia y procedencia conserva?
9. ¿Qué pruebas mínimas demuestran el comportamiento?
10. ¿Qué límites aparecen al usuario?

## Prioridad de producto

La amplitud futura no debe desplazar la confiabilidad del núcleo. El orden recomendado es:

1. identidad del proyecto, esquema y versiones;
2. núcleo estructural verificable;
3. documentación y coordinación;
4. arquitectura e interoperabilidad;
5. civil, cantidades, costos y planeación;
6. campo, operación y automatización avanzada.
