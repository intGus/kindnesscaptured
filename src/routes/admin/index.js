import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase.js'
import './styles.css'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  function login(e) {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log(userCredentials)
        navigate('/admindashboard')
      })
      .catch(error => {
        alert('ERROR NOT AN AUTHORIZED USER')
      })
  }

  return (
    <div id='admin-wrapper' className='route-wrapper'>
      <div id='login-container'>
        <form id='logging-form' onSubmit={login}>
          <h4>Welcome Back</h4>
          <input type='email' value={email} placeholder='Enter your email' onChange={e => setEmail(e.target.value)} />
          <input type='password' value={password} placeholder='Enter your password' onChange={e => setPassword(e.target.value)} />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}
