import React from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { VectorLayer } from "./layers";
import { TMapProps, IMapContext, TMapState } from "./map-types";
import Point from "ol/geom/Point";
import { transform } from "ol/proj";
import "ol/ol.css";
import "./map.css";

import { Location } from "../../types/interfaces";

export const MapContext = React.createContext<IMapContext | void>(undefined);

export class MapComponent extends React.PureComponent<TMapProps, TMapState > {
  private mapDivRef: React.RefObject<HTMLDivElement>;
  state: TMapState = {};

  constructor(props: TMapProps) {
    super(props);
    this.mapDivRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (!this.mapDivRef.current) {
      return;
    }

    const map = new Map({
      target: this.mapDivRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: transform([this.props.center?.longitude || 0, this.props.center?.latitude || 0], 'EPSG:4326', 'EPSG:3857'),
        zoom: this.props.zoom || 3,
      }),
    });

    const mapContext: IMapContext = { map };
    this.setState({
      mapContext: mapContext,
    });
  }

  componentDidUpdate(prevProps: TMapProps) {
    if (prevProps.center !== this.props.center) {
      this.state.mapContext?.map.getView().setCenter(transform([this.props.center?.longitude || 0, this.props.center?.latitude || 0], 'EPSG:4326', 'EPSG:3857'));
    }
    if (prevProps.zoom !== this.props.zoom) {
      this.state.mapContext?.map.getView().setZoom(this.props.zoom || 3);
    }
  }

  render() {
    return (
      <div className="map" ref={this.mapDivRef}>
        {this.state.mapContext && (
          <MapContext.Provider value={this.state.mapContext}>
            <VectorLayer positions={this.props.positions}/>
          </MapContext.Provider>
        )}
      </div>
    );
  }
}
