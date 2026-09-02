# Sistema visual

Este documento registra el sistema visual que ya existe en la aplicación. La landing de plataforma puede expresar la visión completa del producto mediante narrativa, iconos e imágenes conceptuales, sin presentar esa expresión como evidencia de capacidades implementadas.

## Dirección actual

La fundación implementa el brandbook de FusionStructure. Su frase rectora es
**Make complexity legible** y se traduce en cuatro reglas:

- **el chrome no tiene color:** fondos, superficies, texto y controles son
  neutros —papel en Día, carbón en Noche— y el acento es la tinta misma;
- **el color es del dominio:** seis señales y sólo para significar algo que el
  solver o el modelo dicen;
- **la profundidad es una sola luz:** el filete de 1 px sigue delimitando y
  además hay un escalón de arcilla —sombra abajo-derecha, contacto claro
  arriba-izquierda—; la luz es del sistema y no de la pieza, así que ninguna
  superficie se ilumina sola ni tiñe;
- **menos superficie, menos texto:** filas densas y etiquetas breves; lo que se
  puede decir con una cifra no lleva una frase. El radio acompaña a la sombra,
  pero la densidad no se negocia.

El producto implementa el brandbook publicado: sus doce valores de señal, sus
siete familias, sus cuatro estados, su escala de radios y su escala de
movimiento. Lo que antes se registraba aquí como *«el brandbook es un borrador y
esta implementación es la que se puede comprobar»* dejó de ser cierto para color,
forma y movimiento: la fundación ya no baja ningún escalón por su cuenta.

Queda **una divergencia viva y declarada**: las familias tipográficas. El
brandbook las carga del CDN de Google (Space Grotesk, Inter, IBM Plex Mono) y la
aplicación auto-hospeda las suyas (Instrument Sans, Geist Mono) en
`public/fonts/`, porque el producto se compromete con el uso sin red. Es una
decisión de PWA, no de estilo, y no se resuelve cambiando un token. La *escala*
tipográfica sí es la del brandbook.

Y hay una escala que el brandbook **no** publica y el producto necesita: las
cargas aplicadas. Los seis significados del brandbook son todos respuesta de la
estructura, y una carga no es una respuesta. Ver *Las seis señales, y la
séptima*.

La landing aplica esta fundación como hub de producto: el héroe explica la plataforma y baja al catálogo; no abre un solver por defecto. `Solver 2D` y `Solver 3D` tienen tarjetas prominentes y acciones independientes. Después aparecen `Elementos finitos`, `CAD`, `BIM`, `Cantidades y costos` y `Aula estructural`, cada uno con el estado real del catálogo (`Disponible`, `Experimental` o `Planeado`). Un módulo planeado conserva botón y espacio de producto, pero su acción permanece deshabilitada para no fingir implementación.

Las imágenes son ocho recortes clay de fondo transparente, uno por superficie y otro para el sistema común, colocados sobre la materia Día/Noche del producto. No llevan texto ni controles pintados: acciones, estados y contenido siguen siendo HTML accesible. El héroe añade un loop WebM transparente de seis segundos producido de forma determinista con HyperFrames/GSAP; su fuente reproducible vive en `motion/landing-loop/` y el render publicado en `public/assets/landing/clay-tools/hero-loop.webm`. Con movimiento reducido se sustituye por `hero-structure.webp`. Cada pieza recibe la única luz del sistema y restringe el color a señales estructurales.

La fuente de los activos de marca es `brandbook-site/scripts/glyph-library.mjs`. De ahí se generan, con `npm run brand:assets` dentro de `brandbook-site/`, tanto los archivos de `brandbook-site/public/brand/` como los que consume la aplicación en `public/assets/brand/` y `public/favicon.svg`. Los activos se versionan; el sitio no los construye en tiempo de ejecución.

