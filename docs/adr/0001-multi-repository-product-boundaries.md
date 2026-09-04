# ADR 0001: Límites de producto para una migración multi-repositorio

- Estado: Aceptada
- Fecha: 2026-09-03
- Baseline: `c1824c016e163cf22652565ea486f3a1c0928c5b`

## Contexto

FusionStructure sigue siendo un monolito experimental. El producto contiene un Solver 2D disponible, un Solver 3D experimental, una superficie web de plataforma y capacidades planeadas. La separación física todavía está bloqueada porque GitHub respondió HTTP 403 al consultar protección de rama y rulesets para este repositorio privado. Esta decisión fija límites verificables sin mover código, alterar comportamiento ni presentar una separación futura como ya implementada.

## Decisión

Solver 2D y Solver 3D son productos hermanos. Ninguno puede importar internals del otro. La plataforma web puede componerlos únicamente mediante sus límites públicos; la integración entre productos pertenece a adaptadores exteriores. Una futura Foundation será neutral y estará debajo de ambos productos, nunca encima ni dentro de uno de ellos.

Las direcciones permitidas son:

1. UI de producto → aplicación de producto → dominio/engine de producto → Foundation.
2. Shell web → contratos públicos o adaptadores de cada producto.
3. Adaptadores de integración → límites públicos 2D/3D y contratos neutrales de Foundation.

Están prohibidas las dependencias 2D → internals 3D, 3D → internals 2D, engine/modelo → UI y Foundation → app, UI, dominio de solver, store, commands, canvas o resultados específicos de producto.

## Admisión a Foundation

Una pieza sólo es candidata a Foundation cuando:

- tiene semántica neutral y estable, sin tipos ni mensajes específicos de 2D, 3D o la interfaz;
- declara unidades, conversiones, tolerancias y errores de forma explícita;
- tiene pruebas directas y consumidores mediante un API público estrecho;
- preserva datos y resultados existentes o aporta una migración probada;
- puede versionarse y publicarse sin importar código de producto;
- su evidencia demuestra comportamiento, no sólo similitud de nombres o planes.

La admisión se decide pieza por pieza. Una carpeta `foundation` planeada no convierte automáticamente su contenido en compartido ni estable.

## Política de evidencia

- El código ejecutable y sus pruebas tienen autoridad sobre planes y conversaciones.
- El corte de implementación es el commit y tag de baseline registrados en `migration/baseline.json`. El audit original sólo conserva procedencia histórica.
- Una afirmación numérica requiere fixtures independientes, tolerancias explícitas, versión de algoritmo y pruebas reproducibles.
- `Disponible`, `Experimental`, `Planeado` y `No comprometido` permanecen distintos. Una interfaz o inventario pulido no prueba implementación, certificación ni preparación para obra.
- Los resultados derivados siguen siendo artefactos versionados ligados a entradas exactas.
- Toda extracción debe conservar compatibilidad, pruebas y trazabilidad antes de cambiar ownership físico.

## Prohibición explícita sobre CAD

El canvas estructural actual pertenece al producto Solver 2D: conoce nodos, barras, apoyos, cargas, selección y resultados estructurales. No se extraerá ni renombrará como producto CAD. La tarjeta o concepto CAD de la plataforma permanece `Planeado` hasta que exista un dominio propio, contratos, persistencia, validación, reversión, exportación y pruebas independientes. Reutilizar primitivas visuales en el futuro requerirá un límite neutral probado; no autoriza mover el canvas actual.

## Consecuencias

La Fase 0 es aditiva. No crea ni publica repositorios de producto, no cambia algoritmos ni comportamiento y no simula protección. Mientras protección/rulesets sigan inaccesibles, rige la regla interina de no dividir el monolito. Las extracciones posteriores quedan condicionadas a protección efectiva, builds independientes, equivalencia de corpus y criterios explícitos de madurez.
