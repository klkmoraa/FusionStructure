# Implementación del canvas 2D

Este documento conecta la propuesta de implementación del canvas con las superficies y
puertas verificables que viven en el repositorio. La numeración conserva las cuatro
fases de la propuesta y deja claro qué se mide automáticamente y qué requiere una
revisión de producto.

## Fase 0 · correcciones P0

Las cinco correcciones geométricas de la fase 0 viven en el PR que acompaña este
documento:

- paleta con hoja estable antes de abrirse;
- ninguna superficie suspendida reserva una columna fantasma;
- navegación y Resultados no se cubren entre sí;
- Inspector con overflow visible o scroll explícito;
- acceso directo al Solver 2D sin depender de una ruta 3D.

La puerta de navegador es npm run ui:layout; sus hallazgos incluyen la anchura,
altura y elemento que realmente tapa o queda tapado.

## Fase 1 · estructura del espacio

WorkspaceTopBar mantiene proyecto, guardado, corrida, historial, análisis y
Resultados en una franja persistente. Console y ToolRail mantienen el riel
principal y sus atajos. AppShellLayout publica las áreas console, topbar,
workspace y footer en una única retícula, de modo que la franja no crea una
columna reservada.

ResultsPanel conserva la bandeja persistente con los modos compact, expanded
y focused; la navegación de cantidades vive dentro de la bandeja y no en una
capa que cubra el lienzo.

## Fase 2 · modelado contextual

CoordinateEntry ofrece entrada absoluta, relativa y polar con previsualización.
Inspector, SupportPlacementPopover y los editores numéricos progresivos
mantienen primero el resumen y después el detalle, incluyendo una hoja móvil con
detentes.

## Fase 3 · lectura de resultados

ResultsPanel, DenseResultsSurface y las superficies de diagnóstico concentran
resumen, reacciones, desplazamientos y diagramas. Los errores de análisis enlazan
con ModelDoctor; los comandos de exportación salen del mismo registro de
superficies y respetan el retorno de foco.

## Fase 4 · responsive y publicación

phase1.css, console.css, workspaceTopbar.css y las hojas de Inspector/Resultados
definen las composiciones de 390, 768, 1024 y 1440 px. Los controles móviles mantienen
objetivos de al menos 44 px y las acciones se pueden alcanzar con teclado. ToolRail,
CoordinateEntry, Inspector, ResultsPanel y WorkspaceTopBar tienen pruebas
automatizadas para la lógica de handoff; el layout real se comprueba con
npm run ui:layout y npm run ui:plan.

## Puertas de verificación

\`\`\`bash
npm run check
npm run ui:layout
npm run ui:plan
npm run ui:shots
\`\`\`

npm run check es la puerta ejecutable del repositorio. Las dos auditorías de UI
necesitan un vite preview servido y un navegador Playwright; no se ejecutan dentro
del CI de cada commit porque dependen de un proceso web y de un binario gráfico.
ui:shots produce capturas para revisión visual, no un snapshot pixel a pixel.

## Límites explícitos

La auditoría no certifica una estructura ni sustituye una revisión independiente.
El flujo de viga simple —dos nudos, una barra, apoyos, carga, corrida y lectura— debe
repetirse en un navegador durante la publicación y conservar sus capturas. El
resultado experimental no es una memoria de cálculo, plano sellado ni autorización
de obra.
