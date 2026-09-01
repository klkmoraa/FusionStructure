# FusionStructure — arquitectura del sistema visual y verbal

## Propósito

Definir un sistema propio que convierta modelos, resultados y decisiones estructurales en una experiencia clara, conectada y trazable. La frase rectora es **Make complexity legible.**

## Estado y alcance

- Estado: propuesto y publicado como brandbook; listo para validación de producto.
- Propietario: FusionStructure.
- Alcance: identidad, tres escalas de color, tipografía, movimiento, materia, iconografía, patrones, voz, catálogo de superficies y entrega de tokens.
- No certifica cálculos, no promete cumplimiento normativo y no sustituye la validación de ingeniería.

## Principios

1. La geometría comunica estructura; el color comunica significado.
2. La jerarquía se expresa con posición, espacio y filete antes que con decoración.
3. El modo noche conserva geometría y semántica; cambia papel, tinta y profundidad.
4. El movimiento explica causa y efecto entre 90 y 520 ms, y se puede apagar sin perder información.
5. Cada vista sigue siendo legible a 390 px, sin solapamientos ni desplazamiento horizontal.
6. El estado de una superficie (`Disponible`, `Experimental`, `Planeado`, `No comprometido`) se declara antes que su promesa.

## Identidad

La marca madre es una **ménsula**: un miembro vertical de 9u y dos voladizos cuyo peralte decrece de 9u a 5u hacia la punta, la forma que toma una sección dimensionada por el momento que recibe. Sobre una retícula de 48u.

- Variantes: señal, mono, inversa e icono de aplicación.
- Sólo el brazo inferior puede tomar el color de señal.
- Espacio libre: el ancho de la propia columna, 9u.
- Tamaño mínimo de la marca suelta: 16 px; por debajo se usa el icono.
- Usos prohibidos: girar, deformar, teñir con color de herramienta, contornear, dar volumen y colocar sobre imagen sin contraste.

## Tres escalas de color

**Señales de resultado** (pertenecen al dato). Día / Noche:

| Señal         | Día       | Noche     |
| ------------- | --------- | --------- |
| Axial `N`     | `#1B75B0` | `#63C5FF` |
| Momento `M`   | `#B8412F` | `#FF8E80` |
| Cortante `V`  | `#277654` | `#55C990` |
| Deformada `Δ` | `#6A57C8` | `#9B87FF` |
| Fluencia `Fy` | `#B44A7E` | `#EF7AB9` |
| Atención `!`  | `#8A6110` | `#F3C553` |

**Familias** (pertenecen a la herramienta): Núcleo, Análisis, Modelo, Civil, Proyecto, Interoperabilidad y Aprendizaje. Emparentadas con las señales pero más profundas; nunca se usan como resultado.

**Estados** (pertenecen a la verdad del producto): Disponible, Experimental, Planeado y No comprometido.

Todos los valores de día sostienen al menos 4.5:1 sobre el papel `#F7F6F1`; los de noche, sobre el carbón `#14171A`.

## Superficies

- Rampa neutra única de diez pasos, con un papel por rol: fondo, superficie, hundida, filete suave, filete visible, texto de apoyo, texto secundario, texto fuerte y tinta.
- Seis niveles de materia: plano, interior, elevado, flotante, hoja y modal.
- La sombra sólo aparece donde una pieza puede tapar contenido.

## Tipografía

- Display: Space Grotesk.
- Interfaz: Inter.
- Dato: IBM Plex Mono con cifras tabulares.
- Todo número lleva unidad, signo y precisión declarada; la escala y la versión acompañan al resultado.

## Movimiento

Seis duraciones (`90 / 140 / 200 / 280 / 520 / 1400 ms`) y tres curvas. Seis mensajes: llegar, conectar, confirmar, comparar, deshacer y esperar. Con `prefers-reduced-motion` o en modo calma toda transición cae a cero y el contenido queda en su estado final.

## Iconografía

Veinticinco glifos en retícula de 48u, trazo 2.6, extremos redondos, dos tintas y un punto por nudo. Cada glifo dibuja el objeto real de su dominio y debe distinguirse en tinta, a 20 px y sin etiqueta. Se generan desde `scripts/glyph-library.mjs` con `npm run brand:assets`.

## Módulos con nombre propio

El solver 2D se llama **FStructure**; `Solver 2D` es su rol dentro del catálogo
(`FS-A01`). Un módulo con nombre propio no repite la ménsula dentro de su
glifo: usa el contenedor de familia con su color y su figura funcional, y la
marca madre lo acompaña en la firma. FStructure nunca aparece solo cuando el
contexto es la plataforma completa.

## Voz

Cuatro principios: primero el estado, el límite es parte del dato, una frase una acción, y la persona decide. El brandbook incluye ocho reescrituras que muestran qué queda de una frase cuando se le quita la promesa, además de microcopy de botones, estados vacíos y avisos, y un glosario de seis términos.

## Validación

- `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.
- Cero desplazamiento horizontal a 420 px, 940 px y 1440 px.
- Contraste comprobado en la propia página: cada color de familia muestra su relación y su nivel WCAG.
- Día y noche revisados sobre las mismas superficies.
- Copy específico, breve, honesto y sin promesas de certificación.
