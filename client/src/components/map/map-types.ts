import Map from "ol/Map";

import Position from "../../interfaces/Position";

export type TMapProps = {
  positions?: Position[]
};

export type TMapState = {
  mapContext?: IMapContext;
};

export interface IMapContext {
  map: Map;
}
