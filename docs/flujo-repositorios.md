# Flujo rápido por repositorio

## Cambio diario de producto

1. Trabajar en el repositorio propietario y crear una rama `codex/...`.
2. Cambiar el producto y su Foundation local cuando corresponda.
3. Ejecutar sólo las pruebas focalizadas del cambio.
4. Abrir y revisar un PR en ese mismo repositorio.
5. Fusionar el PR. Ningún cambio ordinario de 2D obliga a tocar 3D, Web, Foundation histórico ni el principal.

## Cierre de release

1. Ejecutar `npm run check` completo en el producto.
2. Confirmar que su corpus conserva resultados y tolerancias.
3. Crear un tag semántico inmutable y desplegar GitHub Pages cuando el producto tenga sitio público.
4. Ejecutar un smoke test sobre la URL publicada.

## Actualización del principal

Desde un árbol limpio de `FusionStructure`:

```powershell
npm.cmd run sync:product -- --product fstructure --ref v0.1.2
```

El comando clona el tag directamente desde GitHub, comprueba identidad y commit, copia sólo las rutas declaradas y actualiza `migration/product-releases.json`. No acepta ramas ni clones locales y no crea commits.

Después:

1. revisar el diff y el commit resuelto en el manifiesto;
2. ejecutar los corpus 2D/3D afectados;
3. ejecutar `npm run check` completo del principal;
4. abrir un único PR de actualización y registrar el snapshot fusionado.

## Contratos

- Cada archivo intercambiado declara `schemaVersion`.
- Cada resultado derivado declara `algorithmVersion`.
- Los consumidores mantienen copias locales de las versiones soportadas.
- Una incompatibilidad crea una versión nueva y una migración o adaptador explícito.
- No se importa `@fusionstructure/foundation` ni código interno de un producto hermano.
