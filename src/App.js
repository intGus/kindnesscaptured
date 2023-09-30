import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './routes/landing'
import Admin from './routes/admin'
import Admindashboard from './routes/admindashboard'
import UserDashboard from './routes/userdashboard'
import AddItem from './routes/additem'
import OrderStatus from './routes/orderstatus'
import NotFound from './routes/notfound'
import React, { useState } from 'react'

export const OrderContext = React.createContext()

const pending = [
  {
    orderId: 999,
    orderStatus: 'pending',
    intakeMethods: 'delivery',
    dateRange: {
      earliest: '2021-01-01',
      latest: '2021-01-31',
    },
    deliveryDate: '2021-01-15',
    clientInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      phoneNumber: '',
    },
    items: [
      {
        type: 'sofa',
        itemStatus: 'aproved',
        pickable: true,
        pets: true,
        smoke: false,
        waterDamage: false,
        otherDamage: true,
        denialReason: '',
        photos: ['/ashdba', '/asdasd', '/asdasd'],
      },
      {
        type: 'bed',
        itemStatus: 'aproved',
        pickable: true,
        pets: true,
        smoke: false,
        waterDamage: false,
        otherDamage: true,
        denialReason: '',
        photos: ['/ashdba', '/asdasd', '/asdasd'],
      },
    ],
  },
]
function App() {
  const [order, setOrder] = useState(pending)
  return (
    <OrderContext.Provider value={order}>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/orderstatus' element={<OrderStatus />} />
            <Route path='/additem' element={<AddItem />} />
            <Route path='/userdashboard' element={<UserDashboard />} />
            <Route path='/admindashboard' element={<Admindashboard />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='*' element={<NotFound />} />
            <Route path='/' element={<Landing />} />
          </Routes>
        </div>
      </Router>
    </OrderContext.Provider>
  )
}

export default App
