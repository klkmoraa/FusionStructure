# FusionStructure

> Del concepto al expediente, del cálculo a la obra.

FusionStructure es una aplicación experimental para concentrar en un mismo proyecto la información que acompaña a un activo construido: contexto, diseño, geometría, ingeniería, análisis, documentación, cantidades, planeación, obra y aprendizaje.

La visión es una plataforma todo-en-uno para arquitectura, ingeniería civil, ingeniería estructural y construcción. No significa amontonar herramientas independientes en una sola pantalla. Significa que todas las áreas trabajan sobre un mismo proyecto, un mismo modelo de información y una misma historia de cambios.

## Estado actual

El núcleo disponible está centrado en **FStructure**, el solver 2D de modelado y análisis estructural, con superficies experimentales para 3D, aprendizaje, documentación técnica e interoperabilidad. La visión integral es más amplia que lo que hoy está implementado; este repositorio no presenta como terminado lo que aún es una dirección de producto.

En este momento hay código para:

- modelado 2D de nudos, miembros, apoyos, cargas, casos y combinaciones;
- edición interactiva, selección, snapping, operaciones topológicas y deshacer/rehacer;
- análisis lineal, P-Delta, diagramas N-V-M, deformada, envolventes, líneas de influencia, pandeo y estudios modales;
- auditoría de cargas, indicadores de calidad numérica y trazabilidad educativa;
- memorias de cálculo PDF, expediente portable, exportaciones SVG/PNG/CSV y lista de materiales;
- importación DXF de un subconjunto, enlaces compartibles, versiones locales y shell PWA;
- un dominio Space 3D separado, todavía experimental.

La presencia de una pantalla, un tipo o un archivo no equivale a una capacidad profesional completa. La clasificación verificable está en [docs/alcance-funcional.md](docs/alcance-funcional.md).

## La idea de producto

FusionStructure debe permitir que una persona pase de una pregunta a una decisión técnica sin perder el contexto:

1. definir el proyecto y su contexto;
2. representar la geometría y los elementos constructivos;
3. asignar propiedades, acciones, criterios y supuestos;
4. analizar, revisar y explicar los resultados;
5. coordinar disciplinas y detectar conflictos;
6. producir planos, memorias, cantidades y entregables;
7. planear y documentar la ejecución;
8. conservar el expediente y alimentar el aprendizaje o la operación posterior.

El proyecto es la unidad central. Los módulos son superficies de trabajo especializadas que leen y escriben información común, con permisos, validaciones, versiones y procedencia explícitas.

## Principios

- **Una fuente de verdad:** geometría, propiedades, hipótesis, resultados y documentos deben poder relacionarse.
- **El cálculo se explica:** cada resultado importante debe mostrar unidades, supuestos, método, calidad y límites.
- **Interoperabilidad desde el inicio:** el proyecto no debe quedar encerrado en un formato privado.
- **Local-first y portable:** trabajar sin conexión debe ser una capacidad base; la colaboración remota se incorpora sin destruir el flujo local.
- **Profundidad progresiva:** una persona nueva puede empezar con una tarea sencilla y una especialista puede abrir el detalle completo.
- **Modularidad real:** arquitectura, estructuras, civil, instalaciones, documentación, costos, planeación y obra deben poder evolucionar sin convertir el producto en un monolito frágil.
- **Honestidad experimental:** una función incompleta se marca como experimental, no como certificada.

## Límites importantes

FusionStructure no sustituye el criterio de una persona responsable, una revisión independiente, la normativa aplicable ni la autorización profesional correspondiente. Un resultado numérico puede ser incorrecto por un modelo, una unidad, una hipótesis, una propiedad o una implementación mal elegida.

El estado experimental implica, entre otras cosas:

- no se promete cumplimiento normativo automático;
- no se promete exactitud para una obra real sin verificación independiente;
- no se promete que el dominio 3D, los estudios avanzados o los módulos futuros estén listos;
- no se deben interpretar los entregables como planos sellados, memoria certificada o instrucción de construcción.

