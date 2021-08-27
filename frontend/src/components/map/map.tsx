import React from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { VectorLayer } from "./layers";
import { TMapProps, IMapContext, TMapState } from "./map-types";
import { transform } from "ol/proj";
import { Control, defaults as defaultControls } from 'ol/control';
import "ol/ol.css";
import "./map.css";

//control to center map on marked positions
class CenterControl extends Control {
  constructor() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-map-marker-alt"></i>';

    const element = document.createElement('div');
    element.className = 'recentralize ol-control';
    element.appendChild(button);

    super({
      element: element,
    });

    button.addEventListener('click', this.handleRecentralize.bind(this), false);
  }

  handleRecentralize() {
    //calculates the center between all markers
    var coord1 = 0, coord2 = 0, nElem = 0;
    this.getMap().getLayers().forEach(layer => {
      const itensTree = layer.getProperties().source.featuresRtree_;
      if (itensTree) {
        itensTree.rbush_.data.children.forEach((element: any) => {
          coord1 += element.value.values_.geometry.flatCoordinates[0];
          coord2 += element.value.values_.geometry.flatCoordinates[1];
          nElem++;
        });
      }
    });
    this.getMap().getView().setCenter([coord1 / nElem, coord2 / nElem]);
  }
}

export const MapContext = React.createContext<IMapContext | void>(undefined);

export class MapComponent extends React.PureComponent<TMapProps, TMapState> {
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
      controls: defaultControls().extend([new CenterControl()]),
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
    if (prevProps.height !== this.props.height) {
      this.state.mapContext?.map.updateSize();
    }
  }

  render() {
    return (
      <div className="map" ref={this.mapDivRef} style={{ height: this.props.height }}>
        {this.state.mapContext && (
          <MapContext.Provider value={this.state.mapContext}>
            <VectorLayer positions={this.props.positions} />
          </MapContext.Provider>
        )}
      </div>
    );
  }
}
