'use client';
import dynamic from 'next/dynamic';

// =========================================================================
// 1. Carga Dinámica del icono Leaf de Lucide React
// =========================================================================

const LazyLeaf = dynamic(() => import('lucide-react').then((mod) => mod.Leaf), {
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-200 rounded-full mr-2"></div>,
  ssr: false,
});

interface Props {
  dividerTitle: string;
}

export const Divider = ({ dividerTitle }: Props) => {
  return (
    <span className="flex items-center">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-green-500"></span>

      <span className="shrink-0 px-4 text-gray-900 text-2xl font-bold flex items-center">
        {/* Aquí renderizamos el componente LazyLeaf */}
        <LazyLeaf className="text-green-600 mr-2 text-xl" />
        {/* Ajusta el color y tamaño */}
        {dividerTitle}
      </span>

      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-green-500 to-green-500"></span>
    </span>
  );
};
