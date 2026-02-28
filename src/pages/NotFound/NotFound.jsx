import React from 'react'
import './NotFound.css'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='notfound'>
      <div className='notfound-content'>
        <h1 className='notfound-code'>404</h1>
        <h2>Lost Your Way?</h2>
        <p>Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
        <div className='notfound-btns'>
          <button className='btn-home' onClick={() => navigate('/')}>
            Netflix Home
          </button>
          <button className='btn-back' onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound