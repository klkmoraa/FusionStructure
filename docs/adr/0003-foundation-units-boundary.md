# ADR 0003: Foundation neutral para identidades y conversiones de unidades

- Estado: Aceptada
- Fecha: 2026-09-03
- Baseline: `8f008c8e6dfefea2b7787053648276e1178793e0`

## Contexto

Los identificadores de unidades, la gramática de unidades personalizadas y los
factores de conversión eran usados por persistencia 2D, Space 3D y superficies
de presentación, pero vivían junto con etiquetas y selectores 2D en
`src/engine/units.ts`. Esa ubicación permitía que contratos de datos neutrales
dependieran de una capa de presentación y hacía difícil imponer el límite de
Foundation establecido por ADR 0001.

## Decisión

`src/foundation/units.ts` es la fuente pública neutral de:

- los 14 identificadores integrados, sus tipos y su orden persistido;
- cantidades físicas, identidades canónicas fuerza/longitud y factores;
- creación, parseo y validación de IDs `custom:`;
- conversiones desde y hacia los valores canónicos internos.

El módulo no importa nada, ni siquiera tipos. Una prueba de frontera rechaza
cualquier `import`, incluido `import type`, para impedir dependencias hacia
`types`, engine, app, UI, stores, comandos, Space 3D, resultados o PDF.

`src/engine/units.ts` conserva únicamente política de presentación 2D:
etiquetas, perfiles y opciones del selector, `unitLabel`,
`unitSystemLabel`, `formatDisplay` y `ALL_UNIT_LABELS`. Sus reexports de API
neutral están anotados `@deprecated`; sirven a integraciones externas durante
la transición, pero el código interno debe importar contratos neutrales desde
Foundation directamente.

## Persistencia y compatibilidad

No se modifica ninguna versión de esquema. Se conservan exactamente los 14 IDs
y su orden, los cuatro perfiles históricos con factores especiales, la
gramática y normalización de nombres personalizados, el límite de 64
caracteres, el percent-encoding y el fallback histórico a `kN-m` para un valor
de sistema inválido en conversión.

La normalización de proyectos 2D y el codec/validador de Space 3D usan el
mismo validador neutral. La persistencia sigue almacenando el ID de unidad tal
cual; no se reescribe un proyecto ni se introduce una migración de datos. La
cobertura de migración verifica que un ID personalizado válido sobrevive la
normalización de un esquema heredado.

## Consecuencias

Foundation puede ser consumida por modelos y persistencia sin arrastrar
presentación 2D. Las etiquetas siguen siendo una decisión de superficie y no
son una fuente de verdad para conversiones. Esta extracción no cambia el
solver, unidades internas, resultados ni la madurez experimental de Solver 2D
o Space 3D.

## Rollback

El cambio se revierte como una sola unidad de commit. Mientras exista el
rollback, los reexports deprecados de `engine/units` y de `types` preservan
imports externos. Tras revertir, se deben ejecutar las pruebas de unidades y
de migración para confirmar que los IDs persistidos y los factores históricos
continúan intactos; no hay datos de usuario que migrar o deshacer.
