'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, X } from 'lucide-react';

// URL principal del script de n8n
const N8N_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

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

export default function ChatWidget() {
  const [isN8nWidgetLoaded, setIsN8nWidgetLoaded] = useState(false);
  const [isFallbackChatOpen, setIsFallbackChatOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (!document.getElementById('n8n-chat-custom')) {
      const customStyle = document.createElement('link');
      customStyle.id = 'n8n-chat-custom';
      customStyle.rel = 'stylesheet';
      customStyle.href = '/n8n-chat-whatsapp.css';
      document.head.appendChild(customStyle);
    }

    return () => {
      const c = document.getElementById('n8n-chat-custom');
      if (c && c.parentNode) c.parentNode.removeChild(c);
    };
  }, []);

  const initializeN8nChat = () => {
    if (typeof window.createChat === 'function') {
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
    }
  };

  const handleFallbackClick = () => {
    if (!isN8nWidgetLoaded) {
      setIsFallbackChatOpen(true);
    }
  };

  return (
    <>
      <Script src={N8N_SCRIPT_URL} strategy="lazyOnload" onLoad={initializeN8nChat} />

      {/* 1. Botón Flotante de Carga/Fallback */}
      {!isN8nWidgetLoaded && (
        <button
          onClick={handleFallbackClick}
          className="fixed bottom-6 right-6 z-[100] p-4 bg-green-600 dark:bg-green-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Abrir Chat"
        >
          <MessageSquare size={28} />
          <span className="sr-only">Cargando chat...</span>
          <RefreshCw
            size={16}
            className="absolute -top-1 -right-1 animate-spin text-yellow-400 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 p-0.5"
          />
        </button>
      )}

      {/* 2. Modal de Error (Fallback) Adaptable */}
      {isFallbackChatOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-end p-4 pointer-events-none sm:p-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-[350px] h-[450px] flex flex-col pointer-events-auto border border-zinc-200 dark:border-zinc-800 transition-all duration-500 overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header Estilo WhatsApp con degradado */}
            <div className="bg-linear-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">ChatBot Fincas</h3>
                <p className="text-xs text-green-100 opacity-80">No disponible</p>
              </div>
              <button
                onClick={() => setIsFallbackChatOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Mensaje */}
            <div className="flex-1 p-6 text-center flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-900/50">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                <RefreshCw size={32} />
              </div>

              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Error de Conexión
              </h4>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                El servicio automático de chat no está disponible en este momento.
                <br />
                <br />
                Estamos trabajando para restaurar la conexión con <strong>n8n</strong>.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Reintentar
              </button>
            </div>

            {/* Footer del Modal */}
            <div className="p-3 bg-white dark:bg-zinc-950 text-center border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                Estado del Sistema
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
