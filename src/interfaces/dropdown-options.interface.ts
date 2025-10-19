export interface DropdownOption {
  label: string; // Etiqueta visible (ej: "Hombres")
  href: string; // URL de destino (ej: "/category/men")
}

export interface DropdownMenuProps {
  mainLabel: string; // La etiqueta principal del menú (ej: "Ropa")
  options: DropdownOption[]; // El arreglo de opciones
}
