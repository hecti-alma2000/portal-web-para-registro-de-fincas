'use client';

import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    // Evitar doble inserción
    if (typeof document === 'undefined') return;

    if (document.getElementById('n8n-chat-style')) return;

    // Cargar el CSS del chat
    const link = document.createElement('link');
    link.id = 'n8n-chat-style';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    document.head.appendChild(link);

    // Inyectar el CSS personalizado tipo WhatsApp
    const customStyle = document.createElement('link');
    customStyle.id = 'n8n-chat-custom';
    customStyle.rel = 'stylesheet';
    customStyle.href = '/n8n-chat-whatsapp.css';
    document.head.appendChild(customStyle);

    // Cargar el script del chat como módulo
    const script = document.createElement('script');
    script.id = 'n8n-chat-script';
    script.type = 'module';
    // Usamos innerHTML para hacer un import dinámico desde el CDN
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://nochonelpepe2.app.n8n.cloud/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat',
        webhookConfig: { method: 'POST' },
        theme: 'whatsapp',
        title: 'ChatBot Fincas',
        subtitle: '¿En qué puedo ayudarte?',
        defaultOpen: false,
      });
    `;
    document.body.appendChild(script);

    return () => {
      // cleanup
      const s = document.getElementById('n8n-chat-script');
      const l = document.getElementById('n8n-chat-style');
      const c = document.getElementById('n8n-chat-custom');
      if (s && s.parentNode) s.parentNode.removeChild(s);
      if (l && l.parentNode) l.parentNode.removeChild(l);
      if (c && c.parentNode) c.parentNode.removeChild(c);
    };
  }, []);

  return null;
}
