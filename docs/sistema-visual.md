# Sistema visual

Este documento registra el sistema visual que ya existe en la aplicación. La landing de plataforma puede expresar la visión completa del producto mediante narrativa, iconos e imágenes conceptuales, sin presentar esa expresión como evidencia de capacidades implementadas.

## Dirección actual

La fundación implementa el brandbook de FusionStructure. Su frase rectora es
**Make complexity legible** y se traduce en cuatro reglas:

- **el chrome no tiene color:** fondos, superficies, texto y controles son
  neutros —papel en Día, carbón en Noche— y el acento es la tinta misma;
- **el color es del dominio:** seis señales y sólo para significar algo que el
  solver o el modelo dicen;
- **la profundidad es el filete:** un borde de 1 px y el espacio separan; la
  sombra existe en un único escalón de contacto, reservado a lo que puede tapar
  contenido;
- **menos superficie, menos texto:** radios cortos, filas densas, etiquetas
  breves; lo que se puede decir con una cifra no lleva una frase.

Donde el brandbook publica un valor que no aguanta la prueba de contraste sobre
las cuatro superficies del producto, aquí vive el escalón que sí la aguanta y el
valor publicado queda como la tinta del tema que lo necesita. El brandbook es un
borrador; esta implementación es la que se puede comprobar.

La landing aplica esta fundación en una escala editorial: titulares grandes, superficies abiertas, una sola acción primaria y color restringido a las trazas de dominio presentes en las imágenes y los iconos de familia. Las seis familias (`Análisis`, `Modelo`, `Civil`, `Proyecto`, `Conexiones` y `Aprendizaje`) usan los glifos funcionales de la identidad de producto, con etiquetas breves y una imagen seleccionable; no se convierten en un catálogo de tarjetas ni en una promesa de implementación.

La fuente de los activos de marca es `brandbook-site/public/brand/`. La marca madre conserva un núcleo abierto; los glifos de herramienta identifican cada familia incluso sin color. La landing mantiene esta aplicación acotada a la superficie editorial y no declara capacidades que aún estén en evolución.

## Identidad de módulo

El solver 2D tiene nombre propio: **Plano**. Es una herramienta de la familia de
FusionStructure, no una función sin cara, y la interfaz lo nombra donde importa
—consola del editor, cabecera de Inicio, portada del módulo—. `Solver 2D` sigue
siendo su rol dentro del catálogo (`FS-A01`); `Plano` es cómo se llama.

Su marca reutiliza la geometría de la marca madre: el mismo marco de cuatro
piezas, con el color de la colección —el coral de acción— y un glifo funcional
que dice lo que el módulo hace: una barra recta, que es la geometría que entra,
y su deformada, que es la respuesta que devuelve.

| Pieza | Dónde vive |
|---|---|
| Componentes de marca | `src/design-system/brand.tsx` (dibujados con `currentColor`, siguen al tema) |
| Identidad de texto | `src/design-system/moduleIdentity.ts` |
| Activos estáticos | `public/assets/brand/plano-mark.svg`, `plano-mark-inverse.svg`, `plano-lockup.svg` |

## Papel y carbón

El chrome no tiene color. Día es papel cálido y Noche es carbón frío, los dos
tomados del brandbook, y la desviación entre canales de un rol de chrome nunca
pasa de 12 sobre 255: suficiente para que el papel tenga temperatura, demasiado
poco para competir con una señal. La guarda lo mide en cada `npm run check`.

| Rol | Día | Noche |
|---|---|---|
| Papel de la aplicación | `#f7f6f1` | `#141719` |
| Mesa de trabajo | `#fdfdfb` | `#171a1c` |
| Panel | `#fdfdfb` | `#1c2023` |
| Filete | `#dcdbd3` | `#333a3d` |
| Tinta | `#171a1c` | `#f4f4f1` |

## Las seis señales

El color es del dominio. Seis significados y ninguno más; se usan como TRAZO,
no como relleno de superficie.

| Señal | Trazo | Uso |
|---|---|---|
| Axial | `#2795e0` | fuerza normal: tensión y compresión |
| Cortante | `#1ba268` | cortante y reacciones de apoyo |
| Momento | `#de5ca4` | momento flector y líneas de influencia |
| Acción | `#f0564c` | cargas puntuales, distribuidas y momentos aplicados |
| Deformada | `#8a73f5` | geometría desplazada, modos y pandeo |
| Aviso | `#e8b22e` | cotas, revisión y resultados caducos |

Estos valores conservan su significado entre Día y Noche: un momento flector no
cambia de color al apagar la luz.

Cada señal tiene además una **tinta**, que es la misma señal en el escalón que
necesita una cifra o una etiqueta. La tinta sí se recalibra por tema, porque
cambia el papel debajo. Ahí es donde viven los valores publicados en el
brandbook (`#63C5FF`, `#FF6F66`, `#55C990`, `#F3C553`, `#9B87FF`, `#EF7AB9`):
se dibujaron sobre carbón y sobre papel se quedan por debajo del mínimo gráfico
de 3:1, así que son la tinta de Noche y no el trazo compartido.

