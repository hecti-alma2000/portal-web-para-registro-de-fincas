import { importantPoints } from "@/components/maps/marker-trails/markerTrails.data";
import { Location, Position } from "@/interfaces";
import { create } from "zustand";

export interface Zone {
  id: string;
  name: string;
  coordinate: { lat: number; lng: number };
  headerText: string;
}

export interface Positions {
  originalsPoints: Location[];
  importantPoints: Location[];
  blueRoute1: Position[];
  blueRoute2: Position[];
  redRoute1: Position[];
  redRoute2: Position[];
  redRoute3: Position[];
  currentZone: Zone | null;
  zones: Zone[];
  setImportantPoints: (term: string) => void;
  setCurrentZone: (zone: Zone | null) => void;
}

export const usePositionsStore = create<Positions>((set, get) => ({
  originalsPoints: importantPoints,
  importantPoints: importantPoints,
  blueRoute1: [
    { lat: 20.86979227902078, lng: -76.65062229885747 },
    { lat: 20.869338, lng: -76.650624 },
    { lat: 20.868837, lng: -76.65042 },
    { lat: 20.867323, lng: -76.650259 },
    { lat: 20.866772, lng: -76.650329 },
    { lat: 20.868, lng: -76.65432 },
    { lat: 20.868566, lng: -76.65535 },
    { lat: 20.870807, lng: -76.659111 },
    { lat: 20.872035, lng: -76.660269 },
    { lat: 20.872902, lng: -76.660656 },
    { lat: 20.873373, lng: -76.660768 },
    { lat: 20.877804, lng: -76.661932 },
    { lat: 20.879584, lng: -76.662509 },
    { lat: 20.881127, lng: -76.663485 },
    { lat: 20.882318, lng: -76.664355 },
    { lat: 20.882709, lng: -76.664786 },
    { lat: 20.883107, lng: -76.665773 },
    { lat: 20.88586, lng: -76.66603 },
  ],
  blueRoute2: [
    { lat: 20.868622, lng: -76.650394 },
    { lat: 20.869128, lng: -76.653746 },
  ],
  redRoute1: [
    { lat: 20.90925, lng: -76.6241 },
    { lat: 20.906136, lng: -76.626568 },
    { lat: 20.901442, lng: -76.626511 },
    { lat: 20.900971, lng: -76.626895 },
    { lat: 20.900187, lng: -76.628032 },
    { lat: 20.899448, lng: -76.628603 },
    { lat: 20.898826, lng: -76.629679 },
    { lat: 20.897441, lng: -76.631055 },
    { lat: 20.891722, lng: -76.633683 },
    { lat: 20.891151, lng: -76.634231 },
    { lat: 20.890921, lng: -76.635314 },
    { lat: 20.890958, lng: -76.636427 },
    { lat: 20.890723, lng: -76.636736 },
    { lat: 20.889938, lng: -76.636854 },
    { lat: 20.884124, lng: -76.636645 },
    { lat: 20.881082, lng: -76.636806 },
    { lat: 20.87903, lng: -76.637404 },
    { lat: 20.874195, lng: -76.637962 },
    { lat: 20.871494, lng: -76.637857 },
    { lat: 20.869554, lng: -76.637385 },
    { lat: 20.868356, lng: -76.637363 },
    { lat: 20.866155, lng: -76.638061 },
    { lat: 20.865612, lng: -76.638061 },
    { lat: 20.865391, lng: -76.637849 },
    { lat: 20.865135, lng: -76.637795 },
    { lat: 20.863183, lng: -76.63849 },
    { lat: 20.855503, lng: -76.613245 },
    { lat: 20.852014, lng: -76.602269 },
    { lat: 20.849217, lng: -76.597195 },
    { lat: 20.846352, lng: -76.583848 },
    { lat: 20.846628, lng: -76.579288 },
    { lat: 20.847274, lng: -76.572958 },
    { lat: 20.847615, lng: -76.569555 },
    { lat: 20.851581, lng: -76.554301 },
    { lat: 20.852974, lng: -76.549089 },
    { lat: 20.856137, lng: -76.540509 },
    { lat: 20.857874, lng: -76.53662 },
    { lat: 20.859443, lng: -76.530622 },
    { lat: 20.859443, lng: -76.530349 },
    { lat: 20.859082, lng: -76.529018 },
    { lat: 20.858702, lng: -76.522699 },
    { lat: 20.858877, lng: -76.522796 },
    { lat: 20.860225, lng: -76.523616 },
    { lat: 20.861213, lng: -76.524054 },
    { lat: 20.862266, lng: -76.524684 },
    { lat: 20.863727, lng: -76.525751 },
    { lat: 20.872406, lng: -76.527237 },
    { lat: 20.872604, lng: -76.527221 },
    { lat: 20.873967, lng: -76.526033 },
    { lat: 20.87613, lng: -76.52558 },
    { lat: 20.877739, lng: -76.526218 },
    { lat: 20.880418, lng: -76.52661 },
    { lat: 20.880431, lng: -76.526618 },
    { lat: 20.880443, lng: -76.52661 },
    { lat: 20.880869, lng: -76.526336 },
    { lat: 20.881035, lng: -76.526234 },
    { lat: 20.881265, lng: -76.526237 },
    { lat: 20.897882, lng: -76.531363 },
    { lat: 20.898967, lng: -76.531695 },
    { lat: 20.898709, lng: -76.536019 },
    { lat: 20.90083, lng: -76.53986 },
  ],
  redRoute2: [
    { lat: 20.858702, lng: -76.522699 },
    { lat: 20.85813, lng: -76.522753 },
    { lat: 20.85507, lng: -76.520728 },
    { lat: 20.852922, lng: -76.520054 },
    { lat: 20.85272, lng: -76.52072 },
  ],
  redRoute3: [
    { lat: 20.86202, lng: -76.62822 },
    { lat: 20.860225, lng: -76.62877 },
  ],
  zones: [
    // Aseg\u00FArate de que tus zonas est\u00E9n definidas aqu\u00ED.
    // Deber\u00EDas tener una zona para el centro de Calixto Garc\u00EDa.
    {
      id: "calixto-garcia-centro",
      name: "Centro de Calixto Garc\u00EDa",
      coordinate: { lat: 20.886992464628573, lng: -76.5981011376514 },
      headerText: "Municipio Calixto Garc\u00EDa",
    },
    // ... el resto de tus zonas (incluyendo Finca Vig\u00EDa si es relevante para otra funci\u00F3n) ...
    {
      id: "finca-vigia",
      name: "Finca Vigía del Museo Hemingway",
      coordinate: { lat: 23.067046, lng: -82.296773 },
      headerText: "Finca Vigía del Museo Hemingway",
    },
  ],
  currentZone: null, // Inicializa a null para que el MapFlyTo no vuele a Finca Vig\u00EDa al inicio

  setImportantPoints: (term: string) => {
    const { originalsPoints } = get();
    const filterPoints = originalsPoints.filter((point) =>
      point.name.toLowerCase().includes(term.toLowerCase())
    );
    set({ importantPoints: filterPoints });
  },

  setCurrentZone: (zone: Zone | null) => set({ currentZone: zone }),
}));
