import React, { useState } from 'react'
import './styles.css'
// import bagBox from '../../Assets/bagBox.png'

function AccordionCard({ props }) {
  const [setActive, setActiveState] = useState('')
  const [isApproved, setIsApproved] = useState(false);

  const acceptItem = () => {
    // Make a POST request to the API to accept the item
    fetch(`https://kindapi.gusweb.workers.dev/api/approve/${props.intakeMethods}:${props.orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response; // Parse the JSON response if needed
      })
      .then((data) => {
        // Handle the response data if needed
        console.log('Item accepted:', data);
        setIsApproved(true);
        // onItemApproved(props.orderId);
        // You can update the UI or perform other actions here
      })
      .catch((error) => {
        console.error('Error accepting item:', error);
        // Handle the error here, e.g., display an error message to the user
      });
  };
  const declineItem = () => {}

  function toggleAccordion() {
    setActiveState(setActive === '' ? '-active' : '')
  }
  const item = props.items[0]

  if (isApproved) {
    return null; // hide the component
  }

  return (
    <div className={`accordion-card accordion-card${setActive}`}>
      <div className='accordion-order-card-header'>
        <p className='accordion-order-card-title'> Order No: {props.orderId} </p>
        <p className='accordion-order-card-counter'> Condition: {props.items[0].condition} </p>
      </div>
      <button className='accordion-order-card-button' onClick={toggleAccordion}>
        {!setActive ? 'View' : 'Close'}
      </button>
      <div className='accordion-card-content'>
        <div className='accordion-card-item-card'>
          <div className='accordion-card-photos'>
            <img src={props.items[0].photos} className='accordion-card-item-photo' />
          </div>
          <div className='accordion-card-item-details'>
            <p className='accordion-order-card-first-name'>First Name: {props.clientInfo.firstName}</p>
            <p className='accordion-order-card-last-name'>Last Name: {props.clientInfo.lastName}</p>
            <p className='accordion-order-card-intake-method'>Intake Method: {props.intakeMethods}</p>
            <p> Item Type: {props.items[0].type} </p>
            <p> Has pets: {props.items[0].pets ? 'Yes' : 'No'} </p>
            <p> Has water damage: {props.items[0].waterDamage ? 'Yes' : 'No'} </p>
            <p> From smoker: {props.items[0].smoke ? 'Yes' : 'No'} </p>
          </div>
        </div>
        <button className='accept-item item-button' onClick={acceptItem}></button>
        <button className='denny-item item-button' onClick={declineItem}>
          X
        </button>
      </div>
    </div>
  )
}

export default AccordionCard