El aviso es el único caso con una regla propia y una razón física: ningún
amarillo llega a 3:1 sobre papel sin dejar de ser amarillo. En Día se pinta con
su tinta; el valor de trazo se reserva a Noche.

## Movimiento

Cuatro duraciones, una por trabajo. Nada dura más que *Revelar* salvo lo que de
verdad está procesando, y todo respeta `prefers-reduced-motion`.

| Nombre | Valor | Trabajo |
|---|---|---|
| Rápido | 120 ms | foco y control |
| Puente | 180 ms | cambio de plano |
| Revelar | 260 ms | contenido contextual |
| Pulso | 680 ms | espera y proceso |

Las animaciones del producto son dos y las dos explican una causa: el diagrama
de portada de Plano, que revela geometría, apoyos, carga, momento y deformada en
el orden en que ocurre el trabajo, y la entrada del diagrama en el lienzo, que
se dibuja cuando llega una corrida nueva. La segunda está encadenada a la
identidad de la corrida y no al render: un paneo o un zoom no la repiten.

## Materia y jerarquía

La interfaz usa niveles explícitos:

| Nivel | Uso | Regla |
|---|---|---|
| Base | rejilla, tablas y filas técnicas | filete suave, sin sombra |
| Interior | cavidad de interacción | separación contenida |
| Elevado | paneles y barras | superficie definida, sin volumen exagerado |
| Flotante | menús, popovers y toasts | filete y sombra de contacto |
| Hoja | superficies que nacen de un borde | separación clara del contenido |
| Modal | interrupciones | velo y prioridad visual |

El nivel base se llamaba «Plano». Se renombró a «Base» cuando el solver 2D pasó
a llamarse Plano: dos cosas distintas no pueden compartir nombre dentro del
mismo sistema.

Una superficie no debe apilar tarjetas innecesariamente. Un componente debe
comunicar su nivel por posición, espacio y filete antes que por decoración.

## La especificidad es parte del sistema

Tres defectos con la misma forma dejaron piezas enteras invisibles o ilegibles,
y por eso la regla tiene rango de norma:

- `.console button span { opacity: 0 }` ocultaba las etiquetas de la consola y,
  de paso, el icono de cada herramienta del riel que la consola aloja;
- `.console button svg` heredaba `flex-shrink: 1` y se reducía a 0 px de ancho
  en cuanto la etiqueta no cabía;
- `.sc-home button { color: inherit }` le ganaba a cualquier acción con color
  propio, así que una acción primaria quedaba tinta sobre tinta.

De ahí dos prácticas: **un reinicio se escribe con `:where()` en las dos mitades
del selector**, para que pese cero y ningún componente tenga que pelearlo; y
**un selector que apunta a un elemento genérico dentro de un contenedor con
descendencia ajena se nombra**, en vez de alcanzar todo lo que haya dentro.

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
- **No añadas una séptima señal.** Si algo necesita destacar y no es dominio,
  lo que necesita es jerarquía —tamaño, peso, espacio, inversión a tinta—, no
  color. Repetir una acción no es un estado de éxito; un aviso de interfaz no
  es una cota.
- **No devuelvas el volumen.** Un hover cambia de plano; no levanta la pieza.
  Un control pulsado cambia de plano; no se hunde.
- **Radios por rol, no por tamaño.** Un botón de 44px y otro de 28px son los
  dos controles y comparten radio.
- **Un reinicio pesa cero.** Escríbelo con `:where()` en las dos mitades del
  selector; si le gana a un componente, deja de ser un reinicio.
- **No apuntes a un elemento genérico dentro de un contenedor con descendencia
  ajena.** La consola aloja el riel de herramientas completo: un `span` o un
  `svg` sin nombre alcanza también lo que no es suyo.

## La guarda

`src/design-system/designSystem.test.ts` comprueba estas invariantes en cada
`npm run check`, porque no basta con haber retirado el claymorphism una vez:
cualquier regla copiada de cualquiera de los dos productos de origen lo
reintroduce. Las dieciocho pruebas verifican, entre otras cosas, que ninguna
sombra tenga luz interior o proyecte en dos direcciones, que la desviación de
canal de un rol de chrome no pase de 12 en ninguno de los dos temas, que las
seis señales se declaren una sola vez y no se redefinan en Noche, que cada
señal se separe del papel y del carbón al menos 3:1 —y que el aviso, que no
puede, se pinte con su tinta sobre papel—, que ninguna hoja declare un radio
fuera de la escala y que la paleta de los dos productos de origen no haya
vuelto a colarse en ningún archivo.

`src/features/canvas/labelLayout.test.ts` comprueba lo que sostiene la
legibilidad del lienzo lleno: que un mismo valor pedido dos veces desde el mismo
punto se dibuje una, que el mismo valor en dos puntos distintos se dibuje dos, y
que tres cifras obligatorias ancladas en el mismo sitio acaben sin taparse.
