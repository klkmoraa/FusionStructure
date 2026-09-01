# Catálogo de herramientas

Este catálogo propone una nomenclatura estable para hablar de la plataforma sin confundir visión con implementación. Los nombres y códigos son una decisión de producto provisional; el estado de cada capacidad sigue dependiendo del código y de sus pruebas.

Fecha de corte: 2026-08-31.

## Familias

| Familia | Propósito |
|---|---|
| `FS-Axx` | análisis, solvers y comprobaciones |
| `FS-Mxx` | modelado, dibujo y detallado |
| `FS-Cxx` | terreno, civil y sistemas físicos |
| `FS-Pxx` | documentos, cantidades, costos, programa y campo |
| `FS-Ixx` | intercambio, conectores y automatización entre aplicaciones |
| `FS-Lxx` | aprendizaje, investigación y trayectoria basada en evidencia |

La familia no define un silo. Todos los módulos deberán leer y escribir entidades del mismo proyecto, con identidad, unidades, procedencia y revisiones explícitas.

## Resumen de estado

| Código | Herramienta | Estado | Superficie comparable que se estudió | Diferenciador exigido en FusionStructure |
|---|---|---|---|---|
| `FS-A01` | FStructure · Solver 2D | Disponible | ETABS, RFEM, OpenSees | cálculo explicable y trazable en el navegador |
| `FS-A02` | Solver 3D | Experimental | ETABS, RFEM, OpenSees | dominio separado hasta validar cobertura y oráculos |
| `FS-A03` | Elementos finitos | Planeado | Ansys Mechanical, SolidWorks Simulation, PLAXIS | convergencia, aplicabilidad y unidades visibles |
| `FS-A04` | Diseño por materiales | Experimental | ETABS, Osdag, StructuralCodes, concrete-properties | demanda, capacidad, norma y estados límite faltantes separados |
| `FS-M01` | Dibujo CAD | Planeado | AutoCAD, Rhino | geometría abierta vinculada al proyecto, no un lienzo aislado |
| `FS-M02` | Modelo BIM | Planeado | Revit, Archicad, Tekla Structures | relación física ↔ analítica y documentos derivados versionados |
| `FS-M03` | Detallado | Planeado | Tekla Structures, SolidWorks | continuidad de cálculo a fabricación y lista de materiales |
| `FS-C01` | Terreno | Planeado | Civil 3D, QGIS | coordenadas, fuente y precisión como datos de primer nivel |
| `FS-C02` | Geotecnia | Planeado | PLAXIS, GeoStudio | hipótesis constitutivas, drenaje y etapas visibles |
| `FS-C03` | Agua y drenaje | Planeado | EPANET, SWMM | balances y escenarios reproducibles con motores verificables |
| `FS-P01` | Documentos | Planeado | Bluebeam, Navisworks | cada incidencia apunta a objeto, vista y revisión |
| `FS-P02` | Cantidades y costos | Planeado | Neodata | distinguir medición derivada de captura manual |
| `FS-P03` | Programa y campo | Planeado | Primavera P6, Procore | vínculo WBS ↔ elemento ↔ costo ↔ evidencia de campo |
| `FS-I01` | Conectores | Planeado | APS, IFC/BCF/IDS, APIs de autoría | vista previa, diferencias, confirmación y checkpoint reversible |
| `FS-L01` | Aula estructural | Disponible | FTOOL, Edubeam, IndeterminateBeam | aprender sobre el mismo modelo y análisis, con predicción y contraste |
| `FS-L02` | Taller de investigación | Planeado | Quarto, gestores bibliográficos | decisiones, fuentes y evidencia ligadas a un protocolo versionado |
| `FS-L03` | Laboratorio reproducible | Planeado | JupyterLab, DVC | datos, parámetros, motor, versión, tolerancia y artefactos por ejecución |
| `FS-L04` | Tutoría y trayectoria | Planeado | LMS y gestores de tareas | acuerdos e hitos evaluados por evidencia, no por gamificación |

“Comparable” significa referente de investigación, no equivalencia, compatibilidad ni promesa de reemplazo.

## `FS-Axx` · Análisis

### `FS-A01` · FStructure · Solver 2D — Disponible

**Nombre del módulo:** FStructure. `Solver 2D` es su rol dentro de la familia; `FStructure` es cómo se llama en la interfaz, en la consola del editor y en su pantalla de inicio. No confundir con `FS-M01 · Dibujo CAD`, que es el módulo de planos.

