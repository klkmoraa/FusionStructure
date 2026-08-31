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
| Documentación técnica | Disponible | memoria PDF, anexos, diagramas, procedimiento, materiales, expediente portable y vista previa |
| Interoperabilidad actual | Disponible | JSON de proyecto, SVG, PNG, CSV, enlaces compartibles e importación DXF ASCII de un subconjunto |
| Biblioteca personal | Disponible | secciones, vistas, favoritos y preferencias locales |
| PWA y trabajo offline | Disponible | shell PWA, almacenamiento local y aviso controlado de actualización |
| Space 3D | Experimental | marco espacial elástico lineal separado, con limitaciones explícitas frente al dominio 2D |
| Asistencia local | Experimental | propuestas de comandos locales; no debe ocultar ni ejecutar acciones ambiguas sin confirmación |

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
