# Project-format neutral v0.1

Estado: **Experimental**. Este documento describe un sobre de proyecto neutral y ejecutable; no certifica análisis, compatibilidad estructural ni preparación para obra.

## Límite del formato

`project-format` v0.1 es un manifiesto con `formatVersion: "0.1"` y media type `application/vnd.fusionstructure.project-format+json`. Su contrato ejecutable vive en `src/project-format/` y su esquema Draft 2020-12 en [`schemas/project-format-0.1.schema.json`](../schemas/project-format-0.1.schema.json).

El manifiesto establece:

- identidad estable del proyecto y marcas de tiempo UTC;
- unidades predeterminadas y contextos de coordenadas declarados;
- productor, referencia de esquema `application/schema+json`, dependencias y sus SHA-256;
- metadatos de revisiones, activos y descriptores de extensiones;
- referencias de payload por `path`, media type y SHA-256.

No incorpora modelos 2D, 3D, interfaz, stores ni resultados de ningún motor. Un payload de dominio siempre es un archivo independiente declarado en `payloads`; el sobre sólo comprueba su ruta y sus bytes, sin interpretarlo.

## Integridad y preservación

`canonicalizeProjectFormatJson` ordena las claves JSON de forma recursiva y rechaza valores que no son JSON. `writeProjectFormatPackage` emite esos bytes canónicos para el manifiesto. Cada descriptor de archivo usa SHA-256 hexadecimal en minúsculas sobre los bytes exactos del archivo, no sobre texto normalizado.

Las extensiones son opacas: la frontera no intenta abrirlas ni convertirlas. `readProjectFormatPackage` y `writeProjectFormatPackage` copian los `Uint8Array` de extensiones declaradas byte por byte. Por ello una extensión desconocida puede sobrevivir a una lectura/escritura válida aunque el consumidor no conozca su media type.

La validación devuelve informes estructurados, no excepciones para entrada inválida. Rechaza rutas absolutas, traversal, separadores Windows y rutas de unidad; IDs o rutas duplicadas; hashes inválidos o que no coinciden; archivos sin descriptor; manifiestos malformados; y cualquier downgrade destructivo desde v0.1. Una migración a otra versión requiere un adaptador explícito.

## Escritura segura y almacenamiento

La frontera trabaja con un manifiesto y un `Map<path, Uint8Array>` en memoria. No hace E/S de disco ni implementa lectura ZIP parcial. Así evita aceptar archivos ZIP con rutas no verificadas o contenidos que no puede validar completamente.

La capa de persistencia debe aplicar copy-on-write:

1. leer mediante `readProjectFormatPackage`, que devuelve copias aisladas;
2. modificar sólo esas copias y volver a validar con `writeProjectFormatPackage`;
3. escribir los bytes devueltos a una ubicación temporal del mismo volumen;
4. confirmar y sustituir el destino con una operación atómica proporcionada por la plataforma;
5. conservar el archivo anterior si falla la sustitución.

Si el destino es de sólo lectura, está bloqueado o no admite sustitución atómica, la persistencia no debe degradar a sobrescritura directa. Debe informar el fallo y ofrecer una ubicación nueva o una exportación explícita. El contrato v0.1 conserva esa decisión fuera de la frontera para que cada plataforma pueda aplicar su propia operación atómica.

## Relación con el portable 2D existente

El portable 2D existente conserva exactamente su MIME `application/vnd.fusionstructure.project+json` y su `formatVersion: 1`. `src/project-format/legacy2d.ts` sólo lo reconoce como una costura de migración externa (`external-adapter-required`); no lo transforma, no lo llama universal y no cambia la implementación portable actual.
