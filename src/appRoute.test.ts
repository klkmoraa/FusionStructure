import { describe, expect, it } from 'vitest';
import { readAppRoute } from './appRoute';

describe('appRoute', () => {
  it('restaura cada superficie desde la URL', () => {
    expect(readAppRoute('')).toMatchObject({ screen: 'welcome', welcomeView: 'home' });
    expect(readAppRoute('?surface=solver2d')).toMatchObject({ screen: 'welcome', welcomeView: 'solver2d' });
    expect(readAppRoute('?surface=solver3d')).toMatchObject({ screen: 'welcome', welcomeView: 'space3d' });
    expect(readAppRoute('?surface=workspace2d')).toMatchObject({ screen: 'workspace' });
    expect(readAppRoute('?surface=workspace3d&origin=workspace')).toMatchObject({ screen: 'space3d', space3dOrigin: 'workspace' });
  });
});
