import Map from "ol/Map";
import { Location } from "../../types/interfaces";

export type coord = {
  latitude: number;
  longitude: number;
}

export type TMapProps = {
  positions?: Location[],
  zoom?: number,
  center?: coord,
  height: number
};

export type TMapState = {
  mapContext?: IMapContext;
};

export interface IMapContext {
  map: Map;
}
