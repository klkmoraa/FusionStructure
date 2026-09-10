// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App';

afterEach(cleanup);

describe('landing pública', () => {
  it('presenta el sistema Clay del brandbook y conserva el recorrido conceptual', () => {
    render(<App />);

    const landing = screen.getByRole('main');
    expect(landing.getAttribute('data-brandbook')).toBe('clay-minimal');
    expect(screen.getByRole('heading', { level: 1, name: 'Un proyecto que conserva la estructura.' })).toBeTruthy();
    expect(screen.getByText('Make complexity legible.')).toBeTruthy();
    expect(screen.getByTestId('fusion-brandbook-stage').getAttribute('data-system')).toBe('clay-minimal');
    expect(screen.getByTestId('fusion-landing-mark').querySelector('svg')?.classList.contains('fs-mark')).toBe(true);

    const conceptSources = Array.from(screen.getByTestId('fusion-concept-atlas').querySelectorAll('img')).map((image) => image.getAttribute('src'));
    expect(conceptSources).toEqual(expect.arrayContaining([
      './assets/landing/fusion-clay-project.png',
      './assets/landing/fusion-clay-analysis.png',
      './assets/landing/fusion-clay-workspace.png',
      './assets/landing/fusion-clay-delivery.png',
    ]));
  });

  it('mantiene los estados de disponibilidad separados de las familias de color', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'Explorar herramientas' }).getAttribute('href')).toBe('#fusion-tools');
    expect(screen.getByRole('link', { name: 'Seguir la continuidad' }).getAttribute('href')).toBe('#fusion-continuity');
    expect(screen.getByRole('button', { name: 'Abrir Solver 2D' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abrir Solver 3D' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abrir Aula estructural' })).toBeTruthy();

    const planned = screen.getAllByRole('button', { name: /En preparación$/ });
    expect(planned).toHaveLength(4);
    planned.forEach((button) => expect((button as HTMLButtonElement).disabled).toBe(true));
  });

  it('expone el recorrido completo en la navegación y el flujo final', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'Herramientas' }).getAttribute('href')).toBe('#fusion-tools');
    expect(screen.getByRole('link', { name: 'Continuidad del proyecto' }).getAttribute('href')).toBe('#fusion-continuity');
    expect(screen.getByRole('link', { name: 'Proyecto común' }).getAttribute('href')).toBe('#fusion-flow');
    expect(screen.getByRole('heading', { level: 2, name: 'La continuidad es la herramienta principal.' })).toBeTruthy();
  });
});
