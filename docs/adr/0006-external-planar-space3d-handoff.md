# ADR 0006: Handoff externo del modelo plano a Space 3D

- Estado: Aceptada experimental
- Fecha: 2026-09-04
- Alcance: Fase 3 de la migración multirepo

## Contexto

Space 3D necesita abrir una propuesta derivada de un proyecto 2D, pero la
superficie 3D no debe importar el store, el solver ni el modelo raíz de 2D.
Pasar `sourceProject` directamente desde `App` hacía que el ensamblador React
fuera también dueño de la integración y dejaba una dependencia de producto
dentro del dominio espacial.

## Decisión

`src/integrations/planar2dToSpace3d.ts` es un adaptador unidireccional y sin
estado. Recibe un snapshot `ProjectModel` a través de `src/solver2d/public.ts`
y construye una propuesta versionada `Planar2DToSpace3DHandoffV1` mediante la
fachada `src/space3d/public.ts`. La propuesta contiene:

- candidato espacial, mapeos por entidad y procedencia del adaptador;
- un `lossReport` con clasificación, campo, entidad y si la diferencia bloquea
  el análisis; y
- una referencia determinista `solver2d:<id>:fnv1a-32:<hash>` del snapshot.

El fingerprint FNV-1a de 32 bits es una identidad determinista de esta
propuesta experimental, no una prueba criptográfica de integridad ni una
firma de archivo. Cuando el formato común publique su digest criptográfico,
la versión del handoff deberá cambiar y migrarse explícitamente; no se puede
reinterpretar silenciosamente este valor como SHA-256.

La entrada 2D prepara la propuesta, la muestra en el diálogo y sólo la entrega
al workspace después de confirmar. Cancelar devuelve una decisión serializable
de cancelación y nunca muta ni persiste el candidato. El workspace persiste su
propia copia espacial bajo un namespace derivado del ID fuente; el proyecto 2D
permanece intacto. El interruptor
`VITE_FUSION_EXTERNAL_2D_TO_3D_HANDOFF=false` permite rollback durante una
release y abre Space 3D independiente sin entregar una propuesta.

## Pérdidas y límites

Los valores que 2D no contiene (`G`, `Iy`, `J` y restricciones fuera del plano)
quedan incompletos y bloquean el análisis. Semánticas sin equivalente (cargas
en barra, liberaciones, apoyos inclinados, etc.) se enumeran como omitidas y
requieren reconocimiento explícito. El adaptador no deduce propiedades ni
pretende equivalencia estructural profesional.

La presentación numérica de Space 3D vive temporalmente en
`features/space3d/space3dNumberFormat.ts`; así la UI extraíble no importa el
formateador interno de 2D. Esa política se consolidará en un paquete neutral
en una fase posterior.

## Consecuencias y rollback

La regla de frontera puede comprobar que `src/space3d/**` y la superficie 3D
no importan `src/types`, `src/engine` ni un store 2D. La integración queda
aislada y puede sustituirse por un handoff de archivo cuando existan los
repositorios independientes. El rollback operativo es desactivar el flag; el
rollback de código es revertir este cambio sin migrar proyectos persistidos.
