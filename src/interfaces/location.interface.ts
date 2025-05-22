export interface Position {
  lat: number;
  lng: number;
}

export interface Location {
  id: number;
  name: string;
  image: string;
  position: Position;
  icon: string;
  simbology: string[];
}
