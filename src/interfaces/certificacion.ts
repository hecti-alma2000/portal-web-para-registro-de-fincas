// ----------------------------------------------------
// 1. Definición de tipos
// ----------------------------------------------------

// DEBE ESTAR DEFINIDO PRIMERO
type CheckboxColor = 'red' | 'amber' | 'green'; 

// Define la estructura de cada entrada de color
interface ColorStyle {
    baseBorder: string;
    checkedRing: string;
}

// Define la estructura del mapa completo (Ahora puede encontrar CheckboxColor)
type ColorMap = Record<CheckboxColor, ColorStyle>;

// ----------------------------------------------------
// 2. Uso del mapa
// ----------------------------------------------------

// Mapa de colores de Tailwind para el BORDE del contenedor (la tarjeta)
const colorMap: ColorMap = {
    // 1. Requisitos Clave (ROJO)
    red: { 
        baseBorder: 'border-red-500', 
        checkedRing: 'ring-red-300', 
    },
    // 2. Potencial Adicional (ÁMBAR/NARANJA)
    amber: { 
        baseBorder: 'border-amber-500', 
        checkedRing: 'ring-amber-300',
    },
    // 3. Elementos Distintivos (VERDE)
    green: { 
        baseBorder: 'border-green-500', 
        checkedRing: 'ring-green-300',
    },
};