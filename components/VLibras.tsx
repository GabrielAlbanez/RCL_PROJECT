'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
  }
}

// VLibras plugin uses custom HTML attributes that aren't in standard React types
declare module 'react' {
  // The generic name must match React's declaration for module augmentation.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    vw?: string;
    'access-button'?: string;
    'access-content'?: string;
    'access-window'?: string;
    'access-button-access'?: string;
    'access-ruby'?: string;
  }
}

/**
 * VLibras — widget oficial do governo brasileiro que traduz o conteúdo da
 * página para Língua Brasileira de Sinais (Libras). Carrega o script da CDN
 * do vlibras.gov.br e inicializa o avatar após o mount.
 *
 * O widget renderiza um botão flutuante no canto inferior direito; o usuário
 * clica para abrir o avatar, que sinaliza o texto do elemento sob o cursor.
 */
export default function VLibras() {
  useEffect(() => {
    const src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    const mobileQuery = window.matchMedia('(max-width: 700px)');
    let positionTimers: number[] = [];

    const positionAccessButton = () => {
      const wrapper = document.querySelector<HTMLElement>('#vlibras-access-wrapper');
      const access = wrapper?.shadowRoot?.querySelector<HTMLElement>('#vlibras-access');
      if (!access) return;

      if (mobileQuery.matches) {
        access.style.top = 'auto';
        access.style.right = '12px';
        access.style.bottom = 'max(16px, env(safe-area-inset-bottom))';
      } else {
        access.style.removeProperty('top');
        access.style.removeProperty('right');
        access.style.removeProperty('bottom');
      }
    };

    const schedulePositioning = () => {
      positionTimers.forEach(window.clearTimeout);
      positionTimers = [0, 250, 1000].map((delay) => window.setTimeout(positionAccessButton, delay));
    };

    const initialize = () => {
      if (window.VLibras?.Widget && !document.querySelector('#vlibras-access-wrapper')) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
      schedulePositioning();
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }

    if (window.VLibras?.Widget) initialize();
    else script.addEventListener('load', initialize, { once: true });

    window.addEventListener('resize', positionAccessButton, { passive: true });
    return () => {
      script.removeEventListener('load', initialize);
      window.removeEventListener('resize', positionAccessButton);
      positionTimers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div vw="true" className="enabled">
      <div access-button="true" />
      <div access-content="true">
        <div access-window="true" />
        <div access-button-access="true" />
        <div access-ruby="true" />
      </div>
    </div>
  );
}
