import { useCallback, useEffect, useState } from 'react';
import type { Lang } from './catalog';

export type Theme = 'dia' | 'noche';

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Sin almacenamiento (modo privado): la preferencia dura la visita.
  }
};

const systemTheme = (): Theme => (
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'noche' : 'dia'
);

/** Día / Noche: sigue al sistema hasta que la persona elige. */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = read('fs-theme');
    return saved === 'dia' || saved === 'noche' ? saved : systemTheme();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'noche' ? 'dia' : 'noche';
      write('fs-theme', next);
      return next;
    });
  }, []);

  return { theme, toggle };
};

/** Español por defecto; inglés si el navegador lo pide o la persona lo elige. */
export const useLang = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = read('fs-lang');
    if (saved === 'es' || saved === 'en') return saved;
    return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => {
      const next = current === 'es' ? 'en' : 'es';
      write('fs-lang', next);
      return next;
    });
  }, []);

  return { lang, toggle };
};
