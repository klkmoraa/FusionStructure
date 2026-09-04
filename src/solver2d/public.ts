/**
 * Entrada pública mínima del dominio planar 2D para adaptadores externos.
 *
 * No es un atajo a los stores ni al solver: el adaptador recibe una captura del
 * proyecto y nunca puede modificar el estado 2D que la produjo.
 */
export type {
  MemberModel,
  NodeModel,
  ProjectModel,
} from '../types';
