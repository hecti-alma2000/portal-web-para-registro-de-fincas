// components/FAQSection.tsx

import { FAQItem } from './FAQItem';

// Array de datos para las Preguntas Frecuentes
const faqData = [
  {
    question: "¿Qué es exactamente el agroturismo?",
    answer: "Es una forma de turismo rural donde los visitantes experimentan la vida agrícola, participando en actividades de la finca como la cosecha, el ordeño o la elaboración de productos, promoviendo la sostenibilidad y la cultura local.",
  },
  {
    question: "¿Qué necesito para registrar mi finca en el portal?",
    answer: "Principalmente, debes cumplir con los parámetros clave de accesibilidad, contar con el permiso del propietario y ofrecer servicios básicos (como un baño) para los visitantes. Te invitamos a usar la herramienta de Certificación para un diagnóstico rápido.",
  },
  {
    question: "¿El agroturismo solo aplica a fincas grandes?",
    answer: "No. El agroturismo puede ser implementado por cualquier finca que desee abrir sus puertas y ofrecer una experiencia educativa o participativa. Lo importante es la calidad de la experiencia, no el tamaño de la propiedad.",
  },
  {
    question: "¿Cómo puedo asegurar un entorno limpio y seguro para los visitantes?",
    answer: "Debes delimitar senderos claros, señalizar áreas de riesgo, y tener puntos de descanso. Es crucial contar con un seguro básico y mantener una infraestructura sanitaria adecuada.",
  },
];

/**
 * Agrupa todos los ítems de FAQ dentro de un contenedor visualmente limpio.
 */
export const FAQSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 divide-y divide-gray-200">
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};