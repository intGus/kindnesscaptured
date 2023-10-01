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
import { pending } from './fakevariables'

export const OrderContext = React.createContext()

function App() {
  const [order, setOrder] = useState(pending)
  return (
    <OrderContext.Provider value={order}>
      <Router>
        <div className='App'>
          <div className='App-header'>
            <div className='logo-wrapper'>
              <img src='./logo.png' alt='logo' className='logo' />
            </div>
          </div>
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
