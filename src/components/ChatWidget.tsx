'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, X } from 'lucide-react'; // Importamos el ícono X para cerrar

// URL principal del script de n8n
const N8N_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

// --- CORRECCIÓN DE TIPADO PARA TYPESCRIPT ---

interface N8nChatConfig {
  webhookUrl: string;
  webhookConfig: { method: 'POST' };
  theme: string;
  title: string;
  subtitle: string;
  defaultOpen: boolean;
}

declare global {
  interface Window {
    createChat?: (config: N8nChatConfig) => void;
  }
}

// ---------------------------------------------

export default function ChatWidget() {
  // 1. Controla si el widget dinámico de n8n ha tomado el control.
  const [isN8nWidgetLoaded, setIsN8nWidgetLoaded] = useState(false);

  // 2. Controla si el modal interno de fallback está abierto.
  const [isFallbackChatOpen, setIsFallbackChatOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Inyectar CSS personalizado
    if (!document.getElementById('n8n-chat-custom')) {
      const customStyle = document.createElement('link');
      customStyle.id = 'n8n-chat-custom';
      customStyle.rel = 'stylesheet';
      customStyle.href = '/n8n-chat-whatsapp.css';
      document.head.appendChild(customStyle);
    }

    // Cleanup del CSS personalizado al desmontar
    return () => {
      const c = document.getElementById('n8n-chat-custom');
      if (c && c.parentNode) c.parentNode.removeChild(c);
    };
  }, []);

  const initializeN8nChat = () => {
    // Intentamos inicializar el widget dinámico
    if (typeof window.createChat === 'function') {
      // ÉXITO: El script cargó. N8n tomará el control.
      setIsN8nWidgetLoaded(true);

      window.createChat({
        webhookUrl:
          'https://nochonelpepe2.app.n8n.cloud/webhook/5f1c0c82-0ff9-40c7-9e2e-b1a96ffe24cd/chat',
        webhookConfig: { method: 'POST' },
        theme: 'whatsapp',
        title: 'ChatBot Fincas',
        subtitle: '¿En qué puedo ayudarte?',
        defaultOpen: false,
      });
    } else {
      // FALLO: El botón estático permanece, y al hacer clic abrirá el modal de error.
      console.error('n8n chat library not found after load. Using fallback modal.');
    }
  };

  const handleFallbackClick = () => {
    // Si n8n no se cargó, abrimos el modal interno de indisponibilidad.
    if (!isN8nWidgetLoaded) {
      setIsFallbackChatOpen(true);
    }
    // Si n8n se cargó, el botón ya debería estar oculto, pero si se clica,
    // no hacemos nada porque el widget de n8n es el que debe manejar su apertura.
  };

  return (
    <>
      {/* 1. Script principal de n8n. Llama a initializeN8nChat al cargarse. */}
      <Script src={N8N_SCRIPT_URL} strategy="lazyOnload" onLoad={initializeN8nChat} />

      {/* 2. Botón/Widget Estático (FALLBACK): Siempre visible si el script de n8n no se cargó. */}
      {!isN8nWidgetLoaded && (
        <button
          // 🔑 Cambiamos el <a> por un <button> y le asignamos el manejador interno
          onClick={handleFallbackClick}
          className="fixed bottom-6 right-6 z-[9999] p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          title="Abrir Chat"
        >
          <MessageSquare size={28} />

          <span className="sr-only">Cargando chat o abrir chat de soporte</span>
          <RefreshCw size={16} className="absolute top-0 right-0 animate-spin text-yellow-300" />
        </button>
      )}

      {/* 3. Modal de Error Interno (Aparece al hacer clic en el botón de fallback) */}
      {isFallbackChatOpen && (
        <div
          className="fixed inset-0 z-[9998] flex items-end justify-end p-4 pointer-events-none"
          // Backdrop para cerrar el chat al hacer clic fuera (opcional)
        >
          {/* 🔑 La ventana del chat de error */}
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-96 flex flex-col pointer-events-auto">
            {/* Header (Estilo WhatsApp) */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold">ChatBot Fincas</h3>
              <button
                onClick={() => setIsFallbackChatOpen(false)}
                className="p-1 rounded-full hover:bg-green-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Mensaje de Error */}
            <div className="flex-grow p-4 text-center flex flex-col justify-center items-center">
              <p className="text-xl text-red-600 font-bold mb-4">❌ Error de Conexión ❌</p>
              <p className="text-gray-700 leading-relaxed">
                El servicio automático de chat (n8n) no está disponible en este momento.
                <br />
                Por favor, inténtalo de nuevo más tarde.
              </p>
            </div>
          </div>
        </div>
      )}

      {null}
    </>
  );
}
