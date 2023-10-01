import React, { useState } from 'react'
import './styles.css'
// import bagBox from '../../Assets/bagBox.png'

function AccordionCard({ props }) {
  const [setActive, setActiveState] = useState('')

  const acceptItem = () => {}
  const declineItem = () => {}

  function toggleAccordion() {
    setActiveState(setActive === '' ? '-active' : '')
  }
  const itemLength = props.items.length
  const item = props.items[0]

  return (
    <div className={`accordion-card accordion-card${setActive}`}>
      <div className='accordion-order-card-header'>
        <p className='accordion-order-card-title'> Order No: {props.orderId} </p>
        <p className='accordion-order-card-counter'> Amount of Items: {itemLength} </p>
      </div>
      <button className='accordion-order-card-button' onClick={toggleAccordion}>
        {!setActive ? 'View' : 'Close'}
      </button>
      <div className='accordion-card-content'>
        <div className='accordion-card-item-card'>
          <div className='accordion-card-photos'>
            {item.photos.map(photo => {
              return <img src={photo} className='accordion-card-item-photo' />
            })}
          </div>
          <div className='accordion-card-item-details'>
            <p> Item Type: {item.type} </p>
            <p> Has pets: {item.pets ? 'Yes' : 'No'} </p>
            <p> Has water damage: {item.waterDamage ? 'Yes' : 'No'} </p>
            <p> From smoker: {item.smoke ? 'Yes' : 'No'} </p>
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
