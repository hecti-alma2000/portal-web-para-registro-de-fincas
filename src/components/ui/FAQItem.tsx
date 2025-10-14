// components/FAQItem.tsx
'use client';

import { useState } from 'react';
// Íconos simples para indicar estado (puedes usar iconos de lucide-react o Heroicons si los tienes instalados)
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

interface FAQItemProps {
  question: string;
  answer: string;
}

/**
 * Componente individual de pregunta y respuesta con funcionalidad de acordeón.
 */
export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between hover:cursor-pointer items-center text-lg font-medium text-left text-gray-800 hover:bg-gray-50 transition duration-150"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="text-green-600 transition-transform duration-300">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>

      {/* Contenido que se muestra u oculta */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-4 pb-4 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};
