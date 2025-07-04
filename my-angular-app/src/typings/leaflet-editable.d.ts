import * as L from 'leaflet';

declare module 'leaflet' {
  interface Map {
    editTools: any;
  }

  interface Polyline {
    enableEdit(): void;
    disableEdit(): void;
  }
}

