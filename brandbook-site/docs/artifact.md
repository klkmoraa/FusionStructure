# FusionStructure — arquitectura del sistema visual

## Propósito

Definir un sistema visual propio para FusionStructure que convierta modelos, resultados y decisiones estructurales en una experiencia clara, conectada y trazable. La frase rectora es **Make complexity legible.**

## Estado y alcance

- Estado: Propuesto / listo para validación de producto.
- Propietario: FusionStructure.
- Alcance: identidad, color semántico, superficies, tipografía, botones, iconos, diagramas, movimiento, modo día/noche, copy y comportamiento responsive.
- No certifica cálculos ni sustituye la validación de ingeniería.

## Principios

1. La geometría comunica estructura; el color comunica significado.
2. La jerarquía se expresa con posición, borde y sombra dura antes que con decoración.
3. El modo noche conserva geometría y semántica; cambia papel, tinta y profundidad.
4. El movimiento explica causa y efecto en 180–520 ms y respeta movimiento reducido.
5. Cada vista debe seguir siendo legible a 390 px, sin solapamientos ni desplazamiento horizontal.

## Señales

Los valores de abajo se dibujaron sobre carbón. Sobre papel se quedan por debajo
del mínimo gráfico de 3:1, así que en la aplicación viven como la TINTA de Noche
y el trazo compartido baja un escalón. La implementación verificable está en
`src/design-system/tokens.css` y en `docs/sistema-visual.md`.

- Axial: azul claro `#63C5FF` (trazo `#2795e0`).
- Acción aplicada: coral `#FF6F66` (trazo `#f0564c`) — cargas y momentos aplicados.
- Cortante: verde `#55C990` (trazo `#1ba268`) — cortante y reacciones.
- Atención/error recuperable: amarillo `#F3C553` (tinta `#8a6208` sobre papel).
- Deformada: morado `#9B87FF` (trazo `#8a73f5`).
- Momento flector: rosa `#EF7AB9` (trazo `#de5ca4`).

## Superficies

- Día: papel `#F6F5F0`, panel `#FFFEFA`, elevado `#ECEFE8`, borde `#A7B1A9`, sombra `#D6DCD5`.
- Noche: papel `#171A1C`, panel `#252A2E`, elevado `#30363B`, borde `#6A746E`, sombra `#080A0B`.
- Las sombras desplazadas conservan su geometría y añaden entre 1.5 y 3 px de blur.

## Componentes

- Marca madre: cuatro piezas estructurales abiertas alrededor de un núcleo común.
- Familia de herramientas: marco compartido, glifo funcional y color de colección; el color nunca identifica por sí solo.
- Plano: nombre propio del solver 2D. Marco de familia en coral de acción y un glifo que dice lo que hace —una barra recta y su deformada—. `Solver 2D` es su rol; `Plano` es cómo se llama.
- Botones: primario, secundario, quiet, destructivo, icon-only, cargando y deshabilitado.
- Iconos: trazo simple, 20 px, esquinas redondeadas, sin relleno decorativo.
- Diagramas: axial, momento, cortante, deformada y fluencia con el mismo marco gráfico.
- Estados: correcto, revisión e información; nunca depender sólo del color.

## Validación

- Lint y build sin errores.
- Cero overflow horizontal en escritorio y móvil.
- Hero sin texto oculto ni intersección con el canvas.
- Contraste y sombra perceptibles en la tarjeta nocturna.
- Copy específico, breve, honesto y sin promesas de certificación.
