# ADR 0004: Foundation neutral para álgebra lineal

- Estado: Aceptada
- Fecha: 2026-09-03
- Baseline: `6b16f15147fb6f12580ce74a9b44a7826191ad2c`

## Contexto

Las primitivas de matrices, la factorización LU, la ruta híbrida sparse LDLT,
las tolerancias y las métricas de resolución compartían `src/engine/math.ts`
con el producto 2D. Space3D las consumía desde esa ruta, por lo que una
capacidad numérica neutral podía arrastrar el engine del otro producto y sus
mensajes de análisis.

## Decisión

`src/foundation/linearAlgebra.ts` es el punto público neutral para:

- matrices y vectores (`zeros`, `transpose`, `multiply`, ensamblaje y cortes);
- factorización reutilizable y resolución directa/transpuesta;
- política dense/sparse, diagnósticos exclusivamente numéricos y tolerancias
  publicadas; y
- `LinearAlgebraError`, con códigos estables para dimensiones, valores no
  finitos y singularidad, incluido el índice de pivote cuando aplica.

El módulo no importa nada, ni siquiera tipos. No conoce nodos, miembros,
grados de libertad, P-Delta, resultados de análisis, persistencia, UI, stores
ni `src/types`. Las pruebas de frontera rechazan import estático, `import type`,
`import()`, `require`, reexports e import-equals.

Se conserva la política previa: umbral sparse de 60, eliminación de ecuaciones
de una variable, reordenamiento RCM, límite de fill, LDLT sin pivote, fallback
LU con pivotaje parcial escalado, estimación de Hager y refinamiento iterativo.
LDLT sólo se intenta cuando la matriz es numéricamente simétrica con tolerancia
relativa a cada par de entradas, sin un piso absoluto fijo; una matriz no
simétrica usa LU denso con el motivo
`non-symmetric`, por lo que su solve transpuesta nunca reutiliza una solve
sólo válida para una matriz simétrica.

`factorizeLinearSystem` valida y copia profundamente la matriz antes de elegir
la ruta. La factorización conserva ese snapshot: mutar después las filas del
llamador no altera ni `solve` ni `solveTranspose`. Las operaciones públicas que
requieren forma rectangular o longitud de vector compatible rechazan entradas
inválidas con `LinearAlgebraError` clasificado, en vez de propagar `NaN` o
`undefined`.

`src/engine/math.ts` queda como adaptador de compatibilidad marcado
`@deprecated`. Reexporta la API histórica y traduce los errores neutros a los
mensajes históricos 2D; no contiene algoritmos. El código interno 2D y
Space3D importa Foundation directamente. El tipo raíz `src/types.ts` reexporta
los tipos numéricos de forma deprecada para no romper consumidores externos.

## Traducción de productos

El solver 2D traduce `LinearAlgebraError` al texto histórico y conserva el
orden de rechazo, la detección de mecanismo y la asociación del pivote a un
nodo candidato. Space3D convierte singularidad y valores no finitos en sus
issues existentes; los demás códigos siguen siendo fallos de programación y
se relanzan.

La frontera de Space3D prohíbe dependencias hacia `src/engine` y `src/types`
en todos sus archivos. El antiguo `space3d/data/bridge2d.ts` ya no es una
excepción: el puente vive en `src/integrations/planar2dToSpace3d.ts` y sólo
alcanza las fachadas públicas `src/solver2d/public.ts` y `src/space3d/public.ts`.

## Persistencia y compatibilidad

No cambia ningún esquema, codec, ID persistido, perfil, corpus, manifiesto ni
normalización EOL. La extracción no reescribe proyectos ni introduce una
migración silenciosa. Las operaciones puras conservan su no mutación; los dos
helpers de ensamblaje que históricamente mutan su destino continúan haciéndolo.

## Consecuencias y rollback

Foundation puede servir a 2D y Space3D sin una dependencia entre productos. El
adaptador mantiene los imports externos durante la transición, pero las pruebas
impiden nuevos consumidores internos. El rollback es un único commit: restaura
la implementación anterior de `engine/math.ts` y sus imports; no requiere
migrar ni deshacer datos de usuario.
