import React, { useState, useEffect } from 'react'
import { pending as singleOrder } from '../../fakevariables.js'
import AccordionCard from '../../components/accordioncard'
import './styles.css'
export default function Admindashboard() {
  const [toApprove, setToApprove] = useState()
  const [approved, setApproved] = useState()

  const ordersArray = [singleOrder, singleOrder, singleOrder, singleOrder]
  useEffect(() => {
    function getPending() {
      setToApprove(ordersArray)
    }
    getPending()
    console.log('toApprove entered')
  }, [])

  function getApproved() {
    setApproved(ordersArray)
    console.log('approved entered')
  }

  return (
    <div id='admin-dashboard-wrapper' class='route-wrapper'>
      <h1> Items to be approved </h1>
      <div class='dashboard-list-container'>
        {toApprove &&
          toApprove.map(item => {
            const itemLength = item.items.length
            return <AccordionCard props={item} />
          })}
      </div>
    </div>
  )
}
