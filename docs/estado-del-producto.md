# Estado del producto

## Fotografía

- Fecha de revisión: 2026-08-31.
- Rama revisada: `main`.
- Commit revisado antes de esta actualización: `c2fe725`.
- Versión declarada en `package.json`: `0.8.2`.
- El repositorio es privado y su código se encuentra en una etapa experimental.
- No se presenta el concepto ni la implementación como tecnología patentada, certificada, propietaria o lista para obra.
- Esta fotografía se obtuvo leyendo el árbol y los archivos del repositorio. La ejecución de la aplicación en un navegador y la puerta de CI deben considerarse verificaciones separadas.

## Lo que existe en el repositorio

La estructura actual muestra un producto con un núcleo técnico real, no únicamente una maqueta:

- `src/engine/`: solver, unidades, diagramas, P-Delta, influencia, pandeo, modal, envolventes, auditoría y confiabilidad;
- `src/analysis-methods/`: métodos de solución y registro de aplicabilidad;
- `src/data/`, `src/commands/` y `src/store/`: modelo, operaciones, comandos, historial y contextos;
- `src/features/`: lienzo, inspector, resultados, biblioteca, generadores, Aula, memoria, importación, revisiones, proyecto y Space 3D;
- `src/space3d/`: modelo, almacenamiento, worker, solver y vista 3D separados;
- `src/workers/`: análisis y estudios fuera del hilo principal;
- `src/storage/`: repositorio local de proyectos y versiones;
- `public/assets/structural/`: ilustraciones estructurales prerenderizadas;
- `scripts/`: build, PWA, ReportLab y render de assets;
- `.github/workflows/ci.yml`: integración continua para la puerta definida por el proyecto.

La superficie actual es suficiente para hablar de una herramienta estructural experimental con aprendizaje y expediente técnico. No es suficiente para hablar de una plataforma AEC completa.

## Riesgos actuales

### 1. Cobertura numérica todavía pequeña

La documentación existente registra 19 archivos de prueba y 73 pruebas automatizadas. Eso puede proteger fronteras de datos importantes, pero no demuestra la corrección general del solver, de Space 3D, de la memoria PDF ni de todos los flujos de interfaz.

Prioridad: construir una suite numérica independiente con casos manuales, oráculos externos, invariantes de equilibrio, unidades y regresiones por dominio.

### 2. QA de navegador incompleto

La puerta de lint, tipos, pruebas y build es necesaria, pero no cubre todo lo que ocurre al usar el producto: selección, touch, importación, exportación, diálogos, estados vacíos, PWA y diferencias entre temas.

Prioridad: añadir smoke tests de navegador y recorridos críticos antes de ampliar la superficie.

### 3. Space 3D debe permanecer aislado

El dominio espacial tiene su propio modelo y runtime, pero su alcance es menor que el de un producto general de análisis 3D. Debe conservar sus límites visibles y no compartir supuestos 2D por conveniencia.

Prioridad: definir contratos 3D, casos de validación y criterios para ampliar cargas, liberaciones, materiales, dinámica y resultados.

### 4. Interoperabilidad todavía parcial

La importación DXF actual es un subconjunto; JSON, SVG, PNG, CSV y PDF cubren intercambio inicial, no un flujo BIM completo. La hoja de ruta debe priorizar un modelo abierto y adaptadores verificables antes de prometer coordinación interdisciplinaria.

### 5. El modelo común aún debe crecer

El núcleo conoce muy bien entidades estructurales, pero todavía no representa con la misma profundidad contexto, arquitectura, civil, instalaciones, costos, programa, incidencias o activos.

Prioridad: diseñar el esquema extensible antes de añadir pantallas independientes.

## Decisión de esta actualización

Esta actualización establece:

- FusionStructure como producto único con visión todo-en-uno;
- una separación explícita entre estado actual y dirección futura;
- documentación canónica para alcance, visión, investigación y hoja de ruta;
- ausencia deliberada de áreas de código protegidas;
- estado experimental visible y límites técnicos;
- imágenes conceptuales como material de alineación, no como especificaciones de interfaz;
- se mantiene la fundación del sistema visual; los estilos nuevos permanecen
  en las superficies que los necesitan;
- las referencias de StructureCo y CopiaWeb se tomaron de clones directos de GitHub,
  no de sus carpetas locales; el árbol base de FusionStructure coincidía con
  `klkmoraa/FusionStructure` en `c2fe725` antes de implementar cambios;
- las superficies lazy del workspace tienen un límite de error local con recarga,
  para que un chunk fallido no oculte el resto del proyecto;
- el apoyo se coloca mediante un popover explícito y conserva las definiciones
  existentes de resorte, prescripción y apoyo personalizado;
- ACM usa una representación analítica dentro del lienzo en tamaños compactos y
  conserva la hoja exterior en escritorio. Es una decisión de presentación:
  no cambia el esquema persistente ni convierte los resultados en entradas.
- las propuestas del asistente local pasan por un contrato cerrado, con unidades
  admitidas explícitas, diagnóstico con ruta y preparación sobre una copia del
  proyecto; la confirmación vuelve a comprobar la huella antes de ejecutar;
  esto no agrega un proveedor remoto ni cambia la persistencia.
- el asistente local es alcanzable desde la consola persistente y la paleta de
  comandos, con una acción revisable antes de aplicar cualquier cambio;
  conserva retorno de foco y una frontera de carga recuperable.
- el preset de capas `Todas` es distinto del estado inicial de modelado y activa
  explícitamente las nueve capas; el chrome visible del canvas conserva el modo
  y la escala en escritorio.
- el chrome móvil reserva la esquina del lanzador de capas, mantiene rieles y
  botones táctiles legibles, compacta el panel de capas y libera la contención
  de pintura sólo mientras ese panel está abierto para no quedar bajo Resultados.
- el ajuste de cámara sanea reservas, límites, viewport e insets no finitos;
  un evento de click nunca entra al cálculo geométrico como dato numérico.
- el generador de estructuras se trata como una superficie temporal: al
  cancelarlo o terminarlo, el riel vuelve a `Seleccionar` y no deja activa una
  herramienta de edición que ya no tiene destino.

## Siguiente trabajo recomendado

1. mantener el núcleo estructural y sus datos con pruebas independientes;
2. definir el esquema de proyecto común y sus contratos de extensión;
3. establecer versiones, procedencia, conflictos y migraciones como capacidades de plataforma;
4. crear la primera superficie documental y de coordinación conectada al modelo;
5. decidir el primer módulo arquitectónico o civil que consuma el mismo proyecto;
6. automatizar recorridos de navegador y pruebas de exportación;
7. no ampliar el marketing del producto hasta que cada capacidad anunciada tenga evidencia.
