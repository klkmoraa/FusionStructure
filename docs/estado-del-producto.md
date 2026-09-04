# Estado del producto

## Fotografía

- Fecha de revisión: 2026-09-04.
- Rama revisada: `main`.
- Commit revisado: `48c3b84d3cab12a003b8c95fdb59d1149a2adc28`.
- Versión declarada en `package.json`: `0.8.2`.
- El repositorio es público y su código se encuentra en una etapa experimental.
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
- `public/assets/landing/` y `public/assets/tool-mockups/`: dirección visual de la portada y mockups conceptuales; no son evidencia de implementación;
- `scripts/`: build, PWA, ReportLab y render de assets;
- `.github/workflows/ci.yml`: integración continua para la puerta definida por el proyecto.

La superficie actual es suficiente para hablar de una herramienta estructural experimental con aprendizaje y expediente técnico. No es suficiente para hablar de una plataforma AEC completa.

## Riesgos actuales

### 1. Cobertura numérica todavía pequeña

La puerta actual cubre 48 archivos de prueba y 290 pruebas automatizadas en el monolito. Eso protege fronteras importantes, pero no demuestra la corrección general del solver, de Space 3D, de la memoria PDF ni de todos los flujos de interfaz.

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

## Corte multirepo 2026-09-04

La primera ola ya está publicada y protegida en GitHub: Foundation (`v0.1.1`, con `v0.1.0` conservado como corte inicial), FStructure (`v0.1.0`), Space3D (`v0.1.0`) y Web (`v0.1.0`). Este repositorio conserva el monolito de corte, la matriz de compatibilidad, los ADRs y la evidencia. Los corpus 2D/3D no se eliminaron ni se sustituyeron por una afirmación de equivalencia.

El gate local completo pasó en cada extracción. La protección de `main` exige PR, una aprobación, revisión obsoleta descartada, aprobación del último push, conversaciones resueltas, historial lineal y sin force-push/deletion. Los nuevos repositorios aún no tienen workflow de CI en su tip publicado porque el token OAuth disponible no permite escribir workflows; instalar esos workflows con una credencial autorizada es la siguiente decisión operativa.

## Decisión de esta actualización

Esta actualización establece:

- FusionStructure como producto único con visión todo-en-uno;
- una separación explícita entre estado actual y dirección futura;
- documentación canónica para alcance, visión, investigación y hoja de ruta;
- ausencia deliberada de áreas de código protegidas;
- estado experimental visible y límites técnicos;
- imágenes conceptuales como material de alineación, no como especificaciones de interfaz;
- una landing principal editorial, sin controles internos de los solvers, que presenta las seis familias del producto como una visión integrada y conserva una nota discreta sobre las superficies aún en evolución;
- una bienvenida propia del Solver 2D con proyecto actual, nuevo proyecto, importación, aula, plantillas y pórticos recientes antes de abrir el canvas;
- una bienvenida propia y separada del Solver 3D experimental antes de abrir su espacio de trabajo;
- rutas de superficie persistentes en la URL para que un refresco conserve la portada, la bienvenida o el workspace activo sin forzar el canvas 2D;
- un atlas provisional de dieciocho superficies (`FS-Axx`, `FS-Mxx`, `FS-Cxx`, `FS-Pxx`, `FS-Ixx`, `FS-Lxx`) con mockups conceptuales y límites visibles;
- `FS-A04 Diseño por materiales` visible como experimental porque sólo existe un check parcial de acero, sin presentar el concreto planeado como implementado;
- `FS-L01 Aula estructural` reconocido como disponible y una ruta planeada para investigación reproducible y tutoría basada en evidencia;
- una matriz de repositorios que separa integración, motor aislado, conector, oráculo y referencia de interfaz según licencia y alcance;
- el contrato planeado de `FS-I01 Conectores` para Revit, AutoCAD, openBIM y futuros adaptadores, sin afirmar compatibilidad que no existe;
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
