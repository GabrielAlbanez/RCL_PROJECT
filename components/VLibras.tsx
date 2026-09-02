'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
  }
}

// VLibras plugin uses custom HTML attributes that aren't in standard React types
declare module 'react' {
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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const src = 'https://vlibras.gov.br/app/vlibras-plugin.js';

    // Evita duplicar o script em navegações client-side.
    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      if (window.VLibras?.Widget) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);
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