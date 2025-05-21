export type EventFormData = {
  title: string;
  description?: string;
  startDate: string; // Debe ser string porque el formulario trabaja con cadenas
  endDate: string; // Lo mismo aquí
};