**Puede hacer hoy:** modelar nudos y miembros, apoyos, propiedades, cargas, casos y combinaciones; resolver análisis lineal y P-Delta; presentar reacciones, deformada, diagramas N-V-M, envolventes, influencia, pandeo y estudios modales dentro del alcance documentado.

**Debe mejorar:** suite numérica independiente, más casos patológicos, contratos de signos y unidades, oráculos externos, accesibilidad de diagramas, comparación de revisiones y límites de aplicabilidad más visibles.

**Familia técnica recomendada:** conservar TypeScript para el dominio actual y sus comandos; medir antes de migrar. Para álgebra dispersa o estudios grandes, evaluar un núcleo Rust → WebAssembly aislado, con fixtures compartidos y equivalencia contra el motor vigente. No reescribir por moda.

**Puerta mínima:** equilibrio, compatibilidad, reacciones y desplazamientos contra casos manuales y un oráculo independiente; tolerancias y versión del motor registradas.

**Mockup:** [ver Solver 2D](../public/assets/tool-mockups/fs-a01-solver-2d.png).

### `FS-A02` · Solver 3D — Experimental

**Existe:** marco espacial elástico lineal en un dominio separado, con seis grados de libertad por nodo, cargas nodales y fuerzas de extremo. Su cobertura no es la del solver 2D.

**Debe mejorar:** transformaciones, liberaciones, resortes, cargas distribuidas, diafragmas, masa, dinámica, estabilidad, resultados y exportaciones propias. Nada se comparte con 2D sin un contrato explícito.

**Familia técnica recomendada:** TypeScript para el esquema y UI; worker dedicado; Rust/WASM candidato para matrices dispersas después de perfilar. Las pruebas deben correr contra los mismos vectores en ambos runtimes.

**Puerta mínima:** marcos espaciales con rotaciones rígidas, simetría, mecanismos y equilibrio 3D; rechazo determinista de modelos singulares.

**Mockup:** [ver Solver 3D](../public/assets/tool-mockups/fs-a02-solver-3d.png).

### `FS-A03` · Elementos finitos — Planeado

**Alcance propuesto:** mallas 2D/3D, materiales lineales y después no lineales, contactos, fronteras, etapas, adaptatividad, convergencia y campos de resultado. Las familias estructural, mecánica y geotécnica no deben fingirse como un solo modelo constitutivo.

**Familia técnica recomendada:** un servicio o worker numérico aislado en C++/Fortran o Rust, usando bibliotecas con licencia compatible y bindings pequeños. Python es apropiado para validación, generación de fixtures y comparación científica, no como única frontera de producto.

**Puerta mínima:** patch tests, refinamiento de malla, conservación de energía/equilibrio, sensibilidad a tolerancias y comparación con soluciones analíticas y referencias independientes.

**Mockup:** [ver Elementos finitos](../public/assets/tool-mockups/fs-a03-elementos-finitos.png).

### `FS-A04` · Diseño por materiales — Experimental

**Existe:** un componente de diseño separado de `AnalysisResult` para un único estado límite de acero en tensión axial, con identidad explícita de material/sección, fuente normativa, sustitución, bloqueos y resultado deliberadamente inconcluso. No equivale a diseño integral de acero. Concreto reforzado, madera y mampostería están planeados.

**Alcance propuesto:** conectar demanda trazable con geometría de sección, constitutivas, capacidad y paquetes normativos versionados; mostrar estados límite evaluados y ausentes. Para concreto: compatibilidad de deformaciones, fisuración, momento-curvatura, interacción P-M/biaxial y detalle posterior revisable.

**Familia técnica recomendada:** conservar `AnalysisResult` y `DesignResult` separados; evaluar StructuralCodes, concrete-properties y section-properties detrás de un worker Python como oráculos/servicios experimentales; nunca poner fórmulas normativas únicamente en React.

**Puerta mínima:** reproducir manualmente cada cláusula y cada caso de sección; demostrar equilibrio/compatibilidad, unidades, edición, jurisdicción, redondeo, tolerancia y cobertura; bloquear conclusiones cuando falte un estado límite.

**Mockup:** [ver Diseño por materiales](../public/assets/tool-mockups/fs-a04-diseno-materiales.png). La sección de concreto que aparece es dirección visual, no capacidad implementada.

