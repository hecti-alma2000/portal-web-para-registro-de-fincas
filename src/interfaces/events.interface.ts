export interface Event {
  id: string;
  startDate: string; // Tipo string para mantener consistencia
  endDate: string; // Tipo string
  title: string;
  address: string;
  url: string | null;
  description: string | null; // Permitir valores null
  createdAt: string;
  updatedAt: string;
}
