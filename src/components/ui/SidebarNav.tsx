// SidebarNav.tsx

import Link from 'next/link';

// Array de secciones para generar la navegación
const sections = [
  { id: 'introduccion', title: 'Introducción al Agroturismo' },
  { id: 'tipos', title: 'Tipos de Fincas' },
  { id: 'actividades', title: 'Actividades Populares' },
  { id: 'sostenibilidad', title: 'Sostenibilidad y Ambiente' },
  { id: 'faq', title: 'Preguntas Frecuentes (FAQ)' },
  { id: 'certificacion', title: 'Sistema de Certificación' },
];

/**
 * Menú de navegación lateral con enlaces de ancla.
 * Fijo en desktop, oculto en mobile para una mejor UX.
 */
export const SidebarNav: React.FC = () => {
  // Nota: Para una implementación más avanzada, podrías usar estado de React
  // (por ej., Intersection Observer) para resaltar el enlace 'activo'
  // según la sección visible en el viewport. Por ahora, es estático.

  return (
    <nav className="sticky top-24 pt-4">
      {' '}
      {/* top-24 asumiendo que el Navbar ocupa espacio */}
      <h3 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-800 pb-2">
        Índice de Contenidos
      </h3>
      <ul className="flex flex-col space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`} // Enlace de ancla
              // Estilos para el estado inactivo, con hover para resaltar
              className="text-gray-600 text-sm hover:text-green-600 transition duration-150 pl-3 border-l-2 border-transparent hover:border-green-600"
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
