# FusionStructure

Espacio de trabajo estructural local-first para modelar, analizar, revisar y
documentar estructuras planas 2D y espaciales. Corre entero en el navegador
—React, TypeScript y Vite— sin backend obligatorio y sin enviar el proyecto a
ningún sitio.

FusionStructure nace de fusionar StructureCo y Copia-web, pero **no es ninguno
de los dos ni su promedio**. Toma de cada uno lo que estaba resuelto —el motor
de análisis, el dominio espacial, la memoria de cálculo, el expediente
portable— y reconstruye encima una aplicación con identidad propia.

```bash
npm install
npm run dev
```

`npm run build` genera la aplicación estática desplegable. `npm run check`
ejecuta la puerta de calidad completa: `lint`, `typecheck`, `test` y `build`.

## Qué hace

| Área | Alcance |
|---|---|
| Modelado 2D | Nudos, barras, apoyos, cargas, casos y combinaciones; marcos, vigas y armaduras, con edición interactiva sobre el lienzo. |
| Análisis | Lineal y P-Delta, líneas de influencia, pandeo, modal, envolventes, diagramas y deformada. |
| Resultados | Desplazamientos, reacciones, acciones internas, extremos, fiabilidad numérica, auditoría de cargas y explicaciones trazables. |
| Space 3D | Marco espacial elástico lineal con 6 GDL por nudo, en un dominio separado del 2D. Experimental. |
| Aula | Ejercicios, recorrido guiado, predicciones y progreso local por proyecto. |
| Documentación | Memoria de cálculo PDF reimportable, expediente `.structureco`, SVG, PNG, CSV y lista de materiales. |
| Interoperación | Importación DXF ASCII de un subconjunto, enlaces compartibles y centro de importación con revisión previa. |
| Plataforma | PWA con shell offline, almacenamiento local y aviso de actualización controlado. |

## Límites declarados

- Es una herramienta de modelado y cálculo de apoyo. No sustituye revisión,
  criterio ni certificación profesional.
- Space 3D sigue siendo experimental: no incluye cargas en barra, liberaciones,
  muelles, asentamientos, deformación por cortante, dinámica ni no linealidad.
- El puente 2D → 3D es explícito y de una sola dirección: no inventa
  propiedades espaciales ausentes.
- La importación DXF admite sólo un subconjunto ASCII y muestra diagnósticos
  antes de crear geometría.

## Identidad visual

FusionStructure es **minimalismo puro**: la interfaz es acromática y la marca
es la tinta —negro sobre blanco en Día, blanco sobre negro en Noche—. El único
color de la aplicación son cinco hues del dominio (rojo, azul, verde, amarillo
y rosa) usados como trazo fino para decir algo que el modelo o el solver dicen.
La profundidad la comunica un filete de 1px, no una sombra.

Toda esa dirección vive en un solo archivo, `src/design-system/tokens.css`, y
está descrita en [`docs/sistema-visual.md`](docs/sistema-visual.md).

## Documentación

- [Reglas persistentes](AGENTS.md) — qué manda y por qué no hay fronteras de
  código protegidas en este repositorio.
- [Índice de documentación](docs/README.md)
- [Sistema visual](docs/sistema-visual.md) — la fundación, sus cuatro reglas y cómo se extiende.
- [Estado de la fusión](docs/estado-de-la-fusion.md) — qué se trajo, qué falta y en qué orden conviene abordarlo.

## Compañero opcional de PDF

Para apéndices vectoriales enriquecidos:

```bash
python -m pip install -r requirements-reportlab.txt
npm run pdf:reportlab-service
```

La aplicación web es plenamente utilizable sin este compañero local.

## Ilustraciones

Las ilustraciones estructurales de `public/assets/structural/` son PNG
pre-renderizados desde las escenas Three.js de `src/features/structural-assets/`.
Si cambia la paleta o la geometría hay que rehacerlas, porque un PNG no se
retematiza con CSS:

```bash
npm run dev                                   # en una terminal
npm run assets:render -- --base http://localhost:5173
```
