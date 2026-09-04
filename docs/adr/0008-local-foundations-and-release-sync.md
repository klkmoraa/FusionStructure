# ADR 0008 — Foundations locales y sincronización por release

- **Estado:** aceptado.
- **Fecha:** 2026-09-04.
- **Sustituye:** la distribución central de Foundation descrita en ADR 0001 y ADR 0007; sus límites de producto y evidencia histórica permanecen vigentes.

## Contexto

La primera extracción física creó productos independientes, pero conservar una Foundation runtime central obligaba a coordinar varios repositorios para cambios internos pequeños. Esa coordinación no aporta valor cuando unidades, álgebra o catálogo evolucionan dentro de un solo producto.

Los formatos que cruzan aplicaciones sí necesitan compatibilidad explícita. Compartirlos como código runtime central no es obligatorio: pueden viajar como documentos versionados y cada consumidor puede conservar las versiones que entiende.

## Decisión

Cada repositorio es autónomo y propietario exclusivo de su Foundation local:

- `fstructure` conserva unidades, álgebra y tipos numéricos necesarios para 2D;
- `fusionstructure-space3d` conserva sus unidades y álgebra 3D;
- `fusionstructure-web` conserva sólo catálogo, identificadores y URLs públicas;
- `FusionStructure` mantiene su Foundation completa para monolito, integración y compatibilidad.

Se prohíben `@fusionstructure/foundation` y los imports de internals entre productos hermanos. `fusionstructure-foundation` se conserva archivado, sin borrar tags, ramas ni historial; `v0.1.1` es su último corte histórico.

Los documentos compartidos declaran `schemaVersion` y sus resultados derivados declaran `algorithmVersion`. Un cambio incompatible añade una versión; nunca altera silenciosamente una versión ya publicada. Los corpus 2D y 3D siguen en sus repositorios propietarios como puertas de compatibilidad.

El principal incorpora únicamente releases inmutables desde GitHub. `migration/product-releases.json` declara repositorio, tag, commit, rutas permitidas, contratos, URL pública y gate. `npm run sync:product -- --product <nombre> --ref <tag>` valida un árbol limpio, identidad, tag y ownership; excluye Foundation, bootstrap y configuración del producto; deja un diff revisable y nunca hace commit, push ni merge.

## Consecuencias

- Un cambio interno pequeño exige pruebas y PR sólo en el producto propietario.
- Duplicar una primitiva pequeña entre productos es aceptable; su evolución es independiente y explícita.
- La sincronización del principal ocurre sólo al cerrar una release y requiere corpus y `npm run check` del principal.
- El manifiesto es un snapshot de integración, no un gestor de paquetes ni una fuente de código editable.
- Foundation central queda disponible únicamente para arqueología, comparación y trazabilidad.
