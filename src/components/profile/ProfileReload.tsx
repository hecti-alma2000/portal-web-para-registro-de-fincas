'use client';

import { useEffect } from 'react';

// Este componente fuerza un reload una sola vez cuando la navegación proviene
// de otra página interna (cliente -> cliente). Evita recargar en cargas directas/bookmarks.
export default function ProfileReload() {
  useEffect(() => {
    try {
      const ref = document.referrer;
      const origin = location.origin;
      const url = new URL(location.href);

      // Si ya venimos con el flag `reloaded=1`, limpiarlo y no recargar (esto evita bucles)
      if (url.searchParams.get('reloaded') === '1') {
        url.searchParams.delete('reloaded');
        const clean = url.pathname + url.search + url.hash;
        history.replaceState(null, '', clean);
        return;
      }

      // Solo recargar si NO hay sesión en el DOM (mejor robustez)
      // Busca un elemento que solo aparece si hay sesión (por ejemplo, el nombre/email del usuario en el perfil)
      // Ajusta el selector según tu ProfileCard
      const hasSession = document.querySelector('[data-profile-session]');
      if (hasSession) return;

      // Si venimos de otra ruta del mismo origen, forzamos una recarga completa.
      // Para evitar un bucle infinito, añadimos `reloaded=1` al URL antes de recargar.
      if (ref && ref.startsWith(origin)) {
        url.searchParams.set('reloaded', '1');
        setTimeout(() => {
          location.replace(url.toString());
        }, 10);
      }
      // Extra: si navigation type es reload, no recargar
      if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
        return;
      }
    } catch (e) {
      // No bloquear si algo falla: silencioso
      console.error('ProfileReload error:', e);
    }
  }, []);

  return null;
}
