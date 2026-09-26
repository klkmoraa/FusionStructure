// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { PRODUCT_LINKS } from '../foundation/productLinks';
import { FAMILIES, TOOLS, countByStatus } from './catalog';

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window.navigator, 'language', { value: 'es-MX', configurable: true });
});
afterEach(cleanup);

describe('landing', () => {
  it('abre con la promesa y los dos productos que existen hoy', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Calcula, dibuja y lee el resultado.' })).toBeTruthy();
    expect(screen.getByText('Make complexity legible.')).toBeTruthy();
    for (const [name, href] of [['FStructure', PRODUCT_LINKS.fstructure], ['FModel', PRODUCT_LINKS.fmodel]]) {
      const links = screen.getAllByRole('link', { name: `Abrir ${name}` });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => expect(link.getAttribute('href')).toBe(href));
    }
  });

  it('pone el estado antes que la promesa: 25 herramientas, cada una con su estado', () => {
    render(<App />);
    expect(TOOLS).toHaveLength(25);
    expect(countByStatus()).toEqual({ available: 9, experimental: 4, planned: 12 });
    const families = screen.getByRole('heading', { level: 2, name: 'Siete familias, un proyecto' }).closest('section')!;
    expect(within(families).getAllByRole('article')).toHaveLength(FAMILIES.length);
    expect(within(families).getAllByRole('listitem')).toHaveLength(TOOLS.length);
  });

  it('abre cada herramienta en su app y no promete las planeadas', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Abrir FStructure 2D' }).getAttribute('href')).toBe(PRODUCT_LINKS.fstructure);
    expect(screen.getByRole('link', { name: 'Abrir FModel · CAD 2D' }).getAttribute('href')).toBe(PRODUCT_LINKS.fmodel);
    expect(screen.getByRole('link', { name: 'Abrir Diseño' }).getAttribute('href')).toBe(PRODUCT_LINKS.fstructure);
    expect(screen.getAllByText('En preparación')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: 'Abrir Modelo BIM' })).toBeNull();
  });

  it('es para usar las herramientas: no enlaza a brandbooks', () => {
    render(<App />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href') ?? '');
    expect(hrefs.some((href) => /brandbook|FusionStructureBrand/i.test(href))).toBe(false);
  });

  it('cambia a Noche y a inglés, y lo recuerda', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar a Noche' }));
    expect(document.documentElement.dataset.theme).toBe('noche');
    expect(window.localStorage.getItem('fs-theme')).toBe('noche');

    fireEvent.click(screen.getByRole('button', { name: 'View in English' }));
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('heading', { level: 1, name: 'Calculate, draw and read the result.' })).toBeTruthy();
    expect(window.localStorage.getItem('fs-lang')).toBe('en');
  });
});
