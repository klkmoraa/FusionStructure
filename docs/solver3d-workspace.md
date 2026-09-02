# Solver 3D · superficie de trabajo

La interfaz 2026.09 reorganiza el módulo experimental alrededor del lienzo. No cambia `Space3DProjectV1`, el solver, el worker, la persistencia ni el puente 2D: sólo añade un modelo de comandos de interfaz y adaptadores de resultados para la escena.

## Estado de capacidades

- **Disponible:** seleccionar, crear y editar nudos, barras, apoyos como restricciones nodales, cargas nodales, deshacer/rehacer, importar/exportar el expediente portable y analizar un caso o combinación.
- **Experimental:** el solver espacial lineal, la deformada amplificada y las lecturas 3D de N, V, M y reacciones. N/V/M usan acciones de extremo ya calculadas; no son diagramas continuos.
- **Planeado:** biblioteca de secciones, cargas distribuidas y comprobaciones de diseño. Se localizan en `Más`, deshabilitadas y con estado visible.
- **No comprometido:** dimensionamiento normativo, certificación, modelo físico de perfiles y preparación para obra.

## Contratos operativos

- **Entidad modificada:** proyecto espacial, nudo, barra o carga; el apoyo modifica las restricciones del nudo.
- **Validación:** las mismas reglas puras de `src/space3d/model/validation.ts` y `src/space3d/data/commands.ts`.
- **Deshacer:** los comandos existentes conservan snapshots; cambiar vista, capa o modo de resultado no modifica el proyecto.
- **Guardado:** el proyecto continúa en el namespace local existente y conserva schema v1; no requiere migración.
- **Exportación:** permanece el expediente portable actual. El modo visual seleccionado no se exporta como dato estructural.
- **Pruebas:** `space3dWorkspaceModel.test.ts` fija modos y estados; `sceneModel.test.ts` impide publicar resultados obsoletos y prueba el mapeo de acciones reales.

La geometría visible de las barras tiene espesor analítico dependiente del encuadre. No representa una sección física ni sustituye las propiedades A/I/J del modelo.
