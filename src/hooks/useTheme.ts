/**
 * ======================================================================
 * HOOK PERSONALIZADO: GESTÃO DE TEMA (SISTEMA, CLARO E ESCURO)
 * Localização: src/hooks/useTheme.ts
 * ======================================================================
 */

import { useState, useEffect } from 'react';
import { ModoTema } from '../types';

export function useTheme() {
  const [tema, setTema] = useState<ModoTema>(() => {
    const salvo = localStorage.getItem('bikehub_tema') as ModoTema | null;
    if (salvo === 'sistema' || salvo === 'claro' || salvo === 'escuro') {
      return salvo;
    }
    return 'sistema';
  });

  const [escuroEfetivo, setEscuroEfetivo] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const salvo = localStorage.getItem('bikehub_tema') as ModoTema | null;
    if (salvo === 'escuro') return true;
    if (salvo === 'claro') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('bikehub_tema', tema);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const atualizarEfetivo = () => {
      const isDark = tema === 'escuro' || (tema === 'sistema' && mediaQuery.matches);
      setEscuroEfetivo(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    atualizarEfetivo();

    const handler = () => {
      if (tema === 'sistema') {
        atualizarEfetivo();
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [tema]);

  return {
    tema,
    setTema,
    escuroEfetivo,
  };
}
