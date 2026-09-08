# FusionStructure

Landing pública del ecosistema **FusionStructure**.

Este repositorio contiene únicamente la superficie de presentación del ecosistema: identidad principal, propuesta de valor, catálogo de herramientas y enlaces hacia los productos independientes.

## Qué vive aquí

- landing pública;
- navegación y catálogo del ecosistema;
- identidad necesaria para presentar la marca;
- enlaces hacia Solver 2D, Space3D y futuras herramientas;
- assets visuales exclusivos de la landing.

## Qué no vive aquí

- solver 2D;
- solver 3D;
- motores de análisis;
- CAD/BIM;
- brandbook completo;
- contratos internos de otros productos.

El brandbook y sus entregables viven en **[fusionstructure-web](https://github.com/klkmoraa/fusionstructure-web)**.

## Desarrollo

```bash
npm ci
npm run check
npm run dev
```

## Arquitectura

La landing no importa código interno de los productos. Los destinos públicos se centralizan en `src/foundation/productLinks.ts` y se consumen únicamente como enlaces.

## Estado

Experimental. La landing describe el ecosistema sin presentar como terminadas capacidades que todavía están planeadas o en desarrollo.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
