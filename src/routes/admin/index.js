import React from 'react'
import './styles.css'

export default function Admin() {
  return (
    <div id='admin-wrapper' className='route-wrapper'>
      <div id='login-container'>
        <form id='logging-form'>
          <h4>Welcome Back</h4>
          <input type='text' placeholder='Username' />
          <input type='password' placeholder='Password' />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}
