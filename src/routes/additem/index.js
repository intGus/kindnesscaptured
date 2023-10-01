import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderContext } from '../../App'

import upload from './upload.png'
import './styles.css'

export default function AddItem() {
  const order = React.useContext(OrderContext)
  const navigate = useNavigate()
  const [selectedImageFront, setSelectedImageFront] = useState(null)
  const [locationURL, setLocationURL] = useState(null)
  const fileInputRefFront = useRef(null)
  const [azurePrediction, setAzurePrediction] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pickup: false,
    earliestDate: '',
    latestDate: '',
    phoneNumber: '',
    type: '',
    address: '',
    pets: false,
    smoke: false,
    waterDamage: false,
    otherDamage: false,
  })

  const handleFileInputClick = ref => {
    ref.current.click()
  }

  const handleFileInputChange = (e, setImageFunction) => {
    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = event => {
        setImageFunction(event.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const uploadImage = async () => {
      if (selectedImageFront) {
        try {
          // Convert the base64 data URL to binary data
          const binaryData = atob(selectedImageFront.split(',')[1])

          // Create a Uint8Array from the binary data
          const uint8Array = new Uint8Array(binaryData.length)
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i)
          }

          // Create a Blob from the Uint8Array
          const blob = new Blob([uint8Array], { type: 'image/jpeg' })

          // Send the data to your AWS Lambda API using PUT method
          const response = await fetch('https://6w0m2blvwb.execute-api.us-east-1.amazonaws.com/prod/images', {
            method: 'PUT',
            body: blob,
          })

          if (response.ok) {
            const responseData = await response.json()
            const key = responseData.key
            setLocationURL(responseData.Location)

            // Make a second API call using the key as the request body
            // Azure Custom Vision API URL
            const apiUrl = 'https://kc-predict.cognitiveservices.azure.com/customvision/v3.0/Prediction/b959432b-90f0-4495-a452-cdb2e0848175/classify/iterations/KC_v1/url'

            // Azure Custom Vision API Key
            const apiKey = 'key'

            // Data to send to the Azure Custom Vision API
            const requestData = {
              Url: responseData.Location,
            }

            console.log('responseData', responseData)

            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'Prediction-Key': 'f4e110d47c724542a55c839528f5ac6b',
              },
              body: JSON.stringify(requestData),
            })
              .then(azureResponse => {
                console.log('Azure Response Status:', azureResponse.status)
                if (!azureResponse.ok) {
                  throw new Error(`HTTP error! status: ${azureResponse.status}`)
                }
                return azureResponse.json()
              })
              .then(azureData => {
                if (azureData.predictions && azureData.predictions.length > 0) {
                  const firstPrediction = azureData.predictions[0]
                  const { probability, tagName } = firstPrediction
                  setAzurePrediction({ probability, tagName })
                }
              })
              .catch(error => {
                console.error('Azure Error:', error)
              })
          } else {
            console.error('Image upload failed')
          }
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
    }

    uploadImage()
  }, [selectedImageFront])

  // useEffect(() => {
  //   console.log('formData', formData)
  // }, [formData])
  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    // Access form data in the formData object
    console.log('Form data submitted:', createOrderData())
    const state = createOrderData()
    navigate('/orderstatus', { state })
    // Make API calls
    fetch ('https://kindapi.gusweb.workers.dev/api/additem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })
      .then(response => {
        console.log('Response Status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response
      })
      .then(data => {
        console.log('Success:', data)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const createOrderData = () => {
    const orderData = [
      {
        orderId: Math.floor(100000 + Math.random() * 900000),
        orderStatus: 'pending',
        intakeMethods: formData.pickup ? 'pickup' : 'dropoff',
        dateRange: {
          earliest: formData.earliestDate,
          latest: formData.latestDate,
        },
        deliveryDate: '2021-01-15',
        clientInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        items: [
          {
            type: formData.type,
            itemStatus: 'pending',
            pickable: true,
            pets: formData.pets,
            smoke: formData.smoke,
            waterDamage: formData.waterDamage,
            otherDamage: formData.otherDamage,
            denialReason: '',
            photos: [locationURL],
            condition: [azurePrediction?.probability, azurePrediction?.tagName],
          },
        ],
      },
    ]

    return orderData
  }

  return (
    <div id='addItem-list-wrapper' className=' route-wrapper'>
      <div className='addItem-list-container'>
        <div className='image-upload-wrapper'>
          <div className='image-upload-container' type='file' accept='image/*' onClick={() => handleFileInputClick(fileInputRefFront)}>
            {selectedImageFront && <img src={selectedImageFront} alt='Uploaded Image' className='uploaded-image' />}
          </div>
          <input type='file' ref={fileInputRefFront} style={{ display: 'none' }} onChange={e => handleFileInputChange(e, setSelectedImageFront)} />
          {azurePrediction ? (
            <div className='image-prediction-label'> {`${(azurePrediction?.probability * 100).toFixed(2)}% ${azurePrediction?.tagName}`} </div>
          ) : (
            <div className='image-label-container'>
              <img src={upload} alt='upload icon' id='upload-icon' />
              <p className='image-label'>Please upload a</p>
              <p className='image-label'>Front Facing Image</p>
            </div>
          )}
        </div>

        <form className='form-container' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='firstName'>First Name</label>
            <input className='add-item-input' type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='lastName'>Last Name</label>
            <input className='add-item-input' type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />
          </div>
          <div className='checkbox-group'>
            <label>Pick up?</label>
            <input className='add-item-checkbox' type='checkbox' name='pickup' checked={formData.pickup} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input className='add-item-input' type='email' id='email' name='email' value={formData.email} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='earliestDate'>Earliest Date</label>
            <input className='add-item-input' type='date' id='earliestDate' name='earliestDate' value={formData.earliestDate} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='latestDate'>Latest Date</label>
            <input className='add-item-input' type='date' id='latestDate' name='latestDate' value={formData.latestDate} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='phoneNumber'>Phone Number</label>
            <input className='add-item-input' type='tel' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='type'>Type</label>
            <input className='add-item-input' type='text' id='type' name='type' value={formData.type} onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='address'>Address</label>
            <textarea className='add-item-input' id='address' name='address' value={formData.address} onChange={handleChange} />
          </div>
          <div className='checkbox-group'>
            <label>Pets</label>
            <input className='add-item-checkbox' type='checkbox' name='pets' checked={formData.pets} onChange={handleChange} />
          </div>
          <div className='checkbox-group'>
            <label>Smoke</label>
            <input className='add-item-checkbox' type='checkbox' name='smoke' checked={formData.smoke} onChange={handleChange} />
          </div>
          <div className='checkbox-group'>
            <label>Water Damage</label>
            <input className='add-item-checkbox' type='checkbox' name='waterDamage' checked={formData.waterDamage} onChange={handleChange} />
          </div>
          <div className='checkbox-group'>
            <label>Other Damage</label>
            <input className='add-item-checkbox' type='checkbox' name='otherDamage' checked={formData.otherDamage} onChange={handleChange} />
          </div>
          <button className='general-button submit' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
