// components/ActivityCard.tsx

import React from 'react';

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode; // Puedes usar un SVG o un ícono de librería
  color: 'green' | 'blue' | 'yellow' | 'red';
}

const colorMap = {
  green: 'border-green-500 bg-green-50 text-green-800',
  blue: 'border-blue-500 bg-blue-50 text-blue-800',
  yellow: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  red: 'border-red-500 bg-red-50 text-red-800',
};

/**
 * Tarjeta simple para destacar una actividad agroturística.
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({ title, description, icon, color }) => {
  const baseClasses = "flex flex-col items-center text-center p-6 rounded-xl border-t-4 shadow-sm hover:shadow-md transition duration-200";
  
  return (
    <div className={`${baseClasses} ${colorMap[color]}`}>
      <div className="text-4xl mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-700">
        {description}
      </p>
    </div>
  );
};