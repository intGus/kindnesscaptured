import React from 'react'
import './styles.css'
export default function NotFound() {
    function backHome() {
        window.location.href = '/'
    }
  return (
    <div id="not-found">
      <h1>Sorry...</h1>
          <h1>404 Page not found</h1>
          <button onClick={backHome}>Go Back</button>
    </div>
  )
}
