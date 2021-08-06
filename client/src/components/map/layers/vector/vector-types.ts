import Map from "ol/Map";
import Feature from "ol/Feature";
import Position from "../../../../interfaces/Position";

export type TVectorLayerProps = {
  positions?: Position[];
};

export type TVectorLayerComponentProps = TVectorLayerProps & {
  map: Map;
  positions?: Position[];
};