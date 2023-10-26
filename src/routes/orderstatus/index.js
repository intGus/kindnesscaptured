import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import './styles.css'
export default function OrderStatus() {
  const [order, setOrder] = useState()
  const { state } = useLocation()
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    function getOrderById() {
      if (state) {
        setOrder(state[0])
      } else if (searchParams.get('orderId')) {
        fetch(`https://kindapi.gusweb.workers.dev/api/list/${searchParams.get('orderId')}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          const parsedData = JSON.parse(data)
          setOrder(parsedData[0])
        })
        .catch((error) => {
          console.error('Error fetching approved items:', error);
          setOrder({ orderId: 'Null', orderStatus: 'Null' })
        });
      } else {
        setOrder({ orderId: 'Null', orderStatus: 'Null' })
      }
      
    }
    getOrderById()
    console.log(state)
  }, [])

  useEffect(() => {
    // console.log('location', state[0])
  }, [state])
  return (
    <div id='order-status-wrapper' className='route-wrapper'>
      <div className='order-status-container'>
        <h3>Thank you for your donation!</h3>
        <p>Your donation Id number is: {order && order.orderId}</p>
        <p>Your donation status is: {order && order.orderStatus}</p>
        <p className='courtesy'>We will reach out soon!</p>
      </div>
    </div>
  )
}
