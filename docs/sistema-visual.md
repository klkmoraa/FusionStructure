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

Donde el brandbook publica un valor que no aguanta la prueba de contraste sobre
las cuatro superficies del producto, aquí vive el escalón que sí la aguanta y el
valor publicado queda como la tinta del tema que lo necesita. El brandbook es un
borrador; esta implementación es la que se puede comprobar.

La landing aplica esta fundación en una escala editorial: titulares grandes, superficies abiertas, una sola acción primaria y color restringido a las trazas de dominio presentes en las imágenes y los iconos de familia. Las seis familias (`Análisis`, `Modelo`, `Civil`, `Proyecto`, `Conexiones` y `Aprendizaje`) usan los glifos funcionales de la identidad de producto, con etiquetas breves y una imagen seleccionable; no se convierten en un catálogo de tarjetas ni en una promesa de implementación.

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
de portada del solver 2D, que revela geometría, apoyos, carga, momento y deformada en
el orden en que ocurre el trabajo, y la entrada del diagrama en el lienzo, que
se dibuja cuando llega una corrida nueva. La segunda está encadenada a la
identidad de la corrida y no al render: un paneo o un zoom no la repiten.

El brandbook publica además una pareja Día/Noche para cada señal: en Noche se usan los valores luminosos de la tabla y en Día versiones más profundas (`#1B75B0`, `#B8412F`, `#277654`, `#6A57C8`, `#B44A7E`, `#8A6110`) que sostienen 4.5:1 sobre papel. La aplicación conserva por ahora los valores declarados en `src/design-system/tokens.css`; alinear ambos es una migración pendiente que requiere capturas comparables, revisión de accesibilidad y comprobación en los dos temas.

A esa escala de dominio el brandbook suma dos escalas más, que no son de resultado: siete colores de familia para agrupar herramientas (`Núcleo`, `Análisis`, `Modelo`, `Civil`, `Proyecto`, `Interoperabilidad`, `Aprendizaje`) y cuatro colores de estado para `Disponible`, `Experimental`, `Planeado` y `No comprometido`.

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

**4 · Menos superficie, menos texto.** Radios por rol (0 / 10 / 14 / 18 / 22px),
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
