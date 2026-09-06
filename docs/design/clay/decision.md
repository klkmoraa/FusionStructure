# Arcilla mínima — revisión de interfaz

Fecha: 2026-09-05. Rama: `codex/clay-workspace`.

El usuario autorizó rediseñar inicio, workspace e identidad visual. El alcance es presentación y acceso a flujos existentes del solver 2D. La referencia visual está en `concept.png`; es un mockup, no una declaración de capacidades.

## Dirección

Papel `#f7f6f1`, superficies claras y tinta grafito. Arcilla en controles y paneles: luz superior izquierda, realce interior tenue y sombra exterior neutra. Radios de controles 12px, tarjetas y paneles 22px, diálogos 28px; datos 6px. Mantener señales de dominio, unidades y contraste de ambos temas.

El inicio debe permitir acceder al solver desde el primer viewport. El inicio 2D prioriza crear o continuar y ofrece plantilla, aula e importación. El workspace mantiene el lienzo como área principal y agrupa las acciones de proyecto, edición y análisis. Movimiento breve, cancelado cuando el usuario pide reducir animaciones.

## Límites y contratos

- Entidad: presentación del proyecto existente; no cambia el modelo físico ni analítico.
- Validaciones: conservar validadores actuales de entradas y ejecución del solver.
- Deshacer: los comandos de modelado mantienen su historial; un cambio de presentación no agrega operaciones al modelo.
- Guardado y exportación: conservar formatos, versiones y rutas existentes. Sin migración de datos.
- Estado: el producto continúa siendo experimental. No se añaden formatos ni resultados a partir de texto inventado por el mockup.
- Compatibilidad visual: mantener contenido e interacciones reales aunque la referencia omita controles. El portal existente sustituye la ilustración conceptual; proyectos recientes sólo se muestran desde datos locales.

## Verificación prevista

Pruebas focalizadas de identidad y superficies, topbar e inicio si se modifican comportamientos; TypeScript; recorrido visual de escritorio y móvil para abrir solver, entrar al workspace y ejecutar el flujo de análisis existente. No es cierre de release ni sincronización, por lo que no corresponde ejecutar el gate completo.
