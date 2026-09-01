# Ruta académica vinculada a FusionStructure

Esta ruta parte de las materias legibles en la fotografía compartida por el usuario. No intenta reconstruir horarios, grupos o datos personales: sólo vincula cinco asignaturas con herramientas reales, ejercicios verificables y oportunidades de producto.

Fecha de corte: 2026-08-31.

## Mapa rápido

| Materia | Superficie actual o propuesta | Estado | Herramientas externas útiles | Primera evidencia verificable |
|---|---|---|---|---|
| Análisis Estructural Avanzado | `FS-A01` Solver 2D + `FS-A02` Solver 3D + `FS-L01` Aula | Disponible / Experimental / Disponible | FTOOL, PyNite, Frame3DD, OpenSees, CALFEM | mismo pórtico con unidades y signos fijados; equilibrio, desplazamientos y N/V/M comparados con dos oráculos |
| Diseño de Elementos de Concreto Reforzado | `FS-A04` Diseño por materiales | Experimental: hoy sólo existe un check parcial de acero; concreto está planeado | concrete-properties, StructuralCodes, section-properties, fkit | sección rectangular: compatibilidad de deformaciones, bloque de esfuerzos, momento-curvatura e interacción P-M con hipótesis visibles |
| Abastecimiento de Agua | `FS-C03` Agua y drenaje | Planeado | EPANET EPA/OWA, WNTR, QGIS, GDAL/PROJ | red pequeña en `.INP`: continuidad, energía, presiones, HGL/EGL y comparación de versión del motor |
| Taller de Investigación I | `FS-L02` Taller de investigación + `FS-L03` Laboratorio reproducible | Planeado | JupyterLab, Quarto, DVC, Zotero como aplicación externa | protocolo versionado + dataset + ejecución reproducible + figuras + reporte con fuentes y limitaciones |
| Acompañamiento Tutorial | `FS-L04` Tutoría y trayectoria | Planeado | agenda/calendario externo y expediente del proyecto | acuerdo con responsable, fecha, evidencia, criterio de revisión y cierre; nunca “avance” sin evidencia |

## `FS-A01/A02/L01` · Análisis Estructural Avanzado

### Qué ya aporta FusionStructure

- modelo 2D con nudos, miembros, apoyos, cargas, casos y combinaciones;
- análisis lineal, P-Delta, diagramas, envolventes, influencia, pandeo y estudios modales dentro del alcance implementado;
- Aula con casos guiados, predicción antes de revelar resultados, procedimiento y conclusión;
- un dominio 3D separado y experimental que no hereda automáticamente la cobertura 2D.

### Secuencia de estudio propuesta

