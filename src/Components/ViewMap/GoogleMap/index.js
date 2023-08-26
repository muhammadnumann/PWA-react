import React from "react";
import GoogleMapReact from "google-map-react";
import supercluster from "points-cluster";
import Marker from "../Marker";
import ClusterMarker from "../ClusterMarker";
import mapStyles from "./mapStyles.json";
import { susolvkaCoords } from "../fakeData";
import MapWrapper from "./MapWrapper";

const MAP = {
  defaultZoom: 12,
  defaultCenter: susolvkaCoords,
  options: {
    styles: mapStyles,
    maxZoom: 19,
    fullscreenControl: false,
    zoomControl: false,
  },
};

export class GoogleMap extends React.PureComponent {
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    clusters: [],
  };

  getClusters = () => {
    const clusters = supercluster(this.props.markersData, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });

    return clusters(this.state.mapOptions);
  };

  createClusters = (props) => {
    this.setState({
      clusters: this.state.mapOptions.bounds
        ? this.getClusters(props).map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            numPoints,
            id: `${points[0].id}`,
            points,
            // data: points,
          }))
        : [],
    });
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createClusters(this.props);
      }
    );
  };
  handleMarkerClick() {
    MAP.defaultZoom = 19;
  }
  // componentDidUpdate() {
  //   console.log(this.state.clusters);
  // }

  render() {
    return (
      <MapWrapper>
        <GoogleMapReact
          defaultZoom={MAP.defaultZoom}
          defaultCenter={MAP.defaultCenter}
          options={MAP.options}
          onChange={this.handleMapChange}
          onGoogleApiLoaded={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
        >
          {this.state.clusters.map((item) => {
            if (item.numPoints === 1) {
              return (
                <Marker
                  key={item.id}
                  lat={item.points[0].lat}
                  lng={item.points[0].lng}
                  pId={item.id}
                  category={item.points[0].category}
                  onClick={this.handleMarkerClick}
                />
              );
            }

            return (
              <ClusterMarker
                key={item.id}
                lat={item.lat}
                lng={item.lng}
                points={item.points}
                category={item.points[0].category}
              />
            );
          })}
        </GoogleMapReact>
      </MapWrapper>
    );
  }
}

export default GoogleMap;
