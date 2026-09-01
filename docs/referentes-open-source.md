# Referentes, repositorios y fronteras de reutilización

Este documento convierte la investigación de productos AEC en decisiones de ingeniería para FusionStructure. No es un inventario de dependencias ni una autorización para copiar código. Cada candidato se evaluó por capacidad real, licencia, actividad pública, lenguaje, costo de integración y utilidad como motor, adaptador, oráculo o referente de interacción.

Fecha de corte: 2026-08-31. La actividad y las versiones cambian; hay que volver a verificarlas antes de adoptar una dependencia.

## Cómo leer la recomendación

| Decisión | Significado |
|---|---|
| **Integrar** | Candidato acotado, con licencia y frontera técnica inicialmente compatibles; todavía requiere prototipo, notices y pruebas. |
| **Motor aislado** | Ejecutar mediante worker, CLI o servicio con contrato versionado; no convertir su modelo en el esquema canónico. |
| **Conector** | Intercambiar snapshots con una aplicación externa mediante API, complemento o formato documentado. |
| **Oráculo** | Comparar casos de prueba y resultados; no usarlo como única evidencia de exactitud. |
| **Estudiar interfaz** | Aprender del flujo y la representación sin copiar código, recursos ni identidad visual. |
| **No adoptar** | Licencia, madurez, alcance o dependencia comercial impiden recomendarlo ahora. |

La licencia MIT de FusionStructure no vuelve compatibles automáticamente las licencias de terceros. GPL/AGPL y licencias de investigación permanecen fuera del bundle principal salvo una decisión jurídica y de producto explícita. LGPL, CDDL y excepciones de enlace requieren una revisión por componente. Esto es una regla de arquitectura, no asesoría legal.

## Selección priorizada

