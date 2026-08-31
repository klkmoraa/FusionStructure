# Sistema visual

FusionStructure es **minimalismo puro**. La dirección completa vive en un solo
archivo —`src/design-system/tokens.css`— y este documento explica por qué es
así y cómo extenderla sin romperla.

## De dónde venimos

Los dos productos de origen traían direcciones visuales incompatibles:

| | StructureCo | Copia-web |
|---|---|---|
| Fondo | Marfil cálido `#f3eee4` | Gris acromático |
| Marca | Menta `#007d61` | Azul de sistema |
| Profundidad | Claymorphism: sombra abajo-derecha + luz arriba-izquierda + dos capas `inset` por pieza | Material translúcido y filete de medio píxel |
| Radios | 10 / 18 / 24 / 28px | Cortos |

La primera versión de la fusión adoptó la base de StructureCo entera y le puso
encima una capa de reconciliación (`src/minimal/`, ocho archivos y unas 700
líneas de `!important`) que la pintaba de blanco. El claymorphism seguía
enviándose en el CSS; sólo estaba tapado. El resultado no era una aplicación
nueva sino StructureCo blanqueada, con sus radios y los grises de Copia-web —y,
de paso, con el tema oscuro apagado a la fuerza.

FusionStructure sustituye la fundación en lugar de taparla. No hay capa de
parches, no hay `!important` de reconciliación y no hay una segunda verdad.

## Las cuatro reglas

**1 · La interfaz no tiene color.** Fondos, superficies, filetes, texto,
acciones y estados de control son acromáticos: los tres canales RGB coinciden.
El acento de marca es la tinta misma. En Día la acción primaria es un plano
negro con etiqueta blanca; en Noche se invierte exactamente. Es la decisión que
más separa a FusionStructure de sus dos orígenes — ni menta ni azul de sistema,
sencillamente el contraste máximo disponible.

**2 · El color es del dominio.** Sólo cinco hues entran en la aplicación, y
sólo para significar algo que el modelo o el solver dicen:

| Hue | | Significa |
|---|---|---|
| Rojo | `#e5484d` | Lo que se aplica a la estructura: cargas puntuales, repartidas y momentos aplicados. |
| Azul | `#3b82f6` | Axial (N) y deformada — desplazamiento. |
| Verde | `#22a06b` | Cortante (V) y reacciones — la respuesta del apoyo. |
| Amarillo | `#d4a017` | Cotas y geometría de referencia. |
| Rosa | `#d9469b` | Momento flector (M). |

Se usan como **trazo**, no como relleno de superficie: un panel nunca se tiñe,
una línea sí. Y se declaran una sola vez en `:root`: un momento flector no
cambia de significado al apagar la luz, así que el bloque de tema oscuro no
puede redefinirlos.

**3 · La profundidad es el filete.** Un borde de 1px y el espacio separan las
cosas. La escala de sombras resuelve a `none` salvo un único escalón de
contacto, reservado a lo que puede **tapar** contenido —popover, hoja, modal,
toast—. Ahí la sombra es información: dice que esa pieza está delante. Es una
sola dirección, sin luz interior y sin tinte.

**4 · Menos superficie, menos texto.** Radios cortos (3 / 4 / 6 / 8px),
tarjetas pequeñas, filas densas, etiquetas breves. Lo que se puede decir con
una cifra no lleva una frase. La consola deja visibles sólo proyecto, acción y
estado; el resto es icono con `aria-label` o una divulgación `?` cuando es una
salvedad real de cálculo.

## Planta de la aplicación

El editor tiene dos piezas de cromo permanentes, no tres superficies que
compitan entre sí:

```
Console (52px)  ← navegación, herramientas y acciones del proyecto
Canvas          ← trabajo y una única superficie contextual activa
Instrument (24px) ← estado, guardado, coordenadas, escala y conteos
```

En escritorio la `Console` ocupa la columna izquierda y se expande sólo al
interactuar; en K0 es una banda inferior deslizable. `Instrument` siempre se
queda en el borde inferior. Inicio usa la misma idea como una franja compacta
de destinos: no existe una barra lateral permanente. Las superficies de detalle,
configuración, vista y resultados comparten un único hueco contextual, de modo
que abrir una sustituye a la anterior.

Tres registros tipográficos mantienen la jerarquía: interfaz (`Instrument
Sans`) para controles y nombres; mono para datos, coordenadas y unidades; y
el registro de pantalla sólo para el nombre activo del proyecto. Ninguno se
usa para convertir una explicación en decoración.

## Cómo está montado

```
src/design-system/tokens.css     ← la única capa que declara valores
src/design-system/fonts.css      ← las dos familias autoalojadas
src/styles.css                   ← reinicio, marco de la aplicación, interacción
src/design-system/material.css   ← materia por nivel de elevación
src/design-system/components/ui.css ← los componentes `.sc-*`
src/features/**/*.css            ← layout y detalle de cada pantalla
```

El orden importa y no necesita `!important` para funcionar: `styles.css`
importa la fundación, `material.css` se carga después desde `App.tsx`, y
`ui.css` viaja en el chunk diferido del espacio de trabajo, así que su materia
gana la cascada a las hojas de feature sin duplicar selectores.

### Materia por nivel

`design-system/material.css` declara la materia una vez por rol de elevación.
`Surface` emite `data-level`; cualquier selector puede sumarse a un grupo.

| Nivel | Qué es | Materia |
|---|---|---|
| `flat` | Rejilla técnica: tablas, filas del inspector | Filete suave, sin sombra |
| `inset` | Cavidad de interacción | Un plano por debajo, sin sombra |
| `raised` | Paneles, barras, tarjetas | Filete propio, sin sombra |
| `floating` | Popover, menú, toast | Filete + sombra de contacto |
| `sheet` | Plano que nace de un borde | Filete + sombra de contacto ascendente |
| `modal` | Interrupción con velo | Filete + sombra de contacto profunda |

Regla que sostiene el conjunto: **un nivel no se repite dentro de sí mismo**.
Nada de tarjeta dentro de tarjeta; el contenido de un panel vuelve a plano.

## Extender el sistema

- **No declares un literal de color en una hoja de feature.** Si te falta un
  rol, añádelo a la fundación; si lo que falta es un matiz, probablemente el
  rol que buscas ya existe con otro nombre.
- **No declares `:root` en una hoja de feature.** Esa era exactamente la razón
  por la que la capa anterior necesitaba `!important`.
- **No añadas un sexto hue.** Si algo necesita destacar y no es dominio, lo que
  necesita es jerarquía —tamaño, peso, espacio, inversión a tinta—, no color.
- **No devuelvas el volumen.** Un hover cambia de plano; no levanta la pieza.
  Un control pulsado cambia de plano; no se hunde.
- **Radios por rol, no por tamaño.** Un botón de 44px y otro de 28px son los
  dos controles y comparten radio.

## La guarda

`src/design-system/designSystem.test.ts` comprueba estas invariantes en cada
`npm run check`, porque no basta con haber retirado el claymorphism una vez:
cualquier regla copiada de cualquiera de los dos productos de origen lo
reintroduce. Las catorce pruebas verifican, entre otras cosas, que ninguna
sombra tenga luz interior o proyecte en dos direcciones, que los roles de
chrome sean acromáticos en ambos temas, que los cinco hues no se redefinan en
Noche, que ninguna hoja declare un radio fuera de la escala y que la paleta de
los dos productos de origen no haya vuelto a colarse en ningún archivo.
