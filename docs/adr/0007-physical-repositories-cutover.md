# ADR 0007 — Corte físico de la primera ola multirepo

- **Estado:** aceptado para el corte de 2026-09-04; productos aún experimentales.
- **Fecha:** 2026-09-04.
- **Contexto:** las fronteras de Foundation, FStructure 2D, Space3D y Web ya tenían contratos, allowlists, corpus y gates propios dentro del monolito.
- **Decisión:** extraer esos cuatro dominios desde `monolith-cutover-20260904` mediante `git filter-repo`, publicar cada resultado en un repositorio GitHub público independiente y conservar `FusionStructure` como repositorio de gobierno, compatibilidad y trazabilidad. No se usan submódulos.

## Resultados

| Dominio | Repositorio | Tag | Gate local |
| --- | --- | --- | --- |
| Contratos neutrales | [`fusionstructure-foundation`](https://github.com/klkmoraa/fusionstructure-foundation) | `v0.1.0` | 3 archivos / 37 tests |
| Solver 2D | [`fstructure`](https://github.com/klkmoraa/fstructure) | `v0.1.0` | 33 archivos / 171 tests |
| Solver 3D | [`fusionstructure-space3d`](https://github.com/klkmoraa/fusionstructure-space3d) | `v0.1.0` | 10 archivos / 82 tests |
| Portal | [`fusionstructure-web`](https://github.com/klkmoraa/fusionstructure-web) | `v0.1.0` | 1 archivo / 24 tests + brandbook/motion |

Cada gate ejecutó `npm.cmd run check`; los detalles y SHA exactos están en [`migration/physical-repositories-20260904.json`](../../migration/physical-repositories-20260904.json). Los corpus 2D y 3D, el digest EOL y el esquema Project Format permanecen en sus consumidores o Foundation.

## Protección y CI

`main` quedó protegido en los cuatro repositorios con revisión obligatoria, revisión obsoleta descartada, aprobación del último push, resolución de conversaciones, historial lineal y bloqueo de force-push/deletion. Como son repositorios de usuario, `enforceAdmins:false` es el bypass documentado del propietario.

El token OAuth disponible no tiene el scope `workflow`; GitHub rechazó la publicación de `.github/workflows/ci.yml`. Para no fingir una puerta inexistente, los workflows no forman parte del tip publicado y las protecciones nuevas no declaran status checks. La decisión pendiente es instalar CI con un token/App que sí tenga ese permiso y después hacer obligatoria la puerta por repositorio.

## Límites

La extracción conserva el historial filtrado y las pruebas, pero no convierte los motores experimentales en software certificado ni prueba equivalencia entre plataformas. La compatibilidad 2D/3D se mantiene como corpus y contrato; cualquier cambio de solver requiere repetir sus gates antes de publicar.
