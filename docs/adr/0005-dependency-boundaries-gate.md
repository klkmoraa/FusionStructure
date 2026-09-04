# ADR 0005: Puerta ejecutable de dependencias de producto

- Estado: Aceptada experimental
- Fecha: 2026-09-04
- Alcance: Fase 3 de la migración multirepo

## Contexto

La separación 2D/3D no puede depender de una revisión manual de imports. El
monolito seguirá existiendo durante varias fases y los commits posteriores
podrían reintroducir una dependencia hacia `src/types`, `src/engine` o el
store 2D aunque el workspace 3D continúe compilando.

## Decisión

`migration/dependency-boundaries.json` declara reglas pequeñas y auditables.
`scripts/check-dependency-boundaries.mjs` usa el AST local de TypeScript para
inspeccionar imports estáticos, type-only, reexports, `import()`, `require()` e
`import = require`. Resuelve sólo módulos locales dentro del repositorio; los
paquetes externos no forman parte de esta frontera. Un import dinámico o
`require` cuyo specifier no sea literal falla cerrado con `FSDEP-001`.

En Fase 3 se comprueban dos superficies:

1. `src/space3d/**` y `src/features/space3d/**` no pueden alcanzar internals
   2D (`src/types.ts`, `src/engine`, stores, workers, canvas/resultados 2D ni
   el formateador 2D).
2. `src/integrations/planar2dToSpace3d.ts` sólo puede importar las fachadas
   explícitas `src/solver2d/public.ts` y `src/space3d/public.ts`.

La regla se ejecuta como `npm run architecture:check`; sus pruebas negativas
se ejecutan como `npm run architecture:test`. Ambos comandos forman parte de
`npm run check` y por tanto se convierten en una condición del gate de CI al
cerrar la fase.

No se pretende declarar aislado todo el monolito todavía. El portal, el shell
2D, i18n, design system y la plataforma se mantienen en una lista de trabajo
posterior porque hoy son superficies mixtas. La ausencia de diagnósticos en
esta puerta sólo prueba la frontera cubierta, no una extracción física ni una
API estable.

## Manifiesto de rutas

`migration/path-manifest.yml` deja de usar los nombres obsoletos
`fusionstructure-solver-2d` y `fusionstructure-solver-3d`: las rutas se asignan
a `fstructure`, `fusionstructure-space3d`, `fusionstructure-web` o
`fusionstructure-foundation`. Las entradas nuevas posteriores al baseline se
marcan `planned`; los archivos mixtos de bienvenida se enumeran por archivo y
conservan `platform-assembly` como dueño hasta la extracción del portal.
`src/runtime` se asigna a `fstructure` porque sus handlers y protocolo son del
worker 2D, no una plataforma neutral.

## Consecuencias y límites

La puerta añade un chequeo determinista y barato sin imponer una dependencia
de `dependency-cruiser` ni resolver código en ejecución. No detecta imports
construidos por concatenación fuera de llamadas reconocibles, alias remotos o
acoplamiento semántico a través de un contrato compartido; esas revisiones
siguen siendo parte del review de cada fase. Las excepciones futuras deberán
registrar dueño, motivo y tarea de retirada en el JSON, nunca ocultarse en el
script.
