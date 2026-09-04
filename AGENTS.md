# FusionStructure — reglas persistentes

Este archivo define cómo trabajar en este repositorio. FusionStructure es experimental: ninguna carpeta, módulo, solver, esquema, worker, persistencia o superficie visual debe tratarse como definitiva.

## Autoridad

Cuando exista una discrepancia, el orden es:

1. código ejecutable y pruebas;
2. puertas automatizadas;
3. documentación canónica;
4. historial de Git;
5. planes, ideas o conversaciones anteriores.

Un plan no demuestra que algo esté implementado. La implementación y sus pruebas sí aportan evidencia, aunque una puerta verde tampoco convierte una función experimental en software profesional certificado.

## Sin áreas protegidas

No existe una política de archivos protegidos en este repositorio. Cualquier parte puede rediseñarse, reescribirse, reemplazarse o eliminarse cuando el cambio esté justificado y se actualicen sus referencias, migraciones, pruebas y documentación.

Esta regla es técnica y de proceso. No significa que desaparezcan la licencia MIT, los derechos de autor o las licencias de dependencias y estándares externos.

## Calidad mínima

Durante el trabajo diario se ejecutan las pruebas focalizadas del cambio. El gate completo `npm run check` se reserva para cerrar una release o sincronizar una release al repositorio principal.

Antes de cerrar una release o una sincronización relevante:

- ejecutar `npm run check`;
- leer el resultado completo;
- indicar qué quedó verificado y qué no pudo ejecutarse;
- actualizar la documentación si cambió el alcance, el formato de datos o una decisión de arquitectura;
- conservar compatibilidad o escribir una migración cuando se toque información persistente;
- no afirmar cumplimiento normativo, exactitud estructural o preparación para obra sin evidencia específica.

La ausencia de una prueba no es evidencia de que la función funcione.

## Foundation local y límites entre repositorios

- `src/foundation` y `src/project-format` son la Foundation local de este repositorio y pertenecen exclusivamente a `FusionStructure`.
- Está prohibido depender de `@fusionstructure/foundation` o importar código interno de `fstructure`, `fusionstructure-space3d` o `fusionstructure-web`.
- Los productos hermanos sólo se incorporan mediante releases GitHub inmutables y las rutas declaradas en `migration/product-releases.json`.
- Los contratos compartidos declaran `schemaVersion` y, cuando producen resultados, `algorithmVersion`. Un cambio incompatible crea una versión nueva; no reemplaza silenciosamente una versión existente.
- Una modificación interna de la Foundation de un producto se prueba y revisa sólo en el repositorio propietario. El principal se actualiza únicamente cuando ese producto publica una release.

## Dirección de producto

El producto se organiza alrededor de un proyecto común. Las futuras superficies deben poder relacionarse con:

- identidad, contexto, ubicación, unidades y fases;
- modelo físico y modelo analítico;
- entradas, hipótesis, resultados y procedencia;
- documentos, revisiones, incidencias y aprobaciones;
- cantidades, costos, recursos y programa;
- campo, seguridad, cambios y expediente final;
- educación, ejemplos y explicaciones.

Una feature nueva debe declarar qué entidad del proyecto modifica, qué validaciones necesita, cómo se deshace, cómo se guarda, cómo se exporta y cómo se prueba.

## Trabajo experimental

- Diferenciar siempre `Disponible`, `Experimental`, `Planeado` y `No comprometido`.
- No esconder limitaciones detrás de una interfaz pulida.
- No describir el producto como patentado, certificado, protegido o listo para obra si no existe evidencia específica.
- Mantener las unidades y las conversiones explícitas.
- Tratar resultados derivados como resultados versionados, no como datos de entrada.
- Preferir formatos abiertos y adaptadores aislados.
- Evitar que la interfaz sea la única fuente de reglas de negocio.

## Flujo de cierre

El usuario autorizó actualizar el repositorio en esta sesión. Para cambios posteriores, no hacer push ni abrir un Pull Request salvo que se solicite explícitamente en esa sesión.

Si el cambio toca una superficie crítica, dejar una nota de decisión o una prueba reproducible. Si una puerta falla, reportar el fallo exacto y no presentarlo como éxito.
