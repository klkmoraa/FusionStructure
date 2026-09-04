# ADR 0002: Excepción de gobernanza para propietario único

- Estado: Aceptada
- Fecha: 2026-09-03
- Ámbito: preflight de migración multi-repositorio

## Contexto

`main` tiene protección de rama activa, pero GitHub informa `enforceAdmins:false`. En consecuencia, el propietario administrador conserva una capacidad de bypass. No es correcto describir esa protección como no eludible ni permitir que un JSON estático convierta esa capacidad en autorización de separación.

La configuración actual exige una aprobación, revisión de CODEOWNERS, aprobación posterior al último push y resolución de conversaciones. En un repositorio con un único propietario, activar `enforceAdmins:true` aplicaría esas exigencias también a la única persona que puede administrar el repositorio; sin otro revisor elegible, una migración o una reparación urgente quedaría bloqueada. Añadir una segunda identidad sólo para eludir esa restricción no es una revisión independiente real.

Existe un artefacto de revisión independiente en `https://github.com/klkmoraa/FusionStructure/pull/15#pullrequestreview-5106815679`. Es trazabilidad de revisión, no se presenta como una aprobación sustitutiva de la protección de rama.

## Decisión

Se conserva `enforceAdmins:false` únicamente como excepción explícita para el workstream de gobernanza de migración multi-repositorio. La decisión del propietario queda registrada en `migration/github-governance-current.json` y esta ADR; el registro dice expresamente que la excepción es eludible.

Los controles compensatorios obligatorios son:

1. Política operativa de cero pushes directos rutinarios a `main`: los cambios ordinarios se presentan mediante Pull Request. La capacidad administrativa de bypass sigue existiendo y no se oculta.
2. Protección remota de Pull Request: una aprobación, revisiones de CODEOWNERS, invalidación de revisiones obsoletas, aprobación tras el último push y conversaciones resueltas.
3. CI actual: el contexto estricto `Puerta de calidad` debe estar ligado a la app de GitHub Actions `15368`, y el gate debe observar un último run exitoso de `CI` para un push a `main`.
4. Artefacto de revisión independiente: el gate consulta y expone el review registrado; si no puede verificarlo, falla.
5. Decisión de bypass registrada: el gate expone el enlace a esta ADR, `enforceAdmins:false`, `ownerBypassRetained:true` y `enforcementNonBypassable:false`.
6. Evidencia fresca: `npm run migration:verify-governance` usa solamente lecturas `GET` vía `gh api`, no acepta otro repositorio o rama por parámetros y falla cerrado si `gh`, autenticación o cualquiera de las respuestas no está disponible. Sólo su salida efímera puede marcar el preflight de separación como permitido; `migration/github-governance-current.json` conserva `repositorySplit.allowed:false`.

La excepción no autoriza crear repositorios ni hacer pushes. Es una condición de gobernanza que se debe ejecutar inmediatamente antes de cualquier operación de separación autorizada por el usuario.

## Consecuencias

El tradeoff es explícito: se preserva la operabilidad de un repositorio de una sola persona, pero la protección no equivale a una garantía no eludible. Un push directo del propietario seguiría siendo técnicamente posible y violaría la política de este workstream; debe registrarse y no puede presentarse como evidencia independiente.

Para retirar la excepción se necesita al menos un mantenedor independiente elegible, evidencia de revisiones reales y entonces se podrá activar `enforceAdmins:true` sin bloquear el flujo. Hasta ese momento, cualquier ausencia de evidencia viva detiene el preflight de migración.
