

// Definición de las propiedades del componente
interface ContentSectionProps {
  id: string; // Para el enlace de ancla
  title: string;
  children: React.ReactNode;
}

/**
 * Componente que envuelve cada sección de contenido de la página informativa.
 * Establece el formato de título y margen para un diseño limpio.
 */
export const ContentSection = ({id, title, children}:ContentSectionProps) => {
  return (
    // 'pt-8' añade espacio superior para separar secciones, 'scroll-mt-24' es crucial para el desplazamiento
    // en la navegación de anclas, compensando una posible barra de navegación fija.
    <section id={id} className="pt-8 scroll-mt-24 border-b pb-10">
      
      {/* Título de la Sección - Fuente legible y prominente */}
      <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-6">
        {title}
      </h2>
      
      {/* Contenido dinámico (párrafos, imágenes, etc.) */}
      <div className="space-y-6">
        {children}
      </div>

    </section>
  );
};