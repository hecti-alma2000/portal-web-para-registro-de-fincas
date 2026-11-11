// Catálogo de países admitidos para el registro de fincas.
// - `code`: código ISO 3166-1 alfa-2 (es lo que se guarda en BD, campo Finca.pais).
// - `center` / `zoom`: vista inicial del mapa al seleccionar el país.
// Las banderas son SVG locales en /public/flags/<code>.svg (funcionan sin conexión).
// Para añadir un país: agregar la entrada aquí y copiar su SVG a public/flags.

export interface Country {
  code: string;
  name: string;
  center: [number, number];
  zoom: number;
}

export const DEFAULT_COUNTRY_CODE = 'CU';

export const COUNTRIES: Country[] = [
  { code: 'CU', name: 'Cuba', center: [21.7, -79.5], zoom: 7 },
  { code: 'AR', name: 'Argentina', center: [-38.4, -63.6], zoom: 4 },
  { code: 'BO', name: 'Bolivia', center: [-16.3, -63.6], zoom: 5 },
  { code: 'BR', name: 'Brasil', center: [-14.2, -51.9], zoom: 4 },
  { code: 'CA', name: 'Canadá', center: [56.1, -106.3], zoom: 3 },
  { code: 'CL', name: 'Chile', center: [-35.7, -71.5], zoom: 4 },
  { code: 'CO', name: 'Colombia', center: [4.6, -74.3], zoom: 5 },
  { code: 'CR', name: 'Costa Rica', center: [9.75, -83.75], zoom: 7 },
  { code: 'DE', name: 'Alemania', center: [51.2, 10.4], zoom: 5 },
  { code: 'DO', name: 'República Dominicana', center: [18.7, -70.2], zoom: 7 },
  { code: 'EC', name: 'Ecuador', center: [-1.8, -78.2], zoom: 6 },
  { code: 'ES', name: 'España', center: [40.4, -3.7], zoom: 5 },
  { code: 'FR', name: 'Francia', center: [46.2, 2.2], zoom: 5 },
  { code: 'GB', name: 'Reino Unido', center: [54.0, -2.5], zoom: 5 },
  { code: 'GT', name: 'Guatemala', center: [15.8, -90.2], zoom: 7 },
  { code: 'HN', name: 'Honduras', center: [15.2, -86.2], zoom: 7 },
  { code: 'HT', name: 'Haití', center: [19.0, -72.3], zoom: 8 },
  { code: 'IT', name: 'Italia', center: [41.9, 12.6], zoom: 5 },
  { code: 'JM', name: 'Jamaica', center: [18.1, -77.3], zoom: 8 },
  { code: 'MX', name: 'México', center: [23.6, -102.5], zoom: 5 },
  { code: 'NI', name: 'Nicaragua', center: [12.9, -85.2], zoom: 7 },
  { code: 'PA', name: 'Panamá', center: [8.5, -80.8], zoom: 7 },
  { code: 'PE', name: 'Perú', center: [-9.2, -75.0], zoom: 5 },
  { code: 'PR', name: 'Puerto Rico', center: [18.2, -66.5], zoom: 9 },
  { code: 'PT', name: 'Portugal', center: [39.4, -8.2], zoom: 6 },
  { code: 'PY', name: 'Paraguay', center: [-23.4, -58.4], zoom: 6 },
  { code: 'SV', name: 'El Salvador', center: [13.8, -88.9], zoom: 8 },
  { code: 'US', name: 'Estados Unidos', center: [37.1, -95.7], zoom: 4 },
  { code: 'UY', name: 'Uruguay', center: [-32.5, -55.8], zoom: 6 },
  { code: 'VE', name: 'Venezuela', center: [6.4, -66.6], zoom: 5 },
];

// Cuba primero (país por defecto) y el resto en orden alfabético
const [defaultCountry, ...rest] = COUNTRIES;
export const SORTED_COUNTRIES: Country[] = [
  defaultCountry,
  ...rest.sort((a, b) => a.name.localeCompare(b.name, 'es')),
];

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export const isValidCountryCode = (code: unknown): code is string =>
  typeof code === 'string' && BY_CODE.has(code.toUpperCase());

export const getCountry = (code?: string | null): Country =>
  BY_CODE.get((code || DEFAULT_COUNTRY_CODE).toUpperCase()) ?? BY_CODE.get(DEFAULT_COUNTRY_CODE)!;

export const getFlagUrl = (code?: string | null) =>
  `/flags/${(code || DEFAULT_COUNTRY_CODE).toLowerCase()}.svg`;