| Frente | Primera selección | Uso recomendado ahora |
|---|---|---|
| Solver 2D/3D | [PyNite](https://github.com/JWock82/PyNite), [Frame3DD](https://github.com/hpgavin/frame3dd), [anaStruct](https://github.com/anastruct/anaStruct) | PyNite como oráculo automatizable; Frame3DD como CLI externo; anaStruct como referencia pedagógica. |
| Diseño de secciones y materiales | [StructuralCodes](https://github.com/fib-international/structuralcodes), [concrete-properties](https://github.com/robbievanleeuwen/concrete-properties), [section-properties](https://github.com/robbievanleeuwen/section-properties) | Prototipo Python aislado para reglas, fibras y propiedades; resultados siempre versionados e inconclusos mientras falten estados límite. |
| FEA | [CALFEM](https://github.com/CALFEM/calfem-python), [MFEM](https://github.com/mfem/mfem) | CALFEM para enseñanza y fixtures; MFEM sólo después de patch tests y perfilado de un caso A03 concreto. |
| CAD y geometría | [OCCT](https://github.com/Open-Cascade-SAS/OCCT), [CadQuery](https://github.com/CadQuery/cadquery), [rhino3dm](https://github.com/mcneel/rhino3dm) | Motor geométrico nativo aislado, generación reproducible y adaptador 3DM permisivo. |
| BIM/openBIM | [IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell), [xBIM](https://github.com/xBimTeam/XbimEssentials), [Speckle](https://github.com/specklesystems/speckle-server) | IFC/BCF/IDS y 4D/5D detrás de adaptadores; Speckle como conector/referente de revisión, auditando licencias por paquete. |
| Terreno/GIS | [GDAL](https://github.com/OSGeo/gdal), [PROJ](https://github.com/OSGeo/PROJ), [PDAL](https://github.com/PDAL/PDAL) | Workers para formatos, CRS y nubes de puntos con versión, driver, grids y precisión registrados. |
| Agua y drenaje | [EPANET](https://github.com/OpenWaterAnalytics/EPANET), [SWMM](https://github.com/USEPA/Stormwater-Management-Model), [WNTR](https://github.com/USEPA/WNTR) | EPANET y SWMM como motores separados; WNTR como laboratorio de escenarios y oráculo de posproceso. |
| Costos, programa y campo | [IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell), [TaskJuggler](https://github.com/taskjuggler/TaskJuggler), [QField](https://github.com/opengisch/QField) | Esquema propio de APU/CPM; oráculos externos; patrones offline y vínculos IFC sin copiar aplicaciones copyleft. |
| Investigación reproducible | [JupyterLab](https://github.com/jupyterlab/jupyterlab), [Quarto](https://github.com/quarto-dev/quarto-cli), [DVC](https://github.com/treeverse/dvc) | Notebook ligado a snapshot, publicación técnica reproducible y versionado opcional de datos/artefactos. |

## Matriz de estructuras, diseño y FEA

| Candidato | Licencia / stack | Capacidad útil | Encaje FusionStructure | Decisión |
|---|---|---|---|---|
| [OpenSees](https://github.com/OpenSees/OpenSees) | Licencia propia UC Regents; C++/C/Fortran/Tcl/Python | Análisis lineal/no lineal, estático/dinámico, fibras, marcos, shells y sólidos. No es open source OSI para uso comercial general. | `FS-A01/A02/A03`, análisis avanzado | **Oráculo** educativo/investigación; no usar código sin licencia expresa. |
| [PyNite](https://github.com/JWock82/PyNite) | MIT; Python | FEA estructural 3D elástico, P-Delta, modal, marcos, placas, muros, mallas y combinaciones. | `FS-A01/A02` | **Oráculo** inmediato; evaluar **motor aislado** tras equivalencia. |
| [Frame3DD](https://github.com/hpgavin/frame3dd) | GPL-3.0; C | Marcos/armaduras 2D y 3D, rigidez geométrica, estático, modos y condensación. | `FS-A01/A02` | **Oráculo CLI**; no incorporar código GPL al cliente MIT. |
| [anaStruct](https://github.com/anastruct/anaStruct) | LGPL-3.0; Python/Cython | Vigas, armaduras y marcos 2D, N/V/M, desplazamientos, resortes y combinaciones. | `FS-A01`, Aula | **Oráculo** y patrón de API pedagógica. |
| [CALFEM for Python](https://github.com/CALFEM/calfem-python) | MIT; Python | Rutinas elementales, ensamblaje, condiciones de frontera, malla y visualización educativa. | `FS-A01/A03`, Aula | **Adaptar** fixtures y trazas; worker opcional. |
| [XC](https://github.com/xcfem/xc) | GPL-3.0; C++/Python/Fortran | FEA 0D–3D, no lineal, fibras, fases y verificadores normativos en progreso. | `FS-A01/A02/A03/A04` | **Oráculo**; estudiar separación solver/normativa. |
| [IndeterminateBeam](https://github.com/JesseBonanno/IndeterminateBeam) | MIT; Python | Vigas hiperestáticas, Timoshenko, apoyos elásticos, diagramas y flujo educativo. | `FS-A01`, `FS-L01` | **Adaptar** patrones de interacción y reportes, conservando pruebas propias. |
| [Edubeam](https://github.com/janvorisek/edubeam) | GPL-3.0; Vue/TypeScript | Vigas, marcos y armaduras 2D; matrices, GDL, condensación y resultados visibles. | `FS-A01`, `FS-L01` | **Estudiar interfaz**; no copiar código. |
| [Osdag](https://github.com/osdag-admin/Osdag) | Referencias LGPL/GPL inconsistentes; Python | Diseño/detallado de acero conforme IS 800, optimización, CAD y reportes. | `FS-A04/M03` | **Estudiar interfaz**; no trasladar reglas IS ni código hasta aclarar licencia. |
| [StructuralCodes](https://github.com/fib-international/structuralcodes) | Apache-2.0; Python | Materiales, constitutivas, secciones y verificaciones fib/Eurocódigo; cobertura aún incompleta. | `FS-A04` | **Motor experimental** y patrón de reglas por norma/edición. |
| [concrete-properties](https://github.com/robbievanleeuwen/concrete-properties) | MIT; Python | Secciones de concreto reforzado, fisuración, momento-curvatura e interacción M-N biaxial. | `FS-A04`, Concreto reforzado | **Motor aislado/oráculo** de sección con hipótesis y estados de fibras. |
| [section-properties](https://github.com/robbievanleeuwen/section-properties) | MIT; Python | Propiedades geométricas, torsión/alabeo, plasticidad y esfuerzos de secciones arbitrarias. | `FS-A01/A02/A04` | **Motor aislado** de propiedades con malla y tolerancia registradas. |
| [fkit](https://github.com/wcfrobert/fkit) | MIT; Python | Modelos de fibras, momento-curvatura, P-M e inercia fisurada. | `FS-A04`, Aula | **Oráculo** y patrón de trazabilidad por fibra; validar mantenimiento y cobertura. |
| [MFEM](https://github.com/mfem/mfem) | BSD-3-Clause; C++ | FEM de alto orden, adaptatividad, paralelismo y GPU. No incluye el producto estructural final. | `FS-A03` | Candidato a **motor nativo** sólo después de un prototipo acotado. |
| [FEniCSx / DOLFINx](https://github.com/FEniCS/dolfinx) | LGPL-3.0+; C++/Python | Formas variacionales, PDE/FEM, MPI/PETSc y soluciones científicas. | `FS-A03`, laboratorio | **Oráculo/laboratorio**; no frontera única de producción. |
| [deal.II](https://github.com/dealii/dealii) | Apache-2.0 con excepción LLVM o LGPL; C++ | FEM adaptativo, hp-refinement y tutoriales reproducibles. | `FS-A03` | **Estudiar arquitectura/oráculo**; auditar licencias por archivo antes de integrar. |
| [CalculiX](https://github.com/Dhondtguido/CalculiX) | GPL-2.0+; Fortran/C | FEA estructural/térmico 3D, beams/shells/solids y batch similar a Abaqus. | `FS-A03` | **Oráculo externo** de mallas/campos. |
| [Kratos Multiphysics](https://github.com/KratosMultiphysics/Kratos) | Núcleo BSD con licencias por aplicación; C++/Python | Framework multiphysics, sólidos/shells/beams, dinámica, contacto y remallado. | `FS-A02/A03` | **Estudiar arquitectura**; no adoptar sin una aplicación y licencia concretas. |

## Matriz de CAD, BIM, GIS y agua

| Candidato | Licencia / stack | Capacidad útil | Encaje FusionStructure | Decisión |
|---|---|---|---|---|
| [FreeCAD](https://github.com/FreeCAD/FreeCAD) | LGPL-2.1; C++/Python | CAD paramétrico, TechDraw, FEM/CAM, Python y múltiples formatos. | `FS-M01/M02/M03` | **Oráculo** de árbol paramétrico y recompute; no forkear la aplicación completa. |
| [OCCT](https://github.com/Open-Cascade-SAS/OCCT) | LGPL-2.1 con excepción OCCT; C++ | Kernel B-Rep/NURBS, booleanas, healing, teselación, STEP/IGES. | `FS-M01/M03` | **Motor nativo aislado**; revisar enlace, notices y distribución. |
| [LibreCAD](https://github.com/LibreCAD/LibreCAD) | GPL-2.0; C++/Qt | CAD 2D, capas, bloques, cotas, snapping y DXF. | `FS-M01` | **Oráculo/estudiar interfaz**; no usar código. |
| [SolveSpace](https://github.com/solvespace/solvespace) | GPL-3.0+; C++ | Restricciones 2D/3D, sketches, mecanismos, sólidos y dibujo técnico. | `FS-M01/M03` | **Estudiar** UX de restricciones/GDL; no usar código ni WASM GPL. |
| [CadQuery](https://github.com/CadQuery/cadquery) | Apache-2.0; Python sobre OCCT | CAD paramétrico code-first, features, assemblies y STEP/STL/SVG/DXF. | `FS-M01/M03` | **Motor aislado** para generación y fixtures geométricos. |
| [rhino3dm](https://github.com/mcneel/rhino3dm) | MIT; C++/.NET/Python/JS/WASM | Lectura/escritura 3DM, NURBS, B-Reps, mallas, capas y atributos sin Rhino. | `FS-M01/M02/I01` | **Integrar** como adaptador, con tabla de pérdidas. |
| [IfcOpenShell core](https://github.com/IfcOpenShell/IfcOpenShell) | LGPL-3.0+; C++/Python | IFC 2x3/4/4.3, geometría, conversión, diff, clash, BCF, IDS, 4D y 5D. | `FS-M02/I01/P02/P03` | **Motor openBIM aislado**; Bonsai GPL sólo como referente. |
| [xBIM Essentials](https://github.com/xBimTeam/XbimEssentials) | CDDL-1.0; C#/.NET | Lectura/escritura, consultas y validación IFC; geometría en paquetes adicionales. | `FS-M02/I01` | Alternativa de **worker .NET**; revisar CDDL y cobertura IFC4x3. |
| [xeokit](https://github.com/xeokit/xeokit-sdk) | AGPL-3.0 o comercial; JavaScript/WebGL | Viewer BIM web, selección, secciones, árbol, BCF y point clouds. | `FS-M02/C01` | **Estudiar interfaz**; no incorporar AGPL sin cambiar estrategia. |
| [QGIS](https://github.com/qgis/QGIS) | GPL-2.0+; C++/Python | GIS vector/raster, CRS, edición, geoprocesamiento, 3D, cartografía y plugins. | `FS-C01/C03/I01` | **Oráculo** y aplicación externa; interoperar por formatos/OGC. |
| [GDAL](https://github.com/OSGeo/gdal) | MIT/X; C++/Python/C | Lectura, traducción y escritura de cientos de formatos geoespaciales. | `FS-C01/C03/I01` | **Motor aislado**; registrar driver, versión y capacidad read/write. |
| [PROJ](https://github.com/OSGeo/PROJ) | MIT/X; C++/C/Python | CRS, datum, transformaciones, pipelines, grids y operaciones dependientes de época. | `FS-C01/I01` | **Motor** de coordenadas; guardar pipeline, época, grids y precisión. |
| [PDAL](https://github.com/PDAL/PDAL) | BSD; C++ | Pipelines de nubes de puntos, LAS/LAZ/COPC/E57, filtros y reproyección. | `FS-C01/I01` | **Motor** para LiDAR con procedencia y escala/offset explícitos. |
| [QField](https://github.com/opengisch/QField) | GPL-2.0+; C++/QML | Campo móvil offline, GNSS, formularios, fotos, GeoPackage y sincronización. | `FS-C01/P03` | **Estudiar interfaz/oráculo**; interoperar por paquetes, no incrustar. |
| [EPANET](https://github.com/OpenWaterAnalytics/EPANET) | MIT; C | Redes presurizadas, periodo extendido, bombas, válvulas, energía y calidad. | `FS-C03` | **Motor** de abastecimiento; fijar versión y comparar con ejemplos EPA 2.2. |
| [SWMM](https://github.com/USEPA/Stormwater-Management-Model) | Dominio público EE. UU.; C | Lluvia-escurrimiento, subcuencas, LID, drenaje y calidad. | `FS-C03` | **Motor separado** de drenaje; no mezclar su semántica con EPANET. |
| [WNTR](https://github.com/USEPA/WNTR) | BSD-3-Clause; Python | Escenarios, fugas, daños, resiliencia, criticidad, GIS e interfaces EPANET. | `FS-C03/L03` | **Laboratorio/oráculo**; etiquetar `EpanetSimulator` vs `WNTRSimulator`. |
| [epanet-js-toolkit](https://github.com/epanet-js/epanet-js-toolkit) | MIT; TypeScript + C/WASM | Bindings browser/Node al motor OWA EPANET; versiones pre-1.0 beta. | `FS-C03` | **Prototipo WASM experimental** comparado contra el motor C fijado. |

## Matriz de documentos, costos, programa, campo e investigación

| Candidato | Licencia / stack | Capacidad útil y límite | Encaje | Decisión |
|---|---|---|---|---|
| [Speckle Server](https://github.com/specklesystems/speckle-server) | Apache-2.0 por defecto, excepciones por paquete; TypeScript/Vue | Hub AEC, federación, historial, diff y comentarios; no es EDMS ni APU mexicano. | `FS-P01/I01` | **Conector** y referente principal de revisión ligada al modelo. |
| [OpenProject](https://github.com/opf/openproject) | GPL-3.0 + add-ons Enterprise; Ruby/TypeScript | Trabajo colaborativo, dependencias, Gantt, costos, documentos y BIM; no demuestra 4D/campo offline completo. | `FS-P01/P03` | **Servicio externo por API** y referente de colaboración. |
| [ERPNext](https://github.com/frappe/erpnext) | GPL-3.0; Python/JS/TS | Proyectos, compras, inventario, costos reales y facturación; no APU constructivo ni CPM especializado. | `FS-P02/P03` | **Integrar como ERP externo**, no como núcleo. |
| [TaskJuggler](https://github.com/taskjuggler/TaskJuggler) | GPL-2.0; Ruby | Proyecto como código, scheduler, recursos, calendarios, escenarios, costos y riesgos. | `FS-P03/L03` | **Oráculo CLI** de CPM/nivelación; no copiar motor. |
| [GanttProject](https://github.com/bardsoftware/ganttproject) | GPL-3.0; Java/Kotlin | WBS, dependencias, líneas base, Gantt/PERT, recursos y costos básicos. | `FS-P03/L04` | **Estudiar interfaz/oráculo** docente. |
| [ProjectLibre](https://sourceforge.net/projects/projectlibre/) | CPAL-1.0; Java | Gantt, red, WBS, recursos, histogramas y EVM. | `FS-P03/L04` | **Oráculo docente**; revisar atribución CPAL. |
| [Mayan EDMS](https://gitlab.com/mayan-edms/mayan-edms) | GPL-2.0; Python/Django | Versiones, OCR, metadata, workflows, permisos, auditoría y API; no revisión AEC gráfica. | `FS-P01` | **Servicio DMS externo**; estudiar contratos de versión/estado. |
| [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | GPL-3.0; Python/TypeScript | Ingesta, OCR, tags, búsqueda y archivo; no RFI/submittal/comparación. | `FS-P01` | **Estudiar** ingestión y ofrecer exportación compatible. |
| [Documenso](https://github.com/documenso/documenso) | AGPL-3.0/open-core; TypeScript | Firma/aprobación de PDF, roles, orden, plantillas y API. | `FS-P01` | **Conector por API**; no incorporar código AGPL. |
| [JupyterLab](https://github.com/jupyterlab/jupyterlab) | BSD-3-Clause; TypeScript/Python | Notebooks, editor, terminal y outputs ricos; no congela por sí solo el entorno ni los datos. | `FS-L02/L03/L04` | **Integrar** exportación/apertura de notebook ligada a snapshot. |
| [Quarto](https://github.com/quarto-dev/quarto-cli) | MIT; JS/TS/Lua | Publicación científica desde Markdown/Jupyter/R/Julia, citas, ecuaciones y referencias cruzadas. | `FS-P01/L02/L03` | **Integrar** como generador reproducible de protocolos y reportes. |
| [DVC](https://github.com/treeverse/dvc) | Apache-2.0; Python | Versionado de datos/artefactos, DAG, parámetros, métricas y reproducción. | `FS-L02/L03` | **Perfil avanzado opcional**, no requisito del alumno inicial. |

## Productos propietarios o no reutilizables que sí debemos estudiar

| Producto | Qué conviene estudiar | Papel en FusionStructure |
|---|---|---|
| [FTOOL](https://portal.ftool.com.br/sobre/) | Edición directa de marcos 2D y lectura rápida de N/V/M/deformada. | Referente pedagógico y oráculo manual de `FS-A01`; no se encontró un repo abierto autorizado para integrar. |
| [ETABS](https://www.csiamerica.com/products/etabs) / SAP2000 | Modelo de edificio, tablas, diafragmas, masa, análisis y diseño por norma. | Referente profesional/oráculo; futuro conector por API o archivos, nunca dependencia silenciosa. |
| [AutoCAD](https://www.autodesk.com/products/autocad/overview) | Comandos, capas, bloques, layouts, precisión, .NET y Automation APIs. | `FS-M01/I01`; add-in/APS/DXF detrás de snapshot y diff. |
| [Revit](https://www.autodesk.com/products/revit/features) | Identidad, familias, parámetros, transacciones, regeneración y relación físico-analítica. | `FS-M02/I01`; complemento C# + IFC/APS. |
| [Rhino/Grasshopper](https://www.rhino3d.com/) | NURBS, previews, grafo paramétrico y recibos de transformación. | `FS-M01/I01`; RhinoCommon/Compute/3DM como conectores opcionales. |
| [OPUS](https://opus.com.mx/) | APU, explosión de insumos, FSR, costo horario, indirectos, programa, ruta crítica y control. | Referente mexicano de `FS-P02/P03`; no copiar catálogos, código ni reportes. |
| [Neodata](https://neodata.mx/precios-unitarios) | APU, generadores, licitaciones, FASAR/indirectos y vínculos AutoCAD/Revit/Archicad. | Referente mexicano de `FS-P02`; importador sólo con formato/API documentados. |
| [Primavera P6](https://www.oracle.com/construction-engineering/primavera-p6/) | WBS, calendarios, recursos, escenarios y control de programas grandes. | Oráculo de `FS-P03`; ninguna alternativa abierta evaluada lo reemplaza por sí sola. |

## Contrato común antes de integrar un repositorio

Todo experimento de integración debe declarar:

1. entidad de proyecto que lee o modifica;
2. licencia exacta por paquete, código modificado y notices;
3. snapshot de entrada, unidades, CRS/ejes, opciones, versión y checksum;
4. resultado derivado, diagnóstico, advertencias y tabla de pérdidas;
5. diff previo a confirmar y checkpoint reversible;
6. fixture, oráculo, tolerancia y causa de rechazo;
7. estrategia de actualización o eliminación de la dependencia.

La prioridad no es “tener la mayor cantidad de repos”. Es usar pocas piezas con una frontera demostrable y mantener la capacidad de comparar, sustituir y explicar.
