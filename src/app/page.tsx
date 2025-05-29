"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Cargar dinámicamente el componente LocationMap
const DynamicLocationMap = dynamic(
  () =>
    import("@/components/maps/location/LocationMap").then(
      (mod) => mod.LocationMap
    ),
  {
    ssr: false, // Deshabilitar SSR
    loading: () => <p>Cargando el mapa...</p>, // Loading state
  }
);

export default function TrailsPage() {
  useEffect(() => {
    // Cargar el CSS del chat
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    // Inyectar el CSS personalizado tipo WhatsApp
    const customStyle = document.createElement("link");
    customStyle.rel = "stylesheet";
    customStyle.href = "/n8n-chat-whatsapp.css"; // Cambiar a la ruta pública
    document.head.appendChild(customStyle);

    // Cargar el script del chat
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://tinoof2.app.n8n.cloud/webhook/63f5c60b-cdac-4087-afa9-820343805dde/chat', // <-- Cambia esta URL si tu webhook ha cambiado o no existe
        webhookConfig: {
                method: 'POST',
                headers: {}
            },
        target: '#n8n-chat',
        mode: 'window',
        chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            metadata: {},
            showWelcomeScreen: false,
          initialMessages: [
                'Hola 👋',
                'Soy tu guía de agroturismo. ¿En qué puedo ayudarte hoy?'
            ],
            i18n: {
                en: {
                    title: 'Agroturismo',
                    subtitle: "Estamos aquí para ayudarte a planear tu experiencia.",
                    footer: '',
                    getStarted: 'Nueva consulta',
                    inputPlaceholder: 'Pregunta sobre nuestras fincas',
                },
            },
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="h-[1000px]">
        <DynamicLocationMap />
      </div>
      {/* Chat mejorado de n8n usando @n8n/chat CDN */}
      <div
        id="n8n-chat"
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
      ></div>
    </div>
  );
}
