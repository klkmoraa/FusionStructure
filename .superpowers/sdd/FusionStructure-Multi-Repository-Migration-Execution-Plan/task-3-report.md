# Task 3 — corpus directo de compatibilidad Space3D

## Alcance y estado

Space3D queda documentado como `Experimental`. Se añadió el manifiesto posterior a la evidencia congelada de Task 1 (`5955722`) y al corte de Task 2 (`94aa5cb`); ninguno de esos registros fue reescrito.

Unidades canónicas: `m`, `kN`, `kN·m`, `kN/m²`, `m²`, `m⁴`, `rad`, con el identificador de proyecto `kN-m`. Coordenadas globales: X y Z horizontales, Y hacia arriba. GDL nodales: `[ux, uy, uz, rx, ry, rz]`; en cada elemento primero I y después J. El eje local x va de I a J, `z = x × y`; `Iz` controla flexión local Y y `Iy` flexión local Z.

Identificadores declarados: esquema `fusionstructure-space3d-result/v1`, motor `fusionstructure-space3d`, algoritmo `space-frame-euler-bernoulli-linear-v1`. Tolerancias del corpus: absoluta `1e-9`, relativa `1e-8`, cerca de cero `1e-10`; equilibrio normalizado máximo `1e-7`. El serializador canónico normaliza finitos a 12 cifras significativas, convierte magnitudes `<=1e-12` a cero y ordena claves.

## Casos y oráculos

Los nueve casos disponibles viven en `src/space3d/compatibilityCorpus.ts` y son fábricas nuevas por ejecución:

| Caso | Oráculo independiente | Comprobaciones |
| --- | --- | --- |
| axial | `u=P L/(E A)` y equilibrio estático | desplazamiento, reacción y N |
| torsion | `rx=T L/(G J)` y equilibrio de momentos | giro, reacción y T |
| local-y-bending | `v=P L³/(3 E Iz)`, `rz=P L²/(2 E Iz)` | desplazamientos y reacción fija |
| local-z-bending | `w=P L³/(3 E Iy)`, `ry=-P L²/(2 E Iy)` | desplazamientos y reacción fija |
| oblique-member | rotación literal de la solución axial; N y deformación son invariantes | componentes globales y N |
| rigid-coordinate-rotation | invariancia de cuerpo rígido al rotar +90° alrededor de Z | magnitud, reacción y N |
| combination | superposición `0.5·10 + 2·4 = 13 kN` | desplazamiento, reacción y N |
| free-structure | comprobación independiente de seis modos rígidos sin restricciones | fallo `mechanism` y diagnóstico determinista |
| near-degenerate-orientation | razón perpendicular de la referencia respecto a X menor que `1e-8` | fallo `degenerate-orientation` |

El test directo también cubre coeficientes literales de la matriz 12×12, orientación diestra, códec estricto, rechazo fail-closed de un payload pre-v1, almacenamiento con backup y namespace, protocolo de worker, errores estructurados, paridad hilo principal/worker inline y cancelación real mediante `terminate()`. No existe migración automática de esquema Space3D: cambiar semántica sin una migración ejecutable sería inseguro y queda declarado como no comprometido.

## Disponible frente a no comprometido

El manifiesto marca como `unsupported` y `not-implemented`, sin asserts ni claims de implementación: releases, springs, member loads, diaphragms, dynamics, stability/buckling y nonlinear analysis. Progress events y cancelación cooperativa dentro del bucle numérico tampoco son contratos disponibles; la cancelación probada es terminación del worker y rechazo estable de la promesa. No se publicita exactitud normativa, certificación ni preparación para obra.

## TDD y sensibilidad a mutaciones

El primer test rojo falló porque faltaba `compatibilityCorpus.ts` (`ERR_MODULE_NOT_FOUND`). La implementación mínima llevó el corpus a verde. Un segundo ciclo rojo verificó que el manifiesto no aceptara hashes vacíos; después se fijaron los SHA-256 y volvió a verde. El test de sensibilidad modifica temporalmente la carga axial de 10 a 11 kN en memoria y exige que el resultado canónico cambie; la mutación no se guarda en archivos ni se incluye en el commit.

## Verificación

- Focal: `npm.cmd test -- src/space3d/compatibilityCorpus.test.ts --reporter verbose` — 11/11 tests pasan en el árbol final.
- Completa: `npm.cmd run check` — exit 0; lint con 3 warnings preexistentes (`src/engine/units.ts` no-control-regex x2 y `CanvasDiagramStack.tsx` Fast Refresh), typecheck correcto, 38 archivos/205 tests correctos, build Vite correcto. Persisten sólo warnings de chunks grandes del build.

## Archivos y self-review

- `src/space3d/compatibilityCorpus.ts`: casos, expectativas literales, tolerancias, invariantes y serializador canónico.
- `src/space3d/compatibilityCorpus.test.ts`: corpus de solver/element/orientación/códec/storage/worker y mutación.
- `migration/space3d-compatibility-manifest.json`: manifest post-baseline, digests, contratos runtime y claims experimentales.

Self-review: no se modificaron algoritmos numéricos ni contratos 2D; el corpus no depende del serializer `fusionstructure-2d-result/v2`; las expectativas se derivan de fórmulas/manuales independientes y no de helpers del solver. El riesgo restante es el alcance deliberadamente limitado del frame lineal Euler-Bernoulli y la ausencia de un Worker de módulo real en Vitest; la paridad se prueba por el mismo handler público y el cliente inline que el runtime usa como fallback.
