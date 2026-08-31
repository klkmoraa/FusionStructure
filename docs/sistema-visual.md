# Sistema visual

Este documento registra el sistema visual que ya existe en la aplicación. La visión todo-en-uno no autoriza por sí sola un rediseño: la interfaz actual queda fuera del alcance de esta actualización.

## Dirección actual

FusionStructure usa un minimalismo técnico acromático:

- fondos, superficies, texto y controles trabajan con valores neutros;
- el contraste y el espacio comunican jerarquía;
- el color se reserva para significados del dominio;
- la profundidad se expresa con filetes y niveles, no con volumen decorativo;
- la densidad debe favorecer lectura, edición y revisión técnica.

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

No se cambió el diseño de la aplicación. Se corrigió la documentación para que describa el sistema vigente y para que futuras decisiones de producto no mezclen la visión funcional con una redirección visual accidental.
