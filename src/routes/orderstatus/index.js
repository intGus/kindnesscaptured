import React, { useEffect, useState } from 'react'
import { pending as singleOrder } from '../../fakevariables.js'

import './styles.css'
export default function OrderStatus() {
  const [order, setOrder] = useState()
  useEffect(() => {
    function getOrderById() {
      setOrder(singleOrder)
    }
    getOrderById()
    console.log('toApprove entered')
  }, [])
  return (
    <div id='order-status-wrapper' class='route-wrapper'>
      <div className='order-status-container'>
        <h3>Thank you for your donation!</h3>
        <p>Your donation Id number is: {order && order.orderId}</p>
        <p>Your donation status is: {order && order.orderStatus}</p>
        <p className='courtesy'>We will reach out soon!</p>
      </div>
    </div>
  )
}
