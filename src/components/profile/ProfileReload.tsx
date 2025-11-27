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

      // Si venimos de otra ruta del mismo origen, forzamos una recarga completa.
      // Para evitar un bucle infinito, añadimos `reloaded=1` al URL antes de recargar.
      if (ref && ref.startsWith(origin)) {
        url.searchParams.set('reloaded', '1');
        // Reemplazamos la URL actual con la versión que tiene el flag y navegamos a ella.
        // `location.replace` hace una navegación completa y no deja la entrada anterior en el history.
        setTimeout(() => {
          location.replace(url.toString());
        }, 10);
      }
    } catch (e) {
      // No bloquear si algo falla: silencioso
      console.error('ProfileReload error:', e);
    }
  }, []);

  return null;
}