La marca madre es una **ménsula**: un miembro vertical y dos voladizos cuyo peralte decrece de 9u a 5u hacia la punta, la forma que toma una sección dimensionada por el momento que recibe. El brazo inferior es el único que puede tomar el color de señal; el resto es tinta. Existen cuatro variantes —señal, mono, inversa e icono— y ninguna gira, se estira ni cambia de color de herramienta.

Los glifos de familia se dibujan en la misma retícula de 48u con trazo 2.6, extremos redondos y un punto en cada nudo. Cada glifo representa el objeto real de su dominio —un pórtico con su diagrama, una placa con pernos, un renglón de precio unitario— y debe distinguirse en tinta, a 20 px y sin etiqueta. La landing mantiene esta aplicación acotada a la superficie editorial y no declara capacidades que aún estén en evolución.

## Identidad de módulo

El solver 2D tiene nombre propio: **FStructure**. Es una herramienta de la
familia de FusionStructure, no una función sin cara, y la interfaz lo nombra
donde importa —consola del editor, cabecera de Inicio, portada del módulo—.
`Solver 2D` sigue siendo su rol dentro del catálogo (`FS-A01`); `FStructure` es
cómo se llama.

El nombre se acorta desde el de la plataforma, así que módulo y producto quedan
cerca. La regla que lo mantiene legible: **FStructure nunca aparece solo cuando
hay sitio para su rol.** El bloque de marca pone el rol antes que la
procedencia (`FStructure · Solver 2D · FusionStructure`), y la portada del
módulo abre con `FusionStructure · Solver 2D` sobre el nombre.

Su marca no repite la marca madre: usa el contenedor de familia —el mismo
rectángulo redondeado de los glifos de herramienta, en el color de la
colección— con un glifo funcional que dice lo que el módulo hace: una barra
recta, que es la geometría que entra, y su deformada, que es la respuesta que
devuelve. La ménsula acompaña al nombre en la firma (`solver-2d-lockup.svg`),
no dentro del glifo.

| Pieza | Dónde vive |
|---|---|
| Componentes de marca | `src/design-system/brand.tsx` (dibujados con `currentColor`, siguen al tema) |
| Identidad de texto | `src/design-system/moduleIdentity.ts` |
| Activos estáticos | `public/assets/brand/solver-2d-mark.svg`, `solver-2d-mark-inverse.svg`, `solver-2d-lockup.svg` |

Los identificadores del código nombran el SLOT, no la marca: `SOLVER_2D`,
`Solver2DMark`, `solver2d-*`. Renombrar el módulo es editar cuatro valores en
`moduleIdentity.ts`; el resto del código no se entera.

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

## Las seis señales, y la séptima

El color es del dominio. Seis significados de resultado, y una séptima familia
para lo que se aplica.

| Señal | Día | Noche | Uso |
|---|---|---|---|
| Axial | `#1b75b0` | `#63c5ff` | fuerza normal: tensión y compresión |
| Momento | `#b8412f` | `#ff8e80` | momento flector |
| Cortante | `#277654` | `#55c990` | cortante y reacciones de apoyo |
| Deformada | `#6a57c8` | `#9b87ff` | geometría desplazada, modos y pandeo |
| Fluencia | `#b44a7e` | `#ef7ab9` | fluencia, y las líneas de influencia |
| Aviso | `#8a6110` | `#f3c553` | cotas, revisión y resultados caducos |

**Lo invariante es el significado, no el hex.** Hasta esta migración una señal
era un trazo único para los dos temas, medido a medio camino entre papel y
carbón, más una tinta que sí se recalibraba. Era defendible y era nuestra, no la
del brandbook, que publica doce valores porque un mismo hex no puede estar
medido a la vez contra `#fdfdfb` y contra `#171a1c`. Con el par, la distinción
trazo/tinta desaparece: el valor de Día ya está en escalón de tinta sobre papel,
así que la misma variable pinta la línea del diagrama y la cifra que la nombra.

