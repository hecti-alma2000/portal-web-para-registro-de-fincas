import Image from 'next/image';
import HeroSearch from './HeroSearch';

export default function HeroBanner() {
  return (
    <section className="w-full relative flex flex-col items-center justify-start min-h-[500px] transition-all duration-500 bg-white dark:bg-zinc-950">
      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/imgs_bg/pasadia-vinnales.webp"
          alt="Finca"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 dark:brightness-30 transition-all duration-700"
        />
        <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-b from-white dark:from-zinc-950 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-white dark:from-zinc-950 to-transparent" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 pt-24">
        <h1 className="font-pacifico text-5xl md:text-7xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-8 text-center">
          Fincas y Agroturismo
        </h1>

        <HeroSearch />
      </div>
    </section>
  );
}
