import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';
import * as turf from '@turf/turf';
import { useLocation } from 'react-router-dom'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const RouteMap = () => {
  const location = useLocation();
  const coordinates = location.state && location.state.mapboxData
  const warehouse = [-80.148815, 26.122425];

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    //intialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: warehouse, // starting position
      zoom: 12,
    });

    addMarker();
    plotroute();
  }, []);

  const plotroute = async () => {
    const query = await fetchRoute();
    const response = await query.json();

    const nothing = turf.featureCollection([]);
    const warehouseLoc = turf.featureCollection([turf.point(warehouse)]);

    const routeGeoJSON = turf.featureCollection([
      turf.feature(response.trips[0].geometry),
    ]);

    console.log(`hours: ${response.trips[0].duration/3600}`)
    console.log(`miles: ${response.trips[0].distance/1609}`)

    map.current.addLayer({
      id: 'warehouse',
      type: 'circle',
      source: {
      data: warehouseLoc,
      type: 'geojson'
      },
      paint: {
      'circle-radius': 20,
      'circle-color': 'white',
      'circle-stroke-color': '#3887be',
      'circle-stroke-width': 3
      }
    });

    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(routeGeoJSON);
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });
    }

    map.current.addLayer(
      {
        id: 'routeline-active',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12],
        },
      },
      'waterway-label'
    );

    map.current.addLayer(
        {
          id: 'routearrows',
          type: 'symbol',
          source: 'route',
          layout: {
            'symbol-placement': 'line',
            'text-field': '▶',
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              24,
              22,
              60
            ],
            'symbol-spacing': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              30,
              22,
              160
            ],
            'text-keep-upright': false
          },
          paint: {
            'text-color': '#3887be',
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3
          }
        },
        'waterway-label'
      );
  };

  const addMarker = () => {
    if (map.current && coordinates && coordinates.length > 0) {
      new mapboxgl.Marker({color: "#FFFFFF"})
            .setLngLat(warehouse)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  `<h3>Habitat for Humanity Restore, Broward</h3>`
                )
            )
            .addTo(map.current);

      coordinates.forEach((location) => {
        // Create a mapboxgl marker
        new mapboxgl.Marker()
          .setLngLat(location)
          // .setPopup(
          //   new mapboxgl.Popup({ offset: 25 }) // add popups
          //     .setHTML(
          //       `<h3>${item.value[0].orderId}: ${item.value[0].items[0].type}</h3>
          //       <p>${item.value[0].clientInfo.address}</p>
          //       <p>${item.value[0].clientInfo.phoneNumber}</p>`
              // )
          // )
          .addTo(map.current);
      }
    )};
  };

  const fetchRoute = async () => {
    return await fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${warehouse};${coordinates.join(
        ';'
      )}?overview=full&steps=true&geometries=geojson&source=first&access_token=${
        mapboxgl.accessToken
      }`,
      { method: 'GET' }
    );
  };

  return (
    <div ref={mapContainer} style={{ height: '500px' }} />
  );
};

export default RouteMap;