Con ello se va también la excepción del aviso. Ningún amarillo llega a 3:1 sobre
papel sin dejar de ser amarillo, y por eso el aviso tenía una regla propia; el
amarillo de Día del brandbook es `#8a6110`, que es ámbar oscuro y pasa. La
guarda de contraste ya no tiene huecos.

Dos cambios de significado, no sólo de valor: el **momento** pasa de rosa a
rojo, que es el rojo del brandbook, y el rosa que era momento pasa a ser
**fluencia**, una señal nueva. `action` deja de ser señal de dominio y queda
como el rol de acción destructiva del chrome, apuntando al mismo rojo: nunca
comparten campo visual, porque uno es cromo y el otro es lienzo.

### La séptima familia: las cargas, en pastel

El brandbook no publica ninguna señal para una carga aplicada. Antes las tres
cargas compartían el rojo de `action`, y con el rojo pasando a momento habrían
quedado del mismo color que el diagrama de momento.

| Carga | Día | Noche |
|---|---|---|
| Puntual | `#5a7f96` | `#9ec9e8` |
| Distribuida | `#a0655c` | `#e5afa6` |
| Momento aplicado | `#57876b` | `#a8cbb6` |

Comparten hue con axial, momento y cortante, y **se separan por croma**: una
carga es un apunte apagado, un resultado es una línea viva. Lo que se aplica a
la estructura y lo que la estructura responde se leen como dos capas distintas.
La guarda mide esa distancia en los dos temas; sin ella, el tono de Día se
desliza hacia el pastel literal hasta desaparecer sobre papel, que es de donde
venimos.

### Familias y estados

A la escala de dominio el brandbook suma dos que no son de resultado, y que el
producto ahora implementa: siete colores de **familia** para agrupar
herramientas (`Núcleo`, `Análisis`, `Modelo`, `Civil`, `Proyecto`,
`Interoperabilidad`, `Aprendizaje`) y cuatro de **estado de madurez** para
`Disponible`, `Experimental`, `Planeado` y `No comprometido`. En un producto
experimental, cuánto se puede confiar en una función es información de primer
orden y no una etiqueta decorativa.

Antes de tenerlas, la interfaz las pedía prestadas: el landing pintaba «Modelo»
con el color de una carga aplicada y «Experimental» con el de un aviso del
solver.

## Movimiento

Seis duraciones, una por trabajo, y las tres curvas del brandbook. Todo respeta
`prefers-reduced-motion`.

| Nombre | Valor | Trabajo |
|---|---|---|
| Instante | 90 ms | acuse de recibo |
| Rápido | 140 ms | foco y control |
| Puente | 200 ms | cambio de plano |
| Revelar | 280 ms | contenido contextual |
| Trazar | 520 ms | dibujar un resultado |
| Pulso | 1400 ms | espera y proceso |

*Trazar* es la única que puede pasar de *Revelar* sin estar procesando: dibujar
un diagrama de momento es la explicación de un resultado, y verlo aparecer de
golpe no explica nada. Cualquier otra cosa que dure más que *Revelar* sin estar
calculando es adorno, y la guarda lo mide.

Curvas: `cubic-bezier(.2,.8,.2,1)` para lo que aparece, `cubic-bezier(.5,0,.75,0)`
para lo que se va —lo que se retira no necesita ser leído— y
`cubic-bezier(.65,0,.35,1)`, simétrica, para un cambio que decide el sistema y
no el dedo. Sin muelles: ninguna curva sobrepasa 1.

Las animaciones del producto son dos y las dos explican una causa: el diagrama
de portada del solver 2D, que revela geometría, apoyos, carga, momento y deformada en
el orden en que ocurre el trabajo, y la entrada del diagrama en el lienzo, que
se dibuja cuando llega una corrida nueva. La segunda está encadenada a la
identidad de la corrida y no al render: un paneo o un zoom no la repiten.

## Materia y jerarquía

La interfaz usa niveles explícitos:

