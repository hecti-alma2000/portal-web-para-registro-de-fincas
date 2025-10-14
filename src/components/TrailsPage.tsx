'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const DynamicLocationMap = dynamic(
  () => import('@/components/maps/location/LocationMap').then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => <p>Cargando el mapa...</p>,
  }
);

export default function TrailsPage() {
  useEffect(() => {
    // Cargar el CSS del chat
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    document.head.appendChild(link);

    // Inyectar el CSS personalizado tipo WhatsApp
    const customStyle = document.createElement('link');
    customStyle.rel = 'stylesheet';
    customStyle.href = '/n8n-chat-whatsapp.css';
    document.head.appendChild(customStyle);

    // Cargar el script del chat
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://nochonelpepe2.app.n8n.cloud/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat',
        webhookConfig: {
          method: 'POST',
        },
        theme: 'whatsapp',
        title: 'ChatBot Fincas',
        subtitle: '¿En qué puedo ayudarte?',
        defaultOpen: false,
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(customStyle);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full ">
      <DynamicLocationMap />
    </div>
  );
}
