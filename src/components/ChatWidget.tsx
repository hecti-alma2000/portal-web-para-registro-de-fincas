'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Bot, RefreshCw, X } from 'lucide-react';

// URL principal del script de n8n.
// Usamos el build UMD (no el .es.js, que es un módulo ES con `export`
// y no se ejecuta correctamente como <script> clásico). El build UMD
// expone su API bajo window.N8nChat.createChat(...), no window.createChat.
const N8N_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.umd.js';
const N8N_STYLES_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL ||
  'https://luisn8n77.app.n8n.cloud/webhook/f5907f5e-eb1e-4e1d-b9ed-71af506f142d/chat';

interface N8nChatConfig {
  webhookUrl: string;
  webhookConfig: { method: 'POST' };
  title: string;
  subtitle: string;
  initialMessages: string[];
  defaultOpen: boolean;
}

declare global {
  interface Window {
    // El build UMD expone todo bajo un namespace global `N8nChat`
    // (no `window.createChat` directo).
    N8nChat?: { createChat: (config: N8nChatConfig) => void };
  }
}

export default function ChatWidget() {
  const [isN8nWidgetLoaded, setIsN8nWidgetLoaded] = useState(false);
  const [isN8nLoadFailed, setIsN8nLoadFailed] = useState(false);
  const [isFallbackChatOpen, setIsFallbackChatOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const n8nStyle = document.createElement('link');
    n8nStyle.id = 'n8n-chat-base';
    n8nStyle.rel = 'stylesheet';
    n8nStyle.href = N8N_STYLES_URL;
    document.head.appendChild(n8nStyle);

    const customStyle = document.createElement('link');
    customStyle.id = 'n8n-chat-custom';
    customStyle.rel = 'stylesheet';
    customStyle.href = '/n8n-chat-whatsapp.css';
    document.head.appendChild(customStyle);

    return () => {
      n8nStyle.remove();
      customStyle.remove();
    };
  }, []);

  const initializeN8nChat = () => {
    if (typeof window.N8nChat?.createChat === 'function') {
      try {
        window.N8nChat.createChat({
          webhookUrl: N8N_WEBHOOK_URL,
          webhookConfig: { method: 'POST' },
          title: 'SmartLiz 5.0',
          subtitle: 'Tu asistente virtual del Portal de Fincas',
          initialMessages: [
            '¡Hola! 👋 Soy SmartLiz 5.0, tu asistente virtual.',
            '¿En qué puedo ayudarte hoy? Puedo orientarte sobre el registro de fincas, la certificación FPAT o el uso del portal.',
          ],
          defaultOpen: false,
        });
        setIsN8nWidgetLoaded(true);
        setIsN8nLoadFailed(false);
      } catch (error) {
        console.error('No se pudo inicializar el chat de n8n:', error);
        setIsN8nLoadFailed(true);
      }
    } else {
      setIsN8nLoadFailed(true);
    }
  };

  const handleLauncherClick = () => {
    if (isN8nWidgetLoaded) {
      document.querySelector<HTMLElement>('.chat-window-toggle')?.click();
    } else if (isN8nLoadFailed) {
      setIsFallbackChatOpen(true);
    }
  };

  return (
    <div id="chat-widget-root">
      <Script
        src={N8N_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={initializeN8nChat}
        onError={() => setIsN8nLoadFailed(true)}
      />

      <button
        onClick={handleLauncherClick}
        className="fixed bottom-6 right-6 z-[1301] p-4 bg-linear-to-br from-green-500 to-green-700 text-white rounded-full shadow-2xl shadow-green-900/30 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title={isN8nLoadFailed ? 'SmartLiz 5.0 no disponible' : 'Abrir SmartLiz 5.0'}
        aria-label={isN8nLoadFailed ? 'SmartLiz 5.0 no disponible' : 'Abrir chat SmartLiz 5.0'}
      >
        <Bot size={28} />
        {!isN8nWidgetLoaded && !isN8nLoadFailed && (
          <RefreshCw
            size={16}
            className="absolute -top-1 -right-1 animate-spin text-yellow-400 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 p-0.5"
          />
        )}
      </button>

      {/* 2. Modal de Error (Fallback) Adaptable */}
      {isFallbackChatOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-end p-4 pointer-events-none sm:p-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-[350px] h-[450px] flex flex-col pointer-events-auto border border-zinc-200 dark:border-zinc-800 transition-all duration-500 overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header con degradado de marca */}
            <div className="bg-linear-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
                  <Bot size={22} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">SmartLiz 5.0</h3>
                  <p className="text-xs text-green-100 opacity-80">No disponible</p>
                </div>
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
    </div>
  );
}
