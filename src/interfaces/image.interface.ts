
export interface ImageItem {
  id: string | number; // ID único para la key y el layoutId de Framer Motion
  name: string;        // Nombre o título de la imagen (puede usarse como alt text)
  url: string;         // URL de la imagen
  description?: string; // Descripción opcional
}