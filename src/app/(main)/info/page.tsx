// app/info/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { ContentSection } from '@/components/ui/ContentSection';
import { FAQSection } from '@/components/ui/FAQSection';
import { SidebarNav } from '@/components/ui/SidebarNav';

/**
 * Página principal de "Información sobre Agroturismo".
 * Utiliza un diseño de dos columnas (desktop) para el índice y el contenido.
 */

export default function AgroturismoInfoPage() {
  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-600 shrink-0 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
  return (
    <div className="flex w-full  min-h-screen">
      {/* 1. Columna Izquierda: Menú de Navegación (Solo en desktop) */}
      <aside className="hidden lg:block w-1/5 pt-10 px-6">
        <SidebarNav />
      </aside>

      {/* 2. Columna Derecha: Contenido Principal */}
      {/* flex-1 toma el espacio restante, max-w-4xl centra el contenido y da 'espacio en blanco' */}
      <main className="flex-1 max-w-4xl mx-auto py-10 px-6 lg:px-0">
        {/* Título principal de la página */}
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold leading-tight prose dark:prose-invert">
            Descubre el Agroturismo
          </h1>
          <p className="text-xl mt-4 max-w-4xl mx-auto prose dark:prose-invert">
            Sumérgete en el corazón de nuestras tradiciones rurales. Esta guía esencial te lleva a
            través de los fundamentos del <b>Agroturismo Sostenible</b>, revelando cómo puede
            transformar tu finca en un destino vibrante, generar <b>ingresos diversificados</b> para
            tu familia y contribuir activamente a la <b>preservación cultural</b> y ambiental de tu
            comunidad. Explora las oportunidades que esperan a quienes deciden abrir sus puertas al
            mundo y compartir la autenticidad de la vida en el campo.
          </p>
        </header>

        {/* ==================== SECCIÓN 1: INTRODUCCIÓN ==================== */}
        <ContentSection id="introduccion" title="Introducción al Agroturismo">
          <p className="text-lg prose dark:prose-invert">
            El agroturismo no es solo visitar una finca; es una experiencia inmersiva que conecta al
            visitante con la tierra, la producción de alimentos y la cultura rural. Es un pilar
            clave para el desarrollo sostenible, ofreciendo una fuente de ingresos adicional para
            los agricultores y educando a la sociedad sobre el origen de sus alimentos.
          </p>
          <div className="relative h-96 w-full my-6">
            <Image
              src="/campo-introduccion.jpg"
              alt="Paisaje campestre con agricultores y visitantes"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="rounded-xl shadow-lg object-cover border border-gray-100"
            />
          </div>
        </ContentSection>

        {/* ==================== SECCIÓN 2: TIPOS DE FINCAS ==================== */}
        <ContentSection id="tipos" title="Tipos de Fincas">
          <p className="text-lg prose dark:prose-invert">
            Las fincas agroturísticas pueden especializarse en diferentes áreas, ofreciendo
            experiencias únicas basadas en su producción principal.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-green-700 prose dark:prose-invert">
                Agroalimentarias 🍎
              </h3>
              <p className="text-gray-500 prose">
                Enfoque en cultivos, cosecha, y experiencias culinarias. El visitante participa en
                la recolección y degustación de productos frescos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-700 prose dark:prose-invert">
                Agroganaderas 🐄
              </h3>
              <p className="text-gray-500 prose dark:prose-invert">
                Centradas en la cría de ganado, producción láctea, o manejo de animales. Ofrecen
                talleres de ordeño y demostraciones de trabajo rural.
              </p>
            </div>
          </div>
        </ContentSection>

        {/* ==================== SECCIÓN 3: ACTIVIDADES POPULARES ==================== */}
        <ContentSection id="actividades" title="Actividades Populares">
          <p className="text-lg mb-8 prose dark:prose-invert">
            El agroturismo trasciende la simple visita; se define por las{' '}
            <b>experiencias inmersivas y memorables</b> que ofrece. Aquí, el visitante deja de ser
            un mero observador para convertirse en un<b></b> <b>participante activo</b>. Hemos
            seleccionado cuidadosamente algunas de las actividades más auténticas y atractivas que
            transforman una finca en un destino vibrante, ofreciendo a los visitantes una conexión
            genuina con la tierra, la cultura local y el trabajo del campo. Desde la aventura activa
            hasta la tranquilidad gastronómica, cada experiencia está diseñada para crear recuerdos
            duraderos.
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
              icon={<span>🧀☕</span>} // Icono: Taller / Café
              color="blue"
            />

            <ActivityCard
              title="Cosecha y Degustación"
              description="Disfruta de la experiencia de recolectar frutas o vegetales directamente del árbol y probar productos frescos al instante."
              icon={<span>🍎🍐🍇</span>} // Icono: Cosecha / Frutas
              color="yellow"
            />

            <ActivityCard
              title="Comidas Tradicionales"
              description="Una inmersión gastronómica que ofrece platos cocinados con ingredientes de la finca, resaltando la cocina local y rural."
              icon={<span>🥘</span>} // Icono: Plato de comida
              color="red"
            />

            <ActivityCard
              title="Paseos a Caballo y Senderismo"
              description="Explora los senderos y el entorno natural de la finca a caballo, descubriendo paisajes ocultos y observando la flora local."
              icon={<span>🐴🏞️</span>} // Icono: Caballo / Paisaje
              color="green"
            />

            <ActivityCard
              title="Interacción con Animales"
              description="Una actividad perfecta para familias. Alimenta a las gallinas, ayuda en el cuidado de los terneros o participa en el pastoreo."
              icon={<span>🐐🐑🥚</span>} // Icono: Cabra / Oveja / Huevo
              color="blue"
            />
            <ActivityCard
              title="Noche de Fogatas"
              description="Disfruta de una velada tranquila bajo las estrellas, compartiendo historias locales, música tradicional y degustando de algunos aperitivos."
              icon={<span>🔥🌌🎶</span>} // Icono: Fuego / Noche estrellada / Música
              color="yellow"
            />

            <ActivityCard
              title="Expedición a Pozas y Ríos"
              description="Únete a una caminata guiada hacia cuerpos de agua cercanos para disfrutar de un refrescante baño en pozas naturales o explorar la flora ribereña. (Requiere calzado adecuado)."
              icon={<span>💧🏞️🚶</span>} // Icono: Gota de agua / Paisaje / Caminante
              color="blue"
            />
            {/* Puedes agregar más tarjetas si lo deseas */}
          </div>
        </ContentSection>
        {/* ==================== SECCIÓN 4: FPAT (Concepto y Desarrollo UX) ==================== */}
        <ContentSection id="fpat" title="Fincas con Potencial Agroturístico (FPAT)">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mt-0 mb-3 prose dark:prose-invert">Definición:</h3>

            {/* Contenedor para la definición original, destacada como cita */}
            <blockquote className="border-l-4 border-blue-600 bg-blue-50 p-4 italic text-blue-800 font-bold rounded-lg shadow-sm">
              <p className="mb-0 prose dark:prose-invert">
                "Extensión de tierra limitada que permite diversificar su actividad primaria
                mediante el aprovechamiento de sus recursos naturales y/o construidos, la
                posibilidad de articulación entre ellas mediante cadenas de valor, así como de la
                infraestructura de la localidad; lo que determina su proyección a corto, mediano y
                largo plazo que, para su puesta en valor de uso turístico requiere de la acción
                pública, a fin de contribuir al desarrollo territorial."
              </p>
            </blockquote>

            <h3 className="text-xl font-semibold mt-6 mb-3 border-b border-gray-300 pb-2 prose dark:prose-invert">
              🌱 ¿Qué Significa Ser una FPAT?
            </h3>

            <p className="text-justify leading-relaxed prose dark:prose-invert">
              En términos sencillos, una <b className="font-semibold">FPAT</b> no es solo una finca;
              es un proyecto agrícola que ha sido evaluado y clasificado por tener la capacidad de{' '}
              <b className="text-green-600 font-semibold">
                transformar su producción en una experiencia turística rentable y sostenible
              </b>
              . Es la base para el{' '}
              <b className="text-blue-600 font-semibold">Agroturismo Holguinero</b>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna 1 */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                  ✅ Potencial de Diversificación
                </h4>
                <p className="text-sm text-gray-700">
                  La finca debe poder ir más allá de su actividad principal. Buscamos el{' '}
                  <b className="font-medium">aprovechamiento máximo</b> de sus recursos (naturales,
                  infraestructura, paisajes) para generar{' '}
                  <b className="text-green-600">nuevos ingresos turísticos</b>.
                </p>
              </div>

              {/* Columna 2 */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                  🔗 Articulación Territorial
                </h4>
                <p className="text-sm text-gray-700">
                  Se evalúa la capacidad de la finca para conectarse con otras (formando{' '}
                  <b className="font-medium">cadenas de valor</b>) y utilizar la infraestructura de
                  la localidad, impulsando el{' '}
                  <b className="text-blue-600">desarrollo económico local</b> en conjunto.
                </p>
              </div>

              {/* Columna 3 */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-2 ">
                  🧭 Proyección a Largo Plazo
                </h4>
                <p className="text-sm text-gray-700">
                  La evaluación garantiza que el potencial de la finca no sea solo temporal, sino
                  que tenga una <b className="font-medium">viabilidad y crecimiento definidos</b> a
                  corto, mediano y largo plazo, asegurando la sostenibilidad de la inversión.
                </p>
              </div>

              {/* Columna 4 */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                  📈 Requiere de Acción Pública
                </h4>
                <p className="text-sm text-gray-700">
                  Para que una FPAT alcance su máximo valor turístico, a menudo necesita del apoyo
                  de la <b className="font-medium">gestión y acción pública</b>. Este índice
                  justifica y guía dichas inversiones.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        {/* ==================== SECCIÓN 5: SOSTENIBILIDAD Y MEDIO AMBIENTE (Actualizado) ==================== */}
        <ContentSection id="sostenibilidad" title="Sostenibilidad y Medio Ambiente">
          <p className="text-lg mb-8 prose dark:prose-invert">
            El agroturismo tiene un compromiso fundamental con la{' '}
            <strong className="font-semibold">agricultura sostenible</strong> y la{' '}
            <strong className="font-semibold">conservación ecológica</strong>. Promueve prácticas
            que benefician a la tierra, a la comunidad y al visitante.
          </p>

          {/* Contenedor de doble columna para desktop, apilado en mobile (Responsive) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Columna Izquierda: Principios de Sostenibilidad */}
            <div>
              <h3 className="text-2xl font-semibold text-green-700 mb-4 prose dark:prose-invert">
                Principios de la Agricultura Ecológica
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="prose dark:prose-invert">
                    <strong className="font-semibold">Uso de Abonos Orgánicos:</strong> Sustitución
                    de químicos por compost y estiércol para enriquecer el suelo de forma natural.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="prose dark:prose-invert">
                    <strong className="font-semibol">Manejo Eficiente del Agua:</strong>{' '}
                    Implementación de sistemas de riego por goteo y captación de lluvia para reducir
                    el consumo hídrico.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="prose dark:prose-invert">
                    <strong className="font-semibol">No a la Quema de Cultivos:</strong>{' '}
                    Preservación de la materia orgánica y la microbiología del suelo, evitando la
                    contaminación atmosférica.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="prose dark:prose-invert">
                    <strong className="font-semibol">Conservación de Biodiversidad:</strong>{' '}
                    Mantenimiento de áreas naturales y protección de especies locales dentro de la
                    propiedad.
                  </p>
                </li>
              </ul>
            </div>

            {/* Columna Derecha: Beneficios del Agroturismo Sostenible */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 prose dark:prose-invert">
                Impacto Positivo
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700 prose dark:prose-invert">
                    <strong className="font-semibold text-gray-900">Desarrollo Rural:</strong>{' '}
                    Genera empleo local y diversifica los ingresos de las familias agricultoras.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700 prose dark:prose-invert">
                    <strong className="font-semibold text-gray-900">Conciencia Ambiental:</strong>{' '}
                    Los visitantes aprenden y valoran la importancia de la conservación y la
                    producción limpia.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <p className="text-gray-700 prose dark:prose-invert">
                    <strong className="font-semibold text-gray-900">
                      Mantenimiento de la Tradición:
                    </strong>{' '}
                    Se preservan técnicas agrícolas ancestrales y la cultura local.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </ContentSection>

        {/* ==================== SECCIÓN 6: CTA CERTIFICACIÓN ==================== */}
        <section id="certificacion" className="my-16">
          <div className="bg-green-50 p-8 rounded-2xl border border-green-200 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-green-800 mb-3 prose dark:prose-invert">
              ¡Evalúa tu Finca y Conoce tu Potencial!
            </h3>
            <p className="text-gray-700 mb-6 prose dark:prose-invert">
              Utiliza nuestra herramienta de diagnóstico para saber si tu propiedad cumple con los
              requisitos clave del agroturismo.
            </p>
            <Link
              href="/certificacion"
              className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-xl hover:bg-green-700 transition duration-300 transform hover:scale-105"
            >
              Comenzar Evaluación
            </Link>
          </div>
        </section>
        {/* ==================== SECCIÓN FINAL: PREGUNTAS FRECUENTES (FAQ)  ==================== */}
        <ContentSection id="faq" title="Preguntas Frecuentes">
          <p className="text-lg mb-6 prose dark:prose-invert">
            Encuentra respuestas a las dudas más comunes de visitantes y futuros anfitriones.
          </p>
          <FAQSection />
        </ContentSection>
      </main>
    </div>
  );
}
