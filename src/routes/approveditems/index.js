import React, { useRef,useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
 
function ApprovedItems() {
  const navigate = useNavigate()
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.14879873582426);
  const [lat, setLat] = useState(26.12272029300984);
  const [zoom, setZoom] = useState(9);
  const [approvedData, setApprovedData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

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

  const handleCheckboxChange = (orderId, isChecked) => {
    if (isChecked) {
      setCheckedItems([...checkedItems, orderId]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== orderId));
    }
  };

  const generateRoute = () => {
    // Iterate through approvedData and update mapboxData for checked items
    const newMapboxDataArray = [];
    approvedData.map((item) => {
      if (checkedItems.includes(item.value[0].orderId)) {
        newMapboxDataArray.push(item.value[0].mapboxData)
      }
    });

    navigate('/route', { state: { mapboxData: newMapboxDataArray } });
  };

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
            <th>Add to Route</th>
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
              <td>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.value[0].orderId)}
                  onChange={(e) => handleCheckboxChange(item.value[0].orderId, e.target.checked)}
                />
              </td>
              {/* Add more table cells for additional item properties */}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={generateRoute}>Generate Route</button>
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default ApprovedItems;