## `FS-Mxx` · Modelo y diseño

### `FS-M01` · Dibujo CAD — Planeado

**Alcance propuesto:** geometría 2D/3D precisa, capas, bloques, referencias, cotas, restricciones, estilos, layouts y exportación abierta. Una línea puede ser representación, pero no debe sustituir silenciosamente a una entidad del proyecto.

**Familia técnica recomendada:** TypeScript + Canvas/WebGL/WebGPU para interacción; Rust/C++ para geometría robusta si la evidencia de rendimiento lo exige; DXF/SVG como adaptadores, no como esquema interno.

**Puerta mínima:** tolerancias geométricas, snapping, undo/redo, round-trip de formatos soportados, unidades y cero cambios silenciosos de coordenadas.

**Mockup:** [ver Dibujo CAD](../public/assets/tool-mockups/fs-m01-dibujo-cad.png).

### `FS-M02` · Modelo BIM — Planeado

**Alcance propuesto:** niveles, ejes, espacios, elementos, materiales, clasificaciones, fases, vistas, tablas y relación entre modelo físico y analítico. IFC será un contrato de intercambio, no el modelo interno entero.

**Familia técnica recomendada:** TypeScript para el grafo de proyecto y UI; almacenamiento relacional/documental versionado; IfcOpenShell (C++/Python) o un lector WASM evaluado detrás de un adaptador con licencia revisada.

**Puerta mínima:** identidad estable, migraciones, comparación de versiones, pérdida de información declarada e intercambio probado con fixtures IFC pequeños.

**Mockup:** [ver Modelo BIM](../public/assets/tool-mockups/fs-m02-modelo-bim.png).

### `FS-M03` · Detallado — Planeado

**Alcance propuesto:** conexiones, placas, pernos, soldaduras, acero de refuerzo, numeración, dibujos de taller, ensambles, BOM y paquetes de fabricación. El resultado de análisis no se convierte automáticamente en detalle aprobado.

**Familia técnica recomendada:** motor geométrico común con `FS-M01/M02`; reglas de detallado como paquetes versionados; exportadores NC/BOM aislados y con validación dimensional.

**Puerta mínima:** consistencia entre modelo, vistas, lista de materiales y archivo exportado; revisión explícita de tolerancias y reglas usadas.

**Mockup:** [ver Detallado](../public/assets/tool-mockups/fs-m03-detallado.png).

## `FS-Cxx` · Civil y sistemas

### `FS-C01` · Terreno — Planeado

**Alcance propuesto:** levantamientos, puntos, TIN, curvas, parcelas, alineamientos, perfiles, corredores, superficies y corte/relleno.

**Familia técnica recomendada:** PROJ/GDAL o equivalentes detrás de un servicio/adaptador con licencias revisadas; Python para ingestión y validación; TypeScript/WebGL para edición y visualización.

**Puerta mínima:** CRS, datum, unidades, precisión, fuente, densidad de malla y balance de volúmenes registrados.

**Mockup:** [ver Terreno](../public/assets/tool-mockups/fs-c01-terreno.png).

### `FS-C02` · Geotecnia — Planeado

**Alcance propuesto:** estratos, nivel freático, materiales, excavaciones, sostenimiento, estabilidad, flujo, consolidación e interacción suelo-estructura por etapas.

**Familia técnica recomendada:** solver especializado separado; C++/Fortran/Rust para cómputo, Python para calibración y comparación, UI TypeScript. Cada modelo constitutivo entra como paquete versionado con rango de aplicabilidad.

**Puerta mínima:** benchmarks académicos, estudios de malla, fases reproducibles, balance y sensibilidad; advertencias claras sobre datos de campo faltantes.

**Mockup:** [ver Geotecnia](../public/assets/tool-mockups/fs-c02-geotecnia.png).

### `FS-C03` · Agua y drenaje — Planeado

**Alcance propuesto:** redes presurizadas, drenaje, cuencas, lluvia, escurrimiento, almacenamiento, bombas, calidad y escenarios.

**Familia técnica recomendada:** adaptadores alrededor de motores abiertos maduros como EPANET y SWMM cuando la licencia y el despliegue sean compatibles; esquema propio para escenarios y procedencia; UI TypeScript.

