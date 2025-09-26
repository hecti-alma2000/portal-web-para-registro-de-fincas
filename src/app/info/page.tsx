// app/info/page.tsx

import { ActivityCard } from '@/components/ui/ActivityCard';
import { ContentSection } from '@/components/ui/ContentSection';
import { FAQSection } from '@/components/ui/FAQSection';
import { SidebarNav } from '@/components/ui/SidebarNav';
import Link from 'next/link';

/**
 * Página principal de "Información sobre Agroturismo".
 * Utiliza un diseño de dos columnas (desktop) para el índice y el contenido.
 */

export default function AgroturismoInfoPage() {
  const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);
  return (
    <div className="flex w-full bg-white min-h-screen">
      
      {/* 1. Columna Izquierda: Menú de Navegación (Solo en desktop) */}
      <aside className="hidden lg:block w-1/5 pt-10 px-6">
        <SidebarNav />
      </aside>

      {/* 2. Columna Derecha: Contenido Principal */}
      {/* flex-1 toma el espacio restante, max-w-4xl centra el contenido y da 'espacio en blanco' */}
      <main className="flex-1 max-w-4xl mx-auto py-10 px-6 lg:px-0">
        
        {/* Título principal de la página */}
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Descubre el Agroturismo
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            Tu guía completa para entender sus beneficios y oportunidades.
          </p>
        </header>

        {/* ==================== SECCIÓN 1: INTRODUCCIÓN ==================== */}
        <ContentSection id="introduccion" title="Introducción al Agroturismo">
          <p className="text-gray-700 text-lg">
            El agroturismo no es solo visitar una finca; es una experiencia inmersiva que conecta al visitante con la tierra, la producción de alimentos y la cultura rural. Es un pilar clave para el desarrollo sostenible, ofreciendo una fuente de ingresos adicional para los agricultores y educando a la sociedad sobre el origen de sus alimentos.
          </p>
          <img
            src="/images/campo-introduccion.jpg" // Usa el tag para la imagen
            alt="Paisaje campestre con agricultores y visitantes"
            className="rounded-xl shadow-lg my-6 max-h-96 object-cover w-full border border-gray-100"
          />
        </ContentSection>

        {/* ==================== SECCIÓN 2: TIPOS DE FINCAS ==================== */}
        <ContentSection id="tipos" title="Tipos de Fincas">
          <p className="text-gray-700 text-lg">
            Las fincas agroturísticas pueden especializarse en diferentes áreas, ofreciendo experiencias únicas basadas en su producción principal.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition">
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Agroalimentarias 🍎</h3>
                  <p className="text-gray-500">Enfoque en cultivos, cosecha, y experiencias culinarias. El visitante participa en la recolección y degustación de productos frescos.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition">
                  <h3 className="text-xl font-semibold mb-2 text-blue-700">Agroganaderas 🐄</h3>
                  <p className="text-gray-500">Centradas en la cría de ganado, producción láctea, o manejo de animales. Ofrecen talleres de ordeño y demostraciones de trabajo rural.</p>
              </div>
          </div>
        </ContentSection>

         {/* ==================== SECCIÓN 3: ACTIVIDADES POPULARES ==================== */}
        <ContentSection id="actividades" title="Actividades Populares">
          <p className="text-gray-700 text-lg mb-8">
            El agroturismo se define por las experiencias que ofrece. Aquí están algunas de las actividades más atractivas que pueden realizar los visitantes en las fincas.
          </p>
          
          {/* Diseño responsive de cuadrícula: 1 columna en móvil, 2 en tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <ActivityCard
              title="Recorridos Guiados"
              description="Aprende sobre el ciclo de vida de los cultivos y la historia de la finca directamente del propietario o un guía experto."
              icon={<span>🗺️</span>} // Icono: Mapa / Sendero
              color="green"
            />
            
            <ActivityCard
              title="Talleres de Producción"
              description="Participa en actividades prácticas como la fabricación de queso, el ordeño manual o la preparación de café artesanal."
              icon={<span>☕</span>} // Icono: Taller / Café
              color="blue"
            />
            
            <ActivityCard
              title="Cosecha y Degustación"
              description="Disfruta de la experiencia de recolectar frutas o vegetales directamente del árbol y probar productos frescos al instante."
              icon={<span>🍎</span>} // Icono: Cosecha / Fruta
              color="yellow"
            />
            
            <ActivityCard
              title="Comidas Tradicionales"
              description="Una inmersión gastronómica que ofrece platos cocinados con ingredientes de la finca, resaltando la cocina local y rural."
              icon={<span>🥘</span>} // Icono: Plato de comida
              color="red"
            />

            {/* Puedes agregar más tarjetas si lo deseas */}
          </div>
        </ContentSection>

        {/* ==================== SECCIÓN 4: SOSTENIBILIDAD Y MEDIO AMBIENTE (Actualizado) ==================== */}
        <ContentSection id="sostenibilidad" title="Sostenibilidad y Medio Ambiente">
          <p className="text-gray-700 text-lg mb-8">
            El agroturismo tiene un compromiso fundamental con la <strong className="font-semibold text-gray-900">agricultura sostenible</strong> y la <strong className="font-semibold text-gray-900">conservación ecológica</strong>. Promueve prácticas que benefician a la tierra, a la comunidad y al visitante.
          </p>
          
          {/* Contenedor de doble columna para desktop, apilado en mobile (Responsive) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            
            {/* Columna Izquierda: Principios de Sostenibilidad */}
            <div>
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                Principios de la Agricultura Ecológica
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Uso de Abonos Orgánicos:</strong> Sustitución de químicos por compost y estiércol para enriquecer el suelo de forma natural.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Manejo Eficiente del Agua:</strong> Implementación de sistemas de riego por goteo y captación de lluvia para reducir el consumo hídrico.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">No a la Quema de Cultivos:</strong> Preservación de la materia orgánica y la microbiología del suelo, evitando la contaminación atmosférica.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Conservación de Biodiversidad:</strong> Mantenimiento de áreas naturales y protección de especies locales dentro de la propiedad.
                  </p>
                </li>
              </ul>
            </div>

            {/* Columna Derecha: Beneficios del Agroturismo Sostenible */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Impacto Positivo
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Desarrollo Rural:</strong> Genera empleo local y diversifica los ingresos de las familias agricultoras.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Conciencia Ambiental:</strong> Los visitantes aprenden y valoran la importancia de la conservación y la producción limpia.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700">
                    <strong className="font-semibold text-gray-900">Mantenimiento de la Tradición:</strong> Se preservan técnicas agrícolas ancestrales y la cultura local.
                  </p>
                </li>
              </ul>
            </div>
            
          </div>
          
        </ContentSection>

        {/* ==================== SECCIÓN N5: PREGUNTAS FRECUENTES (FAQ) ==================== */}
        <ContentSection id="faq" title="Preguntas Frecuentes">
            <p className="text-gray-700 text-lg mb-6">
                Encuentra respuestas a las dudas más comunes de visitantes y futuros anfitriones.
            </p>
            <FAQSection />
        </ContentSection>
        
        {/*
          Aquí se añadirán las otras ContentSections: 
          - Sostenibilidad
      
          - Certificación
        */}
        
        {/* ==================== SECCIÓN FINAL: CTA CERTIFICACIÓN ==================== */}
        <section id="certificacion" className="my-16">
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200 shadow-lg text-center">
                <h3 className="text-3xl font-bold text-green-800 mb-3">
                    ¡Evalúa tu Finca y Conoce tu Potencial!
                </h3>
                <p className="text-gray-700 mb-6">
                    Utiliza nuestra herramienta de diagnóstico para saber si tu propiedad cumple con los requisitos clave del agroturismo.
                </p>
                <Link 
                    href="/certificacion" 
                    className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-xl hover:bg-green-700 transition duration-300 transform hover:scale-105"
                >
                    Comenzar Evaluación
                </Link>
            </div>
        </section>

      </main>
    </div>
  );
}