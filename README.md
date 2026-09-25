# FusionStructure · Landing

Landing pública del ecosistema FusionStructure.

**Sitio:** https://fusionstructure.vercel.app

- Presenta los productos que existen hoy, **FStructure** (Análisis) y **FModel** (Modelo), y el catálogo de 25 herramientas en 7 familias, cada una con su estado.
- Día y Noche; español e inglés.
- Los productos se enlazan desde `src/foundation/productLinks.ts`; nunca se importan.

## Marca

El canon vive en [FusionStructureBrand](https://github.com/klkmoraa/FusionStructureBrand) ([sistema de diseño](https://klkmoraa.github.io/FusionStructureBrand/)).
Esta landing copia de ahí `src/styles/tokens.css`, `public/favicon.svg` y `public/brand/`; un test comprueba que los tokens sean idénticos.

## Trabajo

```bash
npm ci
npm run dev
npm run check   # lint, tipos, frontera de productos, pruebas y build
```

| Ruta | Qué es |
| --- | --- |
| `src/landing/` | Landing, catálogo (`catalog.ts`), textos ES/EN (`copy.ts`) y preferencias Día/Noche e idioma. |
| `src/styles/tokens.css` | Copia exacta de los tokens del canon. |
| `public/captures/` | Capturas reales de FStructure y FModel en Día y Noche. |
| `scripts/check-local-foundation.mjs` | Falla si la landing depende de código de un producto. |

Se publica en Vercel, Netlify y en la rama `gh-pages` desde `main`.
