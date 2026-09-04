# ADR 0001: Límites de producto para una migración multi-repositorio

- Estado: Aceptada
- Fecha: 2026-09-03
- Baseline: `c1824c016e163cf22652565ea486f3a1c0928c5b`

## Contexto

FusionStructure sigue siendo un monolito experimental. El producto contiene un Solver 2D disponible, un Solver 3D experimental, una superficie web de plataforma y capacidades planeadas. El audit original observó un repositorio privado y respuestas HTTP 403 al consultar protección de rama y rulesets; ese hecho permanece inmutable en `migration/github-governance.json` como procedencia histórica, no como estado actual.

El estado actual se registra por separado en `migration/github-governance-current.json`: el repositorio es público y `main` tiene protección de rama activa. Ese snapshot no autoriza por sí mismo una separación. Antes de cualquier extracción física se debe ejecutar `npm run migration:verify-governance`, que consulta GitHub en vivo y falla cerrado si no puede obtener la evidencia actual. Esta decisión fija límites verificables sin mover código, alterar comportamiento ni presentar una separación futura como ya implementada.

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
- Un registro estático de gobernanza describe una observación; no concede permiso para crear, publicar o separar repositorios. La única evidencia de gobernanza que puede habilitar el preflight de una separación es la salida recién obtenida de `npm run migration:verify-governance`.
- El gate vivo consulta los endpoints de repositorio, protección de `main`, rulesets, el último workflow CI de `main` y el artefacto de revisión independiente. No usa valores simulados y falla si `gh` no está disponible o autenticado.
- Una afirmación numérica requiere fixtures independientes, tolerancias explícitas, versión de algoritmo y pruebas reproducibles.
- `Disponible`, `Experimental`, `Planeado` y `No comprometido` permanecen distintos. Una interfaz o inventario pulido no prueba implementación, certificación ni preparación para obra.
- Los resultados derivados siguen siendo artefactos versionados ligados a entradas exactas.
- Toda extracción debe conservar compatibilidad, pruebas y trazabilidad antes de cambiar ownership físico.

## Prohibición explícita sobre CAD

El canvas estructural actual pertenece al producto Solver 2D: conoce nodos, barras, apoyos, cargas, selección y resultados estructurales. No se extraerá ni renombrará como producto CAD. La tarjeta o concepto CAD de la plataforma permanece `Planeado` hasta que exista un dominio propio, contratos, persistencia, validación, reversión, exportación y pruebas independientes. Reutilizar primitivas visuales en el futuro requerirá un límite neutral probado; no autoriza mover el canvas actual.

## Consecuencias

La Fase 0 es aditiva. No crea ni publica repositorios de producto, no cambia algoritmos ni comportamiento y no simula protección. La regla histórica de no dividir mientras protección/rulesets eran inaccesibles aplica al audit que la originó, no reemplaza la comprobación actual. Las extracciones posteriores quedan condicionadas a una comprobación viva satisfactoria, builds independientes, equivalencia de corpus y criterios explícitos de madurez.

La protección actual conserva `enforceAdmins:false` por una excepción explícita de repositorio con propietario único. Por ello el gate no la presenta como no eludible; expone el bypass y sus controles compensatorios. El alcance, el tradeoff y el criterio para retirar esa excepción se fijan en ADR 0002.
