import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles.css'
import { OrderContext } from '../../App'
const fallbackImage = './fallback.png'

export default function Landing() {
  const order = React.useContext(OrderContext)
  const itemList = order[0].items
  const navigate = useNavigate()
  const submitOrder = () => { 
    alert('submit order')
    navigate('/orderstatus')
  }

  return (
    <div id='dashboard-wrapper' class='route-wrapper'>
      <h1> Please add your item </h1>

      <div class='dashboard-list-container'>
        {itemList.map(item => {
          return (
            <div className='dashboard-item-card'>
              <div className='dashboard-item-card-image'>
                {/* <img src={item.photos[0]} onerror={fallbackImage} alt={`image of a ${item.type}`} /> */}
              </div>
              <div className='dashboard-item-card-body'>
                <p> {item.type} </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className='dashboard-action-menu'>
        <button className='general-button button-add' onClick={()=> navigate('/additem')}>+</button>
        <button className='general-button submit' onClick={submitOrder}> Submit </button>
      </div>
    </div>
  )
}
