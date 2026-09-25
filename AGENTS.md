# FusionStructure · Landing

## Alcance
Este repo es sólo la landing pública: `src/landing/`, tokens copiados del canon y activos estáticos.
Nada de solvers, CAD, BIM, motores de cálculo ni lógica de producto.

## Reglas
- Los productos se enlazan con `src/foundation/productLinks.ts`; nunca se importa su código.
- La marca manda desde FusionStructureBrand. `src/styles/tokens.css`, `public/favicon.svg` y `public/brand/` se copian de allí sin editarlos; si el canon cambia, copia y actualiza el hash de `src/styles/tokens.test.ts`.
- El catálogo (`src/landing/catalog.ts`) refleja la ficha 11 del canon: el estado va antes que la promesa. No se anuncia como disponible lo que no lo está.
- Estilos sólo con `--fs-*`; nada de hex sueltos en `landing.css`.
- Día y Noche, ES y EN, responsive desde 360 px, WCAG 2.1 AA, sin dependencias nuevas sin motivo.
- Voz directa: pocas palabras, el objeto y la salida.
- Antes de fusionar: `npm run check`.
