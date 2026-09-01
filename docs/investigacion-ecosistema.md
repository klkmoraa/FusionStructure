# Investigación del ecosistema

## Propósito

La visión de FusionStructure no debe construirse imaginando que una sola aplicación ya resolvió todo el trabajo AEC. La investigación revisó documentación oficial de productos y estándares para identificar qué problemas son realmente distintos, qué capacidades suelen agruparse y qué contratos conviene respetar.

Fecha de consulta: 2026-08-31.

## Patrones observados

| Zona de trabajo | Qué muestran las herramientas existentes | Implicación para FusionStructure |
|---|---|---|
| Autoría BIM y arquitectura | La autoría arquitectónica, documentación y colaboración suelen formar una familia de productos con modelos ricos y vistas derivadas. | El modelo debe separar geometría, semántica, vistas y documentos; no basta con dibujar líneas. |
| Diseño civil e infraestructura | Terreno, topografía, alineamientos, perfiles, redes, drenaje, cantidades y producción de planos tienen reglas propias. | El contexto geoespacial debe ser una capa real, no un fondo decorativo de la estructura. |
| Análisis y diseño estructural | El análisis, el diseño por materiales, el detallado y la fabricación se benefician de una relación estrecha, pero requieren profundidad técnica distinta. | El motor numérico debe tener contratos y validación propios; el producto puede compartir proyecto sin fingir que todos los dominios son iguales. |
| Detallado y construcción | El valor aumenta cuando el modelo mantiene información constructible, documentación, reportes y conexión con campo. | Cantidades, revisiones, materiales, secuencias y evidencia deben ser ciudadanos de primera clase. |
| Revisión documental | La revisión de PDF, medición, comentarios y trazabilidad son un flujo central, no un exportador secundario. | El expediente y la coordinación deben existir aunque el modelo aún no sea BIM completo. |
| Planeación | Costos, recursos, riesgos, actividades, programa y avance se gestionan como información relacionada, no como una sola gráfica. | El futuro módulo de planeación necesita relaciones con elementos y revisiones, no otra hoja aislada. |
| Estándares abiertos | IFC describe información del entorno construido; BCF facilita incidencias y coordinación; IDS permite especificar y comprobar requisitos de información. | Interoperabilidad, validación y requisitos deben diseñarse desde el esquema, no añadirse al final. |
| APIs y conectores | Los proveedores ofrecen varias vías: complementos locales, APIs cloud, derivados para visualización y formatos abiertos. Ninguna vía conserva por sí sola toda la semántica ni resuelve conflictos. | Diseñar `FS-I01` como una cadena de adaptadores con snapshot, mapeo, diff, confirmación y checkpoint; elegir la vía por flujo, no por marca. |
| Gestión de información | ISO 19650 pone énfasis en intercambiar, registrar, versionar y organizar información durante el ciclo de vida. | El proyecto necesita estados, revisiones, responsabilidades, procedencia y reglas de entrega. |
| Software abierto | Los mejores candidatos no forman una suite única: hay motores permisivos, bibliotecas LGPL/CDDL, aplicaciones GPL/AGPL y productos de investigación con licencias propias. | La adopción se decide por componente y frontera; “está en GitHub” no significa que pueda copiarse al cliente MIT. |
| Educación e investigación | FTOOL, Edubeam e IndeterminateBeam enseñan por interacción; Jupyter/Quarto/DVC cubren ejecución, publicación y artefactos reproducibles. | Aula, protocolo, laboratorio y tutoría deben ser capas del proyecto, no otro silo ni un LMS genérico. |

## Conclusiones

### 1. “Todo-en-uno” debe significar continuidad

Las suites del mercado suelen ofrecer varias aplicaciones integradas, cada una con su profundidad. La oportunidad de FusionStructure no es prometer que una primera versión reemplazará cada especialista. Es ofrecer continuidad: un proyecto común que conserva contexto, relaciones y trazabilidad mientras se incorporan módulos.