**Puerta mínima:** continuidad de masa, energía, estabilidad temporal, unidades y comparación contra archivos de ejemplo oficiales.

**Mockup:** [ver Agua y drenaje](../public/assets/tool-mockups/fs-c03-agua-drenaje.png).

## `FS-Pxx` · Proyecto y control

### `FS-P01` · Documentos — Planeado

**Alcance propuesto:** hojas, PDF, marcas, comparación, revisiones, transmittals, incidencias, RFI, submittals, responsables y expediente final. La memoria técnica actual es una base disponible; esta superficie coordinada todavía no existe.

**Familia técnica recomendada:** TypeScript para revisión; PDF/SVG como salidas; servicio Python/ReportLab sólo para generación cuando corresponda; metadatos y relaciones en el grafo versionado.

**Puerta mínima:** cada documento conserva generador, versión del modelo, estado, checksum y diferencia; accesibilidad y fidelidad de impresión verificadas.

**Mockup:** [ver Documentos](../public/assets/tool-mockups/fs-p01-documentos.png).

### `FS-P02` · Cantidades y costos — Planeado

**Alcance propuesto:** takeoff, catálogos, conceptos, análisis de precios unitarios, materiales, mano de obra, equipo, indirectos, presupuesto y comparativos.

**Familia técnica recomendada:** TypeScript para reglas y UI; SQL para revisiones y consultas; motores de cálculo decimal, nunca `float` sin política de redondeo; importadores CSV/hoja de cálculo aislados.

**Puerta mínima:** moneda, fecha de precios, unidad, rendimiento, fórmula, redondeo, fuente y revisión visibles; cantidad manual separada de cantidad derivada.

**Mockup:** [ver Cantidades y costos](../public/assets/tool-mockups/fs-p02-cantidades-costos.png).

### `FS-P03` · Programa y campo — Planeado

**Alcance propuesto:** WBS, CPM, calendarios, recursos, costos, riesgos, 4D, avances, reportes diarios, seguridad, fotos, incidencias y cambios.

**Familia técnica recomendada:** TypeScript/Rust para algoritmos CPM y nivelación después de benchmarks; SQL/eventos para historial; cliente móvil local-first con cola y resolución explícita de conflictos.

**Puerta mínima:** relaciones y calendarios reproducibles, ruta crítica comprobada, zonas horarias explícitas, operación offline y evidencia vinculada a actividad y versión.

**Mockup:** [ver Programa y campo](../public/assets/tool-mockups/fs-p03-programa-campo.png).

## `FS-Ixx` · Interoperabilidad

### `FS-I01` · Conectores — Planeado

**Alcance propuesto:** adaptadores de Revit, AutoCAD, IFC, BCF, IDS, DXF, CSV/JSON y otras aplicaciones. La importación DXF parcial y las exportaciones actuales son capacidades existentes, pero el hub versionado todavía es visión.

**Familia técnica recomendada:** C#/.NET para complementos locales de Revit y AutoCAD; Autodesk Platform Services para flujos cloud cuando aporten valor y el usuario autorice credenciales/costos; C++/Python/WASM para openBIM; TypeScript para contrato, vista previa y diferencias.

**Puerta mínima:** snapshot inmutable de origen, mapeo versionado, unidades/CRS, diff añadido-cambiado-eliminado, validación, confirmación, idempotencia, checkpoint reversible, log y pruebas por versión del proveedor.

**Mockup:** [ver Conectores](../public/assets/tool-mockups/fs-i01-conectores.png). La imagen es conceptual y no prueba que existan conectores de proveedor.

La arquitectura específica está en [Arquitectura de conectores](arquitectura-conectores.md).

## `FS-Lxx` · Aprendizaje e investigación

### `FS-L01` · Aula estructural — Disponible

**Puede hacer hoy:** crear ejercicios guiados de viga, voladizo, pórtico y armadura; ajustar parámetros con unidades; usar una trayectoria de construir, definir, analizar, comparar y concluir; predecir signos/valores antes de revelar resultados; y consultar procedimiento pedagógico sobre el mismo análisis del Solver 2D.

**Debe mejorar:** biblioteca versionada de ejercicios, rúbricas, paquetes docentes portables y comparación automatizada con oráculos. El modo Aula no certifica el solver ni sustituye la solución manual.

**Puerta mínima:** cada ejercicio incluye respuesta manual u oráculo, convenciones, tolerancias y una conclusión que distingue predicción de resultado.

