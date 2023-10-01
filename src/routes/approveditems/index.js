import React, { useRef,useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'mapboxKey;'
 
function ApprovedItems() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.14879873582426);
  const [lat, setLat] = useState(26.12272029300984);
  const [zoom, setZoom] = useState(9);
  const [approvedData, setApprovedData] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch approved items from the API
    fetch('https://kindapi.gusweb.workers.dev/api/approvedpickup')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        const parsedData = data.map((item) => ({
          ...item,
          value: JSON.parse(item.value),
        }));
        setApprovedData(parsedData); // Set the approved data in state
      })
      .catch((error) => {
        console.error('Error fetching approved items:', error);
      });
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: zoom
    });

    new mapboxgl.Marker({color: "#FFFFFF"})
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  `<h3>Habitat for Humanity Restore, Broward</h3>`
                )
            )
            .addTo(map.current);

  }, [lat, lng, zoom]);

  useEffect(() => {
    if (map.current && approvedData && approvedData.length > 0) {
      approvedData.forEach((item) => {
        if (
          item.value &&
          item.value[0] &&
          item.value[0].mapboxData &&
          item.value[0].mapboxData[0] &&
          item.value[0].mapboxData[1]
        ) {
          const [longitude, latitude] = item.value[0].mapboxData;
  
          // Create a mapboxgl marker
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  `<h3>${item.value[0].orderId}: ${item.value[0].items[0].type}</h3>
                  <p>${item.value[0].clientInfo.address}</p>
                  <p>${item.value[0].clientInfo.phoneNumber}</p>`
                )
            )
            .addTo(map.current);
        }
      });
    }
  }, [approvedData]);

  return (
    <div>
      <h1>Approved Items for pickup</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item Type</th>
            <th>Condition</th>
            <th>Intake Method</th>
            {/* Add more table headers for additional item properties */}
          </tr>
        </thead>
        <tbody>
          {approvedData.map((item) => (
            <tr key={item.value[0].orderId}>
              <td>{item.value[0].orderId}</td>
              <td>{item.value[0].items[0].type}</td>
              <td>{item.value[0].items[0].condition}</td>
              <td>{item.value[0].intakeMethods}</td>
              {/* Add more table cells for additional item properties */}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default ApprovedItems;