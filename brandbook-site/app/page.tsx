'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { ChevronRight, Gauge, Menu, Moon, Sun, X } from 'lucide-react';
import { BrandMark } from './brand/marks';
import { SECTIONS, type SectionId, type SignalId } from './brand/system';
import { BrandbookContext, type MotionMode, type Theme } from './brand/ui';
import { Hero } from './sections/Hero';
import { Identity } from './sections/Identity';
import { Tools } from './sections/Tools';
import { Color } from './sections/Color';
import { Typography } from './sections/Typography';
import { Motion } from './sections/Motion';
import { Material } from './sections/Material';
import { Iconography } from './sections/Iconography';
import { Patterns } from './sections/Patterns';
import { References } from './sections/References';
import { Voice } from './sections/Voice';
import { Handoff } from './sections/Handoff';

/** Consulta una media query sin sincronizar estado dentro de un efecto. */
const subscribeToQuery = (query: string) => (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    subscribeToQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  );

export default function Brandbook() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersCalm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [themeChoice, setThemeChoice] = useState<Theme | null>(null);
  const [motionChoice, setMotionChoice] = useState<MotionMode | null>(null);
  const theme: Theme = themeChoice ?? (prefersDark ? 'noche' : 'dia');
  const motionMode: MotionMode =
    motionChoice ?? (prefersCalm ? 'calma' : 'activo');
  const [activeSection, setActiveSection] = useState<SectionId>('norte');
  const [activeSignal, setActiveSignal] = useState<SignalId>('moment');
  const [copiedValue, setCopiedValue] = useState('');
  const [copiedLabel, setCopiedLabel] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id)
          setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.02, 0.15, 0.4] },
    );
    for (const { id } of SECTIONS) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            reveal.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    );
    // Solo se oculta lo que está debajo del pliegue: si alguien llega con un
    // enlace directo, el contenido anterior ya está visible.
    for (const node of document.querySelectorAll('.section > *')) {
      if (node.getBoundingClientRect().top <= window.innerHeight) continue;
      node.classList.add('reveal');
      reveal.observe(node);
    }
    return () => reveal.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const goTo = useCallback(
    (id: SectionId) => {
      setMenuOpen(false);
      document.getElementById(id)?.scrollIntoView({
        behavior: motionMode === 'calma' ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [motionMode],
  );

  // El aviso muestra una etiqueta corta; el portapapeles se queda con el
  // contenido completo, que puede ser una hoja de tokens entera.
  const copyValue = useCallback((value: string, label?: string) => {
    void navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopiedValue(value);
    setCopiedLabel(label ?? value);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => {
      setCopiedValue('');
      setCopiedLabel('');
    }, 1900);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      motionMode,
      activeSignal,
      copiedValue,
      copiedLabel,
      setActiveSignal,
      copyValue,
    }),
    [theme, motionMode, activeSignal, copiedValue, copiedLabel, copyValue],
  );

  return (
    <BrandbookContext.Provider value={contextValue}>
      <div
        className={`brandbook brandbook--${theme} ${motionMode === 'calma' ? 'brandbook--calma' : ''}`}
      >
        <a className="skip-link" href="#norte">
          Ir al contenido
        </a>

        <header className="topbar">
          <button
            type="button"
            className="topbar__brand"
            onClick={() => goTo('norte')}
          >
            <BrandMark size={26} />
            <span className="topbar__name">FusionStructure</span>
            <span className="topbar__slash">/</span>
            <span className="topbar__sub">Brandbook</span>
          </button>

          <p className="topbar__center">
            <span className="live-dot" aria-hidden="true" />
            edición 2026 · <code>01—12</code>
          </p>

          <div className="topbar__actions">
            <button
              type="button"
              className="top-control"
              aria-pressed={motionMode === 'calma'}
              aria-label={
                motionMode === 'calma'
                  ? 'Activar el movimiento'
                  : 'Reducir el movimiento'
              }
              onClick={() =>
                setMotionChoice(motionMode === 'activo' ? 'calma' : 'activo')
              }
            >
              <Gauge size={14} />
              <span>{motionMode === 'calma' ? 'Calma' : 'Activo'}</span>
            </button>
            <button
              type="button"
              className="top-control"
              onClick={() => setThemeChoice(theme === 'dia' ? 'noche' : 'dia')}
              aria-label={`Cambiar a tema ${theme === 'dia' ? 'noche' : 'día'}`}
            >
              {theme === 'dia' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'dia' ? 'Día' : 'Noche'}</span>
            </button>
            <button
              type="button"
              className="top-control top-control--menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar índice' : 'Abrir índice'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          <span
            className="topbar__progress"
            style={{ transform: `scaleX(${progress})` }}
          />
        </header>

        <div className="frame">
          <aside className={`index-rail ${menuOpen ? 'is-open' : ''}`}>
            <div className="index-rail__head">
              <span>Índice</span>
              <code>{SECTIONS.length}</code>
            </div>
            <nav aria-label="Secciones del brandbook">
              {SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`index-link ${activeSection === item.id ? 'is-active' : ''}`}
                  aria-current={
                    activeSection === item.id ? 'location' : undefined
                  }
                  onClick={() => goTo(item.id)}
                >
                  <span className="index-link__number">{item.index}</span>
                  <span className="index-link__copy">
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <ChevronRight size={13} aria-hidden="true" />
                </button>
              ))}
            </nav>
            <div className="index-rail__foot">
              <p>
                Un sistema propio para hacer legible la complejidad del trabajo
                construido.
              </p>
              <span>FS · dirección 04 · experimental</span>
            </div>
          </aside>

          <main className="content">
            <Hero onGoTo={goTo} />
            <Identity />
            <Tools />
            <Color />
            <Typography />
            <Motion />
            <Material />
            <Iconography />
            <Patterns />
            <References />
            <Voice />
            <Handoff />

            <footer className="footer">
              <div className="footer__brand">
                <BrandMark size={30} />
                <strong>FusionStructure</strong>
              </div>
              <p>Make complexity legible.</p>
              <span>
                Brandbook 2026 · sistema propio · el estado de cada superficie
                lo define el código
              </span>
            </footer>
          </main>
        </div>

        <output
          className={`toast ${copiedValue ? 'is-visible' : ''}`}
          aria-live="polite"
        >
          Copiado <code>{copiedLabel}</code>
        </output>
      </div>
    </BrandbookContext.Provider>
  );
}