| Nivel | Uso | Regla |
|---|---|---|
| Plano | rejilla, tablas y filas técnicas | filete suave, sin volumen: el dato se queda plano |
| Interior | cavidad de interacción | la misma luz, invertida: se hunde por arriba-izquierda |
| Elevado | paneles y barras | un escalón: sombra abajo-derecha, contacto arriba-izquierda |
| Flotante | menús, popovers y toasts | dos escalones, misma luz |
| Hoja | superficies que nacen de un borde | proyecta hacia su origen: la única sombra que sube |
| Modal | interrupciones | velo y prioridad visual |

Una superficie no debe apilar tarjetas innecesariamente. La elevación significa
intención, no importancia: un panel no sube por ser importante, sube porque tapa
contenido. En reposo una pieza está apoyada, al puntero se levanta y al pulsarla
se hunde un píxel.

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
- La arcilla leve es una decisión de producto tomada y acotada: un escalón, una luz, sin tinte. No agregar glassmorphism, ni una segunda fuente de luz, ni un escalón fuera de la escala sin una decisión específica y una revisión visual independiente.
- Cualquier cambio importante debe acompañarse de capturas comparables, revisión de accesibilidad y comprobación en Día y Noche.

## Alcance de esta actualización

**3 · La profundidad es una sola luz.** Un borde de 1px sigue delimitando, y
además hay un escalón de arcilla: la luz entra por arriba-izquierda, la sombra
cae abajo-derecha y el contacto claro queda arriba-izquierda. La luz es del
**sistema**, no de la pieza: ninguna superficie finge su propia fuente y
ninguna capa tiñe. Lo que puede **tapar** contenido —popover, hoja, modal,
toast— sube un escalón más, porque ahí la sombra es información: dice que esa
pieza está delante.

**4 · Menos superficie, menos texto.** Radios por rol (6 / 12 / 18 / 18 / 24px:
dato, control, tarjeta, panel, modal), tarjetas pequeñas, filas densas,
etiquetas breves. El dato dejó de ser el escalón cero: era la excepción mejor
argumentada del sistema —redondear una celda comparable rompe el barrido lineal
de la columna— y el brandbook la contradice con 6px, que es lo que se
implementa. Lo que se puede decir con
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
| `flat` | Rejilla técnica: tablas, filas del inspector | Filete suave, sin volumen |
| `inset` | Cavidad de interacción | Un plano por debajo + la luz invertida |
| `raised` | Paneles, barras, tarjetas | Filete propio + un escalón de arcilla |
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
- **El volumen es uno, del sistema.** Un hover levanta la pieza y un pulsado la
  hunde un píxel, pero con la luz del sistema: nada de una fuente por pieza, ni
  brillo interior, ni degradado. Si una pieza necesita un escalón que la escala
  no tiene, lo que falta es jerarquía, no volumen.
- **Radios por rol, no por tamaño.** Un botón de 44px y otro de 28px son los
  dos controles y comparten radio.
- **Un reinicio pesa cero.** Escríbelo con `:where()` en las dos mitades del
  selector; si le gana a un componente, deja de ser un reinicio.
- **No apuntes a un elemento genérico dentro de un contenedor con descendencia
  ajena.** La consola aloja el riel de herramientas completo: un `span` o un
  `svg` sin nombre alcanza también lo que no es suyo.

## La guarda

`src/design-system/designSystem.test.ts` comprueba estas invariantes en cada
`npm run check`. La guarda no desapareció al adoptar la arcilla: cambió de
polaridad. Lo que antes prohibía —que una sombra proyecte y realce a la vez—
ahora lo exige, y lo que sigue prohibido es lo que hacía ilegible al original:
que cada pieza finja su propia luz, que la profundidad tiña, que el volumen
crezca sin límite y que el dato se redondee. Las veinte pruebas verifican, entre
otras cosas, que ninguna capa contradiga la luz del sistema proyectando
abajo-izquierda o arriba-derecha, que ninguna capa de profundidad tenga hue, que
la escalera de elevación sea monótona y no se dispare, que cada escalón se
recalibre en Noche, que la desviación de
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
