# Documentación de FusionStructure

Esta documentación describe una aplicación experimental que está construyéndose hacia una plataforma integral para arquitectura, ingeniería y construcción. La documentación no convierte una idea en una capacidad implementada: el código y las puertas ejecutables siguen siendo la autoridad.

## Orden de lectura

1. [Visión de producto](vision-producto.md)
2. [Alcance funcional](alcance-funcional.md)
3. [Estado del producto](estado-del-producto.md)
4. [Hoja de ruta](roadmap.md)
5. [Investigación del ecosistema](investigacion-ecosistema.md)
6. [Catálogo de herramientas](catalogo-herramientas.md)
7. [Referentes y repositorios](referentes-open-source.md)
8. [Ruta académica](ruta-academica.md)
9. [Arquitectura de conectores](arquitectura-conectores.md)
10. [Sistema visual](sistema-visual.md)
11. [Solver 3D · superficie de trabajo](solver3d-workspace.md)
12. [ADR 0003 · Foundation de unidades](adr/0003-foundation-units-boundary.md)
13. [ADR 0004 · Foundation de álgebra lineal](adr/0004-foundation-linear-algebra-boundary.md)
14. [ADR 0005 · Puerta de dependencias](adr/0005-dependency-boundaries-gate.md)
15. [ADR 0006 · Handoff externo 2D → Space 3D](adr/0006-external-planar-space3d-handoff.md)
16. [ADR 0007 · Corte físico de la primera ola multirepo](adr/0007-physical-repositories-cutover.md)
17. [Evidencia del corte físico](../migration/physical-repositories-20260904.json)

## Documentos canónicos

| Documento | Propósito |
|---|---|
| [Visión de producto](vision-producto.md) | Define el problema, la promesa, los usuarios, los principios y el modelo mental de la plataforma. |
| [Alcance funcional](alcance-funcional.md) | Separa capacidades disponibles, experimentales, proyectadas y no comprometidas. |
| [Estado del producto](estado-del-producto.md) | Registra la fotografía del repositorio, sus riesgos y la siguiente prioridad técnica. |
| [Hoja de ruta](roadmap.md) | Ordena el crecimiento por dependencias y criterios de salida, no por marketing ni fechas arbitrarias. |
| [Investigación del ecosistema](investigacion-ecosistema.md) | Resume patrones observados en herramientas AEC y estándares abiertos que deben influir en la arquitectura. |
| [Catálogo de herramientas](catalogo-herramientas.md) | Asigna códigos, estado, alcance, referentes, familia técnica y puertas de verificación a cada superficie. |
| [Referentes, repositorios y fronteras](referentes-open-source.md) | Clasifica motores, aplicaciones, licencias y decisiones de integración, conector, oráculo o referencia. |
| [Ruta académica](ruta-academica.md) | Vincula las materias identificadas con módulos, herramientas, ejercicios y evidencia reproducible. |
| [Arquitectura de conectores](arquitectura-conectores.md) | Define cómo conectar Revit, AutoCAD, openBIM y futuras aplicaciones sin perder unidades, diferencias ni reversión. |
| [Sistema visual](sistema-visual.md) | Documenta el sistema visual actual. No se rediseña la interfaz como parte de esta actualización. |
| [Solver 3D · superficie de trabajo](solver3d-workspace.md) | Registra estados, contratos de datos y límites del rediseño del workspace espacial. |
| [ADR 0003 · Foundation de unidades](adr/0003-foundation-units-boundary.md) | Fija la frontera neutral de IDs, factores, conversión, persistencia y rollback de unidades. |
| [ADR 0004 · Foundation de álgebra lineal](adr/0004-foundation-linear-algebra-boundary.md) | Fija la frontera neutral de matrices, factorización, tolerancias, errores numéricos y compatibilidad. |
| [ADR 0006 · Handoff externo 2D → Space 3D](adr/0006-external-planar-space3d-handoff.md) | Fija la propuesta versionada, reporte de pérdidas, rollback y fachadas públicas de la integración entre productos. |
| [ADR 0005 · Puerta de dependencias](adr/0005-dependency-boundaries-gate.md) | Declara y ejecuta los límites 2D/3D cubiertos durante la migración y el comportamiento fail-closed del parser AST. |
| [ADR 0007 · Corte físico multirepo](adr/0007-physical-repositories-cutover.md) | Registra los repositorios públicos, tags, gates, protección y límites del corte 2026-09-04. |
| [Evidencia del corte físico](../migration/physical-repositories-20260904.json) | SHA remotos, corpus preservados, resultados de validación y deuda de CI por permiso OAuth. |
| [Reglas persistentes](../AGENTS.md) | Define la autoridad, la calidad mínima, la ausencia de áreas protegidas y las reglas de cierre. |

## Estado de una afirmación

- **Disponible:** existe en el código actual y tiene una ruta de uso identificable.
- **Experimental:** existe una implementación, pero el dominio, la cobertura o la validación no son suficientes para tratarla como estable.
- **Planeado:** forma parte de la dirección aprobada, pero todavía no debe venderse como función.
- **No comprometido:** una idea útil que requiere investigación o decisión antes de entrar a la hoja de ruta.

Las imágenes de concepto en [assets/](assets/) y los mockups en [public/assets/tool-mockups/](../public/assets/tool-mockups/) son material de dirección, no capturas ni evidencia de implementación.