1. resolver manualmente una viga o pórtico pequeño;
2. modelar el mismo caso en `FS-A01` con convención de signos y unidades explícitas;
3. contrastar con [FTOOL](https://portal.ftool.com.br/sobre/) y [PyNite](https://github.com/JWock82/PyNite);
4. usar [Frame3DD](https://github.com/hpgavin/frame3dd) como segundo oráculo CLI cuando corresponda;
5. inspeccionar GDL, matriz elemental, transformación, ensamblaje, restricciones y solución;
6. registrar tolerancias y explicar cualquier diferencia, no “escoger el resultado que se vea correcto”.

### Mejoras de producto que sí tienen sentido

- biblioteca de benchmarks por tema y dificultad;
- comparación automática `FusionStructure ↔ oráculo` con motor/versión/hash;
- visualización de matrices, condensación y mecanismos;
- paquetes de entrega docente que incluyan entrada, predicción, procedimiento, resultados y reflexión.

## `FS-A04` · Diseño de Elementos de Concreto Reforzado

`FS-A04` separa la demanda del solver, la respuesta de la sección y las reglas normativas. El código actual contiene un componente aislado de fluencia de sección total en tensión axial para un alcance de acero muy específico; su salida es deliberadamente **incompleta**. No existe todavía un diseñador integral de acero ni de concreto reforzado.

### Núcleo propuesto para concreto

- geometría y colocación de refuerzo con unidades explícitas;
- materiales y leyes esfuerzo-deformación versionadas;
- compatibilidad de deformaciones y equilibrio;
- estado no fisurado, fisurado y último;
- momento-curvatura e interacción P-M/biaxial;
- demanda proveniente de un `AnalysisResult` trazable;
- cláusula, edición, jurisdicción, sustitución y estados límite faltantes;
- detalle como resultado posterior, nunca como aprobación automática.

### Referentes técnicos

- [concrete-properties](https://github.com/robbievanleeuwen/concrete-properties): primer oráculo de sección;
- [section-properties](https://github.com/robbievanleeuwen/section-properties): propiedades y esfuerzos de sección arbitraria;
- [StructuralCodes](https://github.com/fib-international/structuralcodes): arquitectura de reglas por norma/edición, no garantía de cobertura total;
- [fkit](https://github.com/wcfrobert/fkit): trazabilidad de fibras y curvas como referencia educativa.

### Puerta mínima del primer ejercicio

El resultado debe reproducir compatibilidad, equilibrio, deformaciones, esfuerzos, fuerza interna y momento con tolerancia declarada; identificar constitutivas y unidades; y decir qué estados límite, detalles y reglas siguen ausentes.

## `FS-C03` · Abastecimiento de Agua

### Orden recomendado

1. [EPANET 2.2 de EPA](https://github.com/USEPA/EPANET2.2) como referencia de ejemplos y formato;
2. [OWA EPANET](https://github.com/OpenWaterAnalytics/EPANET) como motor comunitario versionado;
3. [WNTR](https://github.com/USEPA/WNTR) para fugas, daño, criticidad, resiliencia, costos y escenarios;
4. [QGIS](https://github.com/qgis/QGIS) + GeoPackage + [PROJ](https://github.com/OSGeo/PROJ) para contexto, elevaciones, trazado y CRS;
5. [SWMM](https://github.com/USEPA/Stormwater-Management-Model) en una ruta separada para drenaje, no como sinónimo de distribución de agua potable.

### Primer caso reproducible

Una red pequeña debe guardar `.INP`, motor, versión, hash, sistema de unidades, opciones, patrón de demanda, elevaciones y coordenadas. La salida debe mostrar continuidad, energía, convergencia, presiones, caudales, HGL/EGL y advertencias. Cambiar entre EPANET y WNTR nunca debe sobrescribir silenciosamente el origen del resultado.

## `FS-L02/L03` · Taller de Investigación I

### Flujo propuesto

```text
problema → pregunta → objetivos → hipótesis/variables → método
        → datos y procedencia → ejecución → contraste → conclusión → reporte
```

Cada flecha es una relación versionada. Una fuente no se convierte en evidencia por almacenarse; una ejecución no es reproducible sin datos, entorno, parámetros, motor y artefactos; una conclusión debe apuntar a resultados y limitaciones.

### Stack recomendado

- [JupyterLab](https://github.com/jupyterlab/jupyterlab) para cálculo y exploración;
- [Quarto](https://github.com/quarto-dev/quarto-cli) para protocolo, citas, ecuaciones y reporte;
- [DVC](https://github.com/treeverse/dvc) como perfil avanzado para datos, parámetros, métricas y artefactos;
- exportación portable en vez de depender de un servicio remoto único.

### Primer entregable

Un estudio que compare dos motores o dos hipótesis sobre un mismo snapshot de proyecto, con pregunta, variables, unidades, dataset, entorno, comandos de ejecución, tolerancias, figuras, tabla de diferencias, limitaciones y reporte reconstruible.

## `FS-L04` · Acompañamiento Tutorial

Esta superficie no necesita convertirse en otro LMS. Debe relacionar tutoría con el trabajo real:

- sesión, agenda y participantes;
- acuerdos con responsable y fecha;
- evidencia vinculada a proyecto, ejercicio, documento o ejecución;
- criterio de revisión y estado;
- alertas por falta de evidencia o bloqueo, no por un porcentaje inventado;
- cierre con decisión y siguiente acción.

La primera versión puede vivir localmente en el proyecto. Calendario, correo o LMS se tratarían después como conectores con consentimiento, no como fuente canónica.

## Criterio para añadir una herramienta educativa

Una propuesta entra a esta ruta sólo si responde:

1. ¿qué concepto ayuda a comprender o comprobar?;
2. ¿qué entidad del proyecto utiliza?;
3. ¿qué entrada, unidades y supuestos conserva?;
4. ¿qué evidencia produce y cómo se reproduce?;
5. ¿cómo se compara con una solución manual u oráculo independiente?;
6. ¿qué no puede concluir?

El objetivo no es resolver la tarea por el estudiante ni producir una respuesta con apariencia profesional. Es hacer visible el razonamiento, permitir el contraste y conservar evidencia auditable.
