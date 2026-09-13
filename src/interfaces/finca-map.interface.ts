export interface MapFinca {
  id: number;
  nombre: string;
  fotoUrl: string | null;
  localizacion: string;
  propietario: string;
  tipoPropiedad: 'ESTATAL' | 'PRIVADA';
  usoActual: string | null;
  estadoConservacion: string | null;
  latitude: number;
  longitude: number;
  certificada: boolean;
}