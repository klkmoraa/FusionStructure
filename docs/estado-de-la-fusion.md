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

## Lo que falta

Ordenado por lo que más riesgo quita.

### 1 · Pruebas — el hueco más grande

| Repositorio | Ficheros de prueba |
|---|---|
| StructureCo | 303 |
| Copia-web | 318 |
| FusionStructure | **1** |

La fusión trajo el código de producto y dejó atrás la práctica totalidad de la
suite. Ahora mismo lo único que cubre el repositorio es la guarda del sistema
visual (14 pruebas). El motor de análisis, el solver, las migraciones de
proyecto, el `ProjectCommand`, la importación DXF, el PDF y Space 3D **no
tienen ninguna prueba**, y son justamente las partes donde un error es
silencioso y caro.

La infraestructura ya está puesta (`vitest`, `jsdom`, `@testing-library/react`,
`npm run test` dentro de `npm run check`), así que portar suites es trabajo
mecánico. Orden sugerido por riesgo:

1. `src/engine/**` — solver, diagramas, envolventes, unidades. Es numérico y
   verificable, y un fallo aquí invalida todo lo que la aplicación muestra.
2. `src/data/migrate.ts` y `src/data/projectStorage.ts` — una migración rota
   pierde proyectos del usuario.
3. `src/commands/projectCommand.ts` — el contrato de patches reversibles que
   sostiene el historial y el undo/redo.
4. `src/utils/pdf/**` y `src/utils/portable*` — el expediente y la memoria de
   cálculo son el entregable del usuario.
5. `src/import/dxf/**` — ya trae sus propios fixtures en el árbol.

### 2 · Integración continua

No hay ningún workflow. Los dos repositorios de origen traen tres cada uno
(`ci.yml`, publicación de páginas y QA de release). Hasta que exista un
`ci.yml` que ejecute `npm run check`, nada impide que un cambio rompa la
compilación o la identidad visual sin que se note.

### 3 · Documentación de agentes

No hay `AGENTS.md`. Ambos orígenes lo tienen, y sin él cada sesión de trabajo
—humana o no— redescubre las convenciones del repositorio desde cero.

### 4 · Scripts de QA

FusionStructure tiene 9 scripts; StructureCo 48 y Copia-web 40. Falta en
particular el arnés `qa.mjs` que ambos usan para recorrer la aplicación real
con un navegador. La receta de esta fusión demostró que ese tipo de
comprobación encuentra cosas que ninguna prueba unitaria ve: los colores
heredados que quedaban vivos se localizaron midiendo estilos computados sobre
la aplicación en marcha, no leyendo CSS.

### 5 · Rematar el minimalismo pantalla por pantalla

La fundación ya es correcta en todas partes, pero algunas superficies siguen
con la densidad y la retórica de los productos de origen:

- **Inicio** (`totalHome.css`, ~850 líneas) — la escala tipográfica y los
  radios ya bajaron, pero el héroe sigue siendo una tarjeta grande con mucho
  aire y varias secciones podrían ser una sola lista densa.
- **Inspector y Resultados** — todavía escriben descripciones largas donde la
  regla 4 pide una cifra.
- **Copys** — hay textos de ayuda heredados que hoy sobran; la interfaz ya no
  necesita explicarse tanto.

### 6 · Deuda de nombres

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
