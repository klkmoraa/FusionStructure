# Registro de fidelidad visual

Referencia de implementación: `concept.png`. La autorización amplia del usuario y sus mensajes de continuación permitieron ejecutar esta dirección sin una selección adicional entre variantes.

## Coincidencias principales

- **Mensaje:** el inicio del solver usa “Del trazo al diagrama.” y prioriza `Nuevo modelo` y `Continuar` en el primer viewport.
- **Composición:** escritorio conserva la estructura de dos columnas del concepto; en 390 px la ilustración se coloca antes del mensaje y las acciones ocupan el ancho disponible.
- **Material:** papel cálido, tinta grafito, bordes finos, radios de 12/22/28 px y una luz superior izquierda común para los elementos clay.
- **Jerarquía:** la arcilla identifica acciones, cabecera y paneles; el lienzo, la rejilla y los diagramas permanecen planos para preservar la lectura técnica.
- **Workspace:** proyecto, estado, historial, resultados y cálculo quedaron agrupados en la barra superior. El lienzo sigue siendo la superficie dominante y el dock de herramientas flota en el borde inferior.
- **Interacción:** una plantilla abre el proyecto real, `Analizar` actualiza la corrida y `Resultados` abre la evidencia disponible. El cambio de tema y el estado reducido de movimiento se conservan.
- **Adaptación:** la verificación a 390 × 844 px registró `scrollWidth = viewportWidth = 390`; no hay desplazamiento horizontal.

## Diferencias deliberadas

- El concepto usa un pórtico ilustrativo simple. La implementación reutiliza el activo estructural existente porque representa mejor el producto y evita introducir una geometría ficticia.
- El concepto propone un riel vertical izquierdo. Se conserva el dock inferior del producto para no cambiar la memoria operativa ni los comandos existentes durante esta revisión visual.
- El inspector derecho del concepto no permanece abierto. La aplicación conserva su panel contextual y la apertura explícita de resultados para mantener más espacio de modelado.
- La pantalla general de FusionStructure mantiene navegación, búsqueda y las superficies disponibles del producto. Se añadió un acceso directo al Solver 2D dentro de esa arquitectura.

## Ajustes nacidos de la comparación

- Se reservó más espacio bajo el canvas para que el dock no cubra apoyos ni etiquetas de reacción.
- Se compactó la ficha de proyecto en la barra superior para devolver ancho al lienzo.
- Se retiró el botón de proyecto duplicado en la consola lateral; la identidad y el menú siguen disponibles en la cabecera.
- Se añadió un estado de carga centrado para evitar un texto sin estilo durante la carga diferida del workspace.

## Evidencia

- `home-desktop.png` y `home-mobile.png`: portada del solver.
- `landing-desktop.png`: inicio general con acceso directo al solver.
- `workspace-results.png`: corrida resuelta y acciones principales.
- `workspace-results-panel.png`: panel de resultados abierto.
- `workspace-dark.png`: contraste del tema oscuro.

