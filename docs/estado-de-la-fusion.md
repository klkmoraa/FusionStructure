# Estado de la fusión

Qué se trajo de StructureCo y Copia-web, qué está hecho y qué falta. Este
documento es la lista de trabajo pendiente de la fusión, no un resumen del
producto: para eso está el [README](../README.md).

## Lo que ya está

**El producto funciona de extremo a extremo.** El motor de análisis, el dominio
espacial, los resultados, el Aula, la memoria de cálculo PDF, el expediente
portable, la importación DXF y el shell PWA vinieron enteros y compilan,
tipan y arrancan.

**La identidad visual es propia.** La fundación se reescribió por completo:
minimalismo acromático con cinco hues reservados al dominio, sin claymorphism y
con los dos temas vivos. Ver [`sistema-visual.md`](sistema-visual.md).

**Las capas de parches están retiradas.** `src/minimal/` (8 archivos) y los
cuatro acompañantes `*Minimal.css` sumaban unas 1.500 líneas cuya única función
era tapar con `!important` la fundación heredada. Ya no existen.

**El tema oscuro vuelve a existir.** Estaba clavado a `'light'` con un
`setTheme` vacío: el conmutador y el comando de la paleta existían sin hacer
nada.

**Las ilustraciones son de este producto.** Los 80 PNG de
`public/assets/structural/` venían horneados con el marfil y la menta de
StructureCo. Regenerados, y con `npm run assets:render` para rehacerlos.

**Hay integración continua.** `.github/workflows/ci.yml` ejecuta `npm run
check` en cada push y PR.

**Hay reglas persistentes.** [`AGENTS.md`](../AGENTS.md) documenta qué manda y
por qué este repositorio no hereda la política de fronteras de código
protegidas de StructureCo/Copia-web.

## Lo que falta

Ordenado por lo que más riesgo quita.

### 1 · Pruebas — cobertura mínima de las fronteras de datos

| Repositorio | Ficheros de prueba |
|---|---|
| StructureCo | 303 |
| Copia-web | 318 |
| FusionStructure | **8** (41 pruebas) |

`src/engine/**` (el solver) queda deliberadamente sin cubrir: es la pieza que
más va a cambiar mientras el dominio siga siendo experimental, y una suite
numérica extensa sobre un motor que aún se mueve es coste que se vuelve a
pagar en cada rediseño. Cuando el solver se estabilice, es el primer candidato
para una suite propia.

Lo que sí se cubrió — con pruebas mínimas, no con la suite completa de los
repos de origen — son las seis fronteras por las que puede perderse o
corromperse el proyecto del usuario sin que la aplicación lo note:

| Módulo | Qué protege | Pruebas |
|---|---|---|
| `data/migrate.ts` | Que un archivo, enlace o respaldo ajeno no entre corrupto ni se acepte de un esquema futuro desconocido. | 4 |
| `data/projectStorage.ts` | Que un primario dañado en `localStorage` recupere desde el respaldo en vez de perder el proyecto en silencio. | 4 |
| `commands/projectCommand.ts` | El contrato de deshacer/rehacer: aplicar un patch y su inverso reproduce el proyecto exacto. | 2 |
| `data/modelOperations.ts` | Que fusionar nudos y dividir miembros no deje ninguna referencia (`i`/`j`, cargas) apuntando a un nudo eliminado. | 5 |
| `import/dxf/dxfParser.ts` | Que la única geometría ajena que entra a la aplicación produzca un comando reversible como cualquier otro. | 4 |
| `utils/shareLink.ts` | Que un enlace compartido roto se rechace en vez de reemplazar el proyecto activo con datos parciales. | 4 |
| `utils/portablePayload.ts` | Que el checksum del expediente detecte manipulación, no sólo la declare. | 4 |

La infraestructura está en `vite.config.ts` (`vitest` + `jsdom` +
`@testing-library/react`, `npm run test` dentro de `npm run check`), así que
ampliar cualquiera de estas suites o añadir una nueva es trabajo mecánico.

Fuera de alcance por ahora, y por qué:

- **`utils/pdf/**`** — genera un documento visual; una prueba unitaria de sus
  ~20 archivos verificaría estructura de bytes, no que el PDF se vea bien.
  Cuando haga falta cubrirlo, un smoke test de `createCalculationReport` que
  compruebe que produce un PDF válido y no lanza es más valioso que asertar
  contenido.
- **Space 3D** — dominio separado y todavía experimental, mismo argumento que
  el solver 2D.

### 2 · Scripts de QA y el resto de la integración continua

`ci.yml` ejecuta la puerta de calidad, pero los dos repositorios de origen
traen además publicación de páginas y QA de release — eso sigue sin existir
aquí. FusionStructure tiene 9 scripts; StructureCo 48 y Copia-web 40. Falta en
particular el arnés `qa.mjs` que ambos usan para recorrer la aplicación real
con un navegador. La receta de esta fusión demostró que ese tipo de
comprobación encuentra cosas que ninguna prueba unitaria ve: los colores
heredados que quedaban vivos se localizaron midiendo estilos computados sobre
la aplicación en marcha, no leyendo CSS.

### 3 · Rematar el minimalismo pantalla por pantalla

La fundación ya es correcta en todas partes, pero algunas superficies siguen
con la densidad y la retórica de los productos de origen:

- **Inicio** (`totalHome.css`, ~850 líneas) — la escala tipográfica y los
  radios ya bajaron, pero el héroe sigue siendo una tarjeta grande con mucho
  aire y varias secciones podrían ser una sola lista densa.
- **Inspector y Resultados** — todavía escriben descripciones largas donde la
  regla 4 pide una cifra.
- **Copys** — hay textos de ayuda heredados que hoy sobran; la interfaz ya no
  necesita explicarse tanto.

### 4 · Deuda de nombres

Quedan rastros del origen en identificadores que el usuario no ve pero que
confunden a quien lee el código: la extensión de expediente sigue siendo
`.structureco.json`, y hay claves de `localStorage` con el prefijo
`structureCo.` (el tema ya migró a `fusionstructure.theme`). Cambiarlas exige
una migración cuidadosa —hay proyectos guardados con esos nombres—, así que es
trabajo consciente, no un renombrado masivo.

## Cómo comprobar el estado hoy

```bash
npm run check        # lint + typecheck + test + build
npm run dev          # y mirar la aplicación de verdad
```
