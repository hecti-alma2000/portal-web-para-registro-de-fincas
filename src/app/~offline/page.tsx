// src/app/~offline/page.tsx

export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-700">
        <img
          src="/icons/logo1.png"
          alt="Logo del portal"
          className="h-full w-full object-cover"
        />
      </span>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Estás sin conexión
      </h1>
      <p className="max-w-md leading-relaxed text-zinc-600 dark:text-zinc-300">
        El portal web para el registro de fincas no pudo cargar esta página.
        Puedes seguir consultando las páginas e imágenes que ya habías visitado.
      </p>
      <button
        type="button"
        onClick={() => {
          if (navigator.onLine) {
            window.location.reload();
          }
        }}
        className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
      >
        Reintentar
      </button>
    </main>
  );
}