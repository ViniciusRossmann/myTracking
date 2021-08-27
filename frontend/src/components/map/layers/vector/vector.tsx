import React from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { transform } from "ol/proj";
import { MapContext } from "../../map";
import { IMapContext } from "../../map-types";
import { TVectorLayerProps, TVectorLayerComponentProps } from "./vector-types";
import { Location } from "../../../../types/interfaces";

class VectorLayerComponent extends React.PureComponent<TVectorLayerComponentProps> {
  layer: any;
  source: any;

  componentDidMount() {
    this.source = new VectorSource({
      features: undefined,
    });

    this.layer = new VectorLayer({
      source: this.source,
    });

    this.props.map.addLayer(this.layer);
    this.placeMarkers(this.props.positions);
  }

  placeMarkers(positions: Location[] | undefined) {
    this.source.clear();
    if (positions === undefined) return;
    positions.forEach((position: Location) => {
      const featureToAdd = new Feature({
        geometry: new Point(transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857')),
      });
      const style = new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({
            color: [0, 0, 0], width: 2
          })
        })
      });
      featureToAdd.setStyle(style);
      this.source.addFeatures([featureToAdd]);
    });
  }

  componentWillUnmount() {
    this.props.map.removeLayer(this.layer);
  }

  componentDidUpdate(prevProps: TVectorLayerComponentProps) {
    if (prevProps.positions !== this.props.positions) {
      this.placeMarkers(this.props.positions);
    }
  }

  render() {
    return null;
  }
}

export const VectorLayerWithContext = (props: TVectorLayerProps) => {
  return (
    <MapContext.Consumer>
      {(mapContext: IMapContext | void) => {
        if (mapContext) {
          return <VectorLayerComponent {...props} map={mapContext.map} />;
        }
      }}
    </MapContext.Consumer>
  );
};
