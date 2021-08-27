import Map from "ol/Map";
import { Location } from "../../../../types/interfaces";

export type TVectorLayerProps = {
  positions?: Location[];
};

export type TVectorLayerComponentProps = TVectorLayerProps & {
  map: Map;
  positions?: Location[];
};