### 2. El centro no es el panel

Una navegación unificada no resuelve por sí sola la fragmentación. El centro de arquitectura debe ser un grafo de información con:

- entidades estables;
- relaciones explícitas;
- unidades y sistemas de coordenadas;
- revisiones;
- procedencia;
- validaciones;
- comandos reversibles;
- adaptadores de intercambio.

### 3. PDF y coordinación son parte del trabajo

El proyecto real no termina en el modelo. Planos, memorias, comentarios, mediciones, incidencias y paquetes de entrega tienen que relacionarse con la versión que los generó.

### 4. La apertura es estratégica

IFC, BCF e IDS deben investigarse como contratos de intercambio y calidad. No se debe prometer certificación de un formato antes de tener casos de prueba, validadores y límites de implementación.

### 5. El campo impone otras reglas

Una función de obra debe tolerar dispositivos táctiles, conectividad intermitente, evidencia fotográfica, estados simples y conflictos de sincronización. No es una versión pequeña del escritorio.

### 6. La educación puede ser una ventaja propia

Explicar métodos, supuestos y resultados no es solo una función para estudiantes. También puede reducir errores de revisión y hacer que una decisión sea entendible para personas con roles distintos.

## Decisiones derivadas

- construir primero el núcleo común y el contrato de proyecto;
- tratar resultados, documentos y cantidades como derivados versionados;
- separar adaptadores externos del modelo interno;
- investigar openBIM antes de diseñar un formato cerrado;
- mantener los cálculos avanzados experimentales hasta contar con oráculos;
- diseñar módulos para offline antes de añadir colaboración remota;
- conservar la fundación acromática del sistema visual y usar la landing para hacer visibles estados, familias y límites sin fingir capacidades.
- mantener una matriz viva de licencia, actividad, versión, rol y decisión para cada repositorio evaluado;
- priorizar `FS-A04` como separación entre demanda, sección/material y regla normativa;
- reconocer `FS-L01` como disponible y reservar `FS-L02/L03/L04` para investigación, reproducibilidad y trayectoria.

La matriz completa y sus recomendaciones están en [Referentes, repositorios y fronteras](referentes-open-source.md). La aplicación a las materias identificadas está en [Ruta académica](ruta-academica.md).

## Fuentes oficiales consultadas

- [Autodesk AEC Collection](https://www.autodesk.com/collections/architecture-engineering-construction/included-products)
- [Autodesk Revit](https://www.autodesk.com/products/revit/overview)
- [Autodesk AutoCAD](https://www.autodesk.com/products/autocad/overview)
- [Autodesk Civil 3D](https://www.autodesk.com/products/civil-3d/overview)
- [Autodesk Platform Services: Automation APIs](https://aps.autodesk.com/automation-apis)
- [Autodesk Platform Services: Data Exchange API](https://aps.autodesk.com/developer/overview/data-exchange-api)
- [Autodesk Platform Services: Model Derivative API](https://aps.autodesk.com/apis-and-services/model-derivative-api)
- [Graphisoft Archicad](https://www.graphisoft.com/)
- [Tekla Structures](https://www.tekla.com/products/tekla-structures)
- [Bluebeam: markups and data](https://www.bluebeam.com/product/markups-and-data/)
- [Oracle Primavera P6](https://www.oracle.com/construction-engineering/primavera-p6/)
- [buildingSMART: IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)
- [buildingSMART: openBIM](https://www.buildingsmart.org/about/openbim/)
- [buildingSMART: IDS](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/)
- [buildingSMART: BCF](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format/)
- [ISO: BIM e ISO 19650](https://www.iso.org/sectors/building-construction/building-information-modelling)
- [ISO 19650-1](https://www.iso.org/standard/68078.html)

Estas fuentes se usan para orientar decisiones de producto, no como validación de la implementación de FusionStructure.
