import React, { useState, useEffect } from 'react';
import AccordionCard from '../../components/accordioncard';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Admindashboard() {
  const [toApprove, setToApprove] = useState([]);

  useEffect(() => {
    // Make a GET request to your API endpoint
    fetch('https://kindapi.gusweb.workers.dev/api/pending')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        // Parse the JSON string within the 'value' property
        const parsedData = data.map((item) => ({
          ...item,
          value: JSON.parse(item.value),
        }));
        setToApprove(parsedData); // Update the toApprove state with the parsed data
        console.log(parsedData)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div id='admin-dashboard-wrapper' className='route-wrapper'>
      <Link to="/approveditems">Go to Approved Items for Pickup</Link>
      <h1>Items to be approved</h1>
      <div className='dashboard-list-container'>
        {toApprove.map((item) => (
          <AccordionCard key={item.value[0].orderId} props={item.value[0]} />
        ))}
      </div>
    </div>
  );
}