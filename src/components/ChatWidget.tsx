'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// URL principal del script de n8n
const N8N_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

export default function ChatWidget() {
  // 1. Cargar el CSS personalizado de forma manual (ya que next/link no maneja la inyección diferida tan bien como script)
  // 2. Inyectar el código de inicialización del chat.
  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof document === 'undefined') return;

    // Inyectar solo el CSS personalizado (el CSS principal lo cargará el script)
    if (!document.getElementById('n8n-chat-custom')) {
      const customStyle = document.createElement('link');
      customStyle.id = 'n8n-chat-custom';
      customStyle.rel = 'stylesheet';
      customStyle.href = '/n8n-chat-whatsapp.css';
      document.head.appendChild(customStyle);
    }

    // NOTA: El script de inicialización del chat se mueve a next/script.
    // Solo necesitamos que se ejecute una vez que la biblioteca n8n esté cargada.

    // Cleanup del CSS personalizado al desmontar
    return () => {
      const c = document.getElementById('n8n-chat-custom');
      if (c && c.parentNode) c.parentNode.removeChild(c);
    };
  }, []);

  // La clave está en usar next/script para la inyección del JS de n8n
  return (
    <>
      <Script
        src={N8N_SCRIPT_URL}
        strategy="lazyOnload" // Carga el script después de que la página termina de cargar
        // Esto le dice a Next.js que el script ya carga su propio CSS, aunque es menos crítico.
      />

      {/* Script para inicializar el chat una vez que la biblioteca esté disponible */}
      <Script
        id="n8n-chat-initializer"
        strategy="lazyOnload" // Mismo punto de carga
        dangerouslySetInnerHTML={{
          __html: `
            // Espera a que la función createChat esté disponible en el entorno global (Window)
            if (typeof window.createChat === 'function') {
                window.createChat({
                    webhookUrl: 'https://nochonelpepe2.app.n8n.cloud/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat',
                    webhookConfig: { method: 'POST' },
                    theme: 'whatsapp',
                    title: 'ChatBot Fincas',
                    subtitle: '¿En qué puedo ayudarte?',
                    defaultOpen: false,
                });
            } else {
                console.error("n8n chat library not found.");
            }
          `,
        }}
      />

      {/* El componente no renderiza nada en el DOM */}
      {null}
    </>
  );
}