**Mockup:** [ver Aula estructural](../public/assets/tool-mockups/fs-l01-aula-estructural.png).

### `FS-L02` · Taller de investigación — Planeado

**Alcance propuesto:** problema, pregunta, objetivos, hipótesis, variables, método, ética, fuentes, hitos, decisiones y evidencia relacionados con snapshots del proyecto.

**Familia técnica recomendada:** Markdown/Quarto para protocolos y reportes; referencias en formatos abiertos; ninguna fuente o cita se inventa ni se convierte automáticamente en evidencia.

**Puerta mínima:** el reporte puede reconstruirse desde fuentes, decisiones, datos y ejecuciones versionadas; cambios de hipótesis dejan historial.

**Mockup:** [ver Taller de investigación](../public/assets/tool-mockups/fs-l02-taller-investigacion.png).

### `FS-L03` · Laboratorio reproducible — Planeado

**Alcance propuesto:** notebooks, datasets, parámetros, entornos, motores, versiones, hashes, ejecuciones, tolerancias, métricas, figuras y artefactos ligados a un snapshot.

**Familia técnica recomendada:** JupyterLab como entorno externo o integrado de forma explícita; Quarto para publicación; DVC opcional para datos y pipelines avanzados. La ejecución no muta el modelo canónico sin un comando confirmado.

**Puerta mínima:** otra máquina puede reconstruir el resultado o explicar por qué no; la comparación identifica motor, versión, unidades y tolerancia.

**Mockup:** [ver Laboratorio reproducible](../public/assets/tool-mockups/fs-l03-laboratorio-reproducible.png).

### `FS-L04` · Tutoría y trayectoria — Planeado

**Alcance propuesto:** sesiones, agenda, acuerdos, responsables, hitos, evidencias, criterios, bloqueos, alertas y próximas acciones vinculadas al trabajo real del proyecto.

**Familia técnica recomendada:** estado local-first y portable; calendario/LMS como conectores posteriores con consentimiento. El progreso se deriva de evidencia revisada, no de puntos o porcentajes decorativos.

**Puerta mínima:** todo acuerdo puede cerrarse, reabrirse y auditarse; cada hito muestra criterio y evidencia; eliminar el conector externo no destruye el expediente.

**Mockup:** [ver Tutoría y trayectoria](../public/assets/tool-mockups/fs-l04-tutoria-trayectoria.png).

La aplicación académica específica se organiza en [Ruta académica](ruta-academica.md).

## Referentes oficiales

- Análisis: [ETABS](https://www.csiamerica.com/products/etabs), [RFEM 6](https://www.dlubal.com/en/products/rfem-fea-software/rfem/new-features), [OpenSees](https://opensees.berkeley.edu/index.php/OpenSees/OpenSees/open.html).
- FEA: [Ansys Mechanical](https://www.ansys.com/products/structures/ansys-mechanical), [SolidWorks Simulation](https://www.solidworks.com/product/solidworks-simulation).
- CAD/BIM/civil: [AutoCAD](https://www.autodesk.com/products/autocad/overview), [Revit](https://www.autodesk.com/products/revit/overview), [Civil 3D](https://www.autodesk.com/products/civil-3d/overview), [Tekla Structures](https://www.tekla.com/products/tekla-structures), [QGIS](https://qgis.org/project/overview/).
- Geotecnia e hidráulica: [PLAXIS](https://www.bentley.com/software/plaxis-le/), [GeoStudio](https://www.seequent.com/products-solutions/geostudio-2d/), [EPANET](https://www.epa.gov/water-research/epanet), [SWMM](https://www.epa.gov/water-research/storm-water-management-model-swmm).
- Entrega: [Neodata](https://neodata.mx/precios-unitarios), [Primavera P6](https://www.oracle.com/construction-engineering/primavera-p6/), [Navisworks](https://www.autodesk.com/products/navisworks/overview).
- Abierto: [IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/), [BCF](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format/), [IDS](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/), [IfcOpenShell](https://docs.ifcopenshell.org/ifcopenshell.html).
- Repositorios y licencias: [Referentes, repositorios y fronteras de reutilización](referentes-open-source.md).

Las referencias sirven para estudiar patrones y contratos. Sus nombres, marcas, licencias, APIs y formatos siguen perteneciendo a sus respectivos titulares.
