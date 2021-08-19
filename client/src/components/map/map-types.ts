import Map from "ol/Map";

import { Location } from "../../types/interfaces";

export type TMapProps = {
  positions?: Location[]
};

export type TMapState = {
  mapContext?: IMapContext;
};

export interface IMapContext {
  map: Map;
}
