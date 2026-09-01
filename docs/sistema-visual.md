# Sistema visual

Este documento registra el sistema visual que ya existe en la aplicación. La landing de plataforma puede expresar la visión completa del producto mediante narrativa, iconos e imágenes conceptuales, sin presentar esa expresión como evidencia de capacidades implementadas.

## Dirección actual

FusionStructure usa un minimalismo técnico acromático:

- fondos, superficies, texto y controles trabajan con valores neutros;
- el contraste y el espacio comunican jerarquía;
- el color se reserva para significados del dominio;
- la profundidad se expresa con filetes y niveles, no con volumen decorativo;
- la densidad debe favorecer lectura, edición y revisión técnica.

La landing aplica esta fundación en una escala editorial: titulares grandes, superficies abiertas, una sola acción primaria y color restringido a las trazas de dominio presentes en las imágenes y los iconos de familia. Las seis familias (`Análisis`, `Modelo`, `Civil`, `Proyecto`, `Conexiones` y `Aprendizaje`) deben conservar iconografía lineal, etiquetas breves y una imagen seleccionable; no se convierten en un catálogo de tarjetas ni en una promesa de implementación.

## Colores de dominio

| Color | Uso |
|---|---|
| Rojo | cargas puntuales, cargas distribuidas y momentos aplicados |
| Azul | axial y deformada |
| Verde | cortante y reacciones |
| Amarillo | cotas y geometría de referencia |
| Rosa | momento flector |

Estos colores conservan su significado entre Día y Noche. No deben utilizarse como relleno ornamental de paneles ni como estados ambiguos.

## Materia y jerarquía

La interfaz usa niveles explícitos:

| Nivel | Uso | Regla |
|---|---|---|
| Plano | rejilla, tablas y filas técnicas | filete suave, sin sombra |
| Interior | cavidad de interacción | separación contenida |
| Elevado | paneles y barras | superficie definida, sin volumen exagerado |
| Flotante | menús, popovers y toasts | filete y sombra de contacto |
| Hoja | superficies que nacen de un borde | separación clara del contenido |
| Modal | interrupciones | velo y prioridad visual |

Una superficie no debe apilar tarjetas innecesariamente. Un componente debe comunicar su nivel por posición, espacio y filete antes que por decoración.

## Implementación

- `src/design-system/tokens.css` declara valores y roles;
- `src/design-system/material.css` asigna materia por nivel;
- `src/design-system/components/ui.css` contiene componentes compartidos;
- `src/styles.css` contiene la fundación general;
- `src/features/**/*.css` contiene layout y detalle de cada superficie;
- `src/design-system/designSystem.test.ts` comprueba invariantes visuales.

Las hojas de feature deben consumir roles del sistema. No deben crear otra raíz de tokens, introducir colores literales sin decisión o usar `!important` como capa de reconciliación.

## Reglas de extensión

- Si falta un rol, revisar primero si existe uno equivalente.
- Si una diferencia es de dominio, usar un color de dominio; si es de jerarquía, usar tamaño, espacio, peso o inversión.
- Mantener radios y filetes consistentes con la función del componente.
- No agregar claymorphism, glassmorphism o volumen por defecto sin una decisión específica de producto y una revisión visual independiente.
- Cualquier cambio importante debe acompañarse de capturas comparables, revisión de accesibilidad y comprobación en Día y Noche.

## Alcance de esta actualización

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
queda en el borde inferior y lee coordenadas/escala directamente del lienzo:
el canvas no repite esas lecturas ni el modo activo mientras no haya una
colocación que cancelar. Inicio usa la misma idea como una franja compacta
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