## Declaración de etapa y propiedad

FusionStructure es experimental, no una tecnología terminada ni una promesa de exclusividad. Este repositorio no afirma que el concepto, sus módulos o su arquitectura estén patentados, certificados o protegidos como una solución profesional lista para obra. Las capacidades futuras son hipótesis de producto hasta que tengan implementación, pruebas, límites y validación independiente.

El código se distribuye bajo la licencia MIT indicada en [LICENSE](LICENSE). Esa licencia permite reutilizar el código dentro de sus condiciones; no equivale a una certificación, garantía de resultados ni ausencia de derechos de autor o licencias de terceros.

## Sin áreas de código protegidas

Todo el código de este repositorio es experimental y puede rediseñarse, moverse, sustituirse o eliminarse si existe una razón técnica y se actualizan sus dependencias, pruebas y documentación. No hay una lista de archivos intocables ni un checksum que convierta una parte del producto en una frontera especial.

Esto describe el proceso técnico, no elimina los derechos de autor, la licencia MIT ni las obligaciones de licencias de terceros. La calidad se sostiene con pruebas, revisión, trazabilidad y comunicación clara de lo que todavía no está validado.

## Arranque

```bash
npm install
npm run dev
```

Puertas de calidad:

```bash
npm run check        # lint, typecheck, pruebas y build
npm run build        # aplicación estática desplegable
npm run test         # pruebas automatizadas
```

La geometría del canvas 2D se audita aparte, en un navegador real, porque jsdom
no hace layout y una columna reservada, un panel tapado o un número recortado
sólo existen cuando algo se mide de verdad:

```bash
npm run build && npm run preview   # en una terminal
npm run ui:layout                  # en otra; UI_URL cambia el destino
```

Comprueba, a 390, 768, 1024, 1280 y 1440 px de ancho, que la paleta de comandos
tenga hoja antes de abrirse, que una superficie suspendida no reserve ancho, que
la navegación desplegada no cubra la bandeja de Resultados y que el Inspector no
corte contenido en silencio. Cada hallazgo viene con la medida que lo demuestra.

No se salta una comprobación en silencio: si falta el control que la monta o el
estado que la exhibe no llega a producirse, eso mismo es un hallazgo. Un verde
sólo significa algo si la auditoría llegó a mirar.

El servicio opcional de ReportLab se puede levantar con:

```bash
python -m pip install -r requirements-reportlab.txt
npm run pdf:reportlab-service
```

## Documentación

- [Visión de producto](docs/vision-producto.md) — qué debe llegar a ser la aplicación.
- [Alcance funcional](docs/alcance-funcional.md) — qué existe, qué es experimental y qué está proyectado.
- [Estado del producto](docs/estado-del-producto.md) — fotografía verificable del repositorio y sus brechas.
- [Hoja de ruta](docs/roadmap.md) — fases y criterios de salida, sin fechas inventadas.
- [Investigación del ecosistema](docs/investigacion-ecosistema.md) — aprendizajes de herramientas y estándares AEC.
- [Catálogo de herramientas](docs/catalogo-herramientas.md) — códigos, estados, alcance, referentes y puerta de verdad de cada módulo.
- [Referentes y repositorios](docs/referentes-open-source.md) — qué motores y aplicaciones conviene integrar, aislar, conectar o usar sólo como oráculos.
- [Ruta académica](docs/ruta-academica.md) — aplicación verificable a análisis avanzado, concreto reforzado, abastecimiento de agua, investigación y tutoría.
- [Arquitectura de conectores](docs/arquitectura-conectores.md) — propuesta verificable para Revit, AutoCAD, IFC y otros adaptadores.
- [Sistema visual](docs/sistema-visual.md) — papel y carbón, las seis señales del dominio, la identidad de FStructure y las invariantes que comprueba la guarda.
- [Índice de documentación](docs/README.md) — autoridad, estructura y mantenimiento.
- [Reglas persistentes](AGENTS.md) — prácticas del repositorio y puerta de cierre.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
