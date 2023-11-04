import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { config } from "./config";

function App() {

  let BACKEND_URL = window.location.hostname;
  if (BACKEND_URL === "localhost") {
    BACKEND_URL = 'http://localhost:8080/';
  } else {
    BACKEND_URL = 'https://farmerapp-backend.onrender.com/';
  }

  console.log(BACKEND_URL);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    crops: []
  });

  const [farmerList, setFarmerList] = useState([]);

  const [image, setImage] = useState();

  const [cropList, setCropList] = useState([
    {
      id: uuidv4(),
      cropName: '',
      cropArea: '',
      sprayProduct: ''
    }
  ]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}getFarmerData`, config)
      .then(res => {
        setFarmerList(res.data)
        console.log(res.data)
      });
  }, [BACKEND_URL]);

  const addCrop = (e) => {
    e.preventDefault();
    setCropList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        cropName: '',
        cropArea: '',
        sprayProduct: ''
      }
    ])
  }

  const onCropChange = (e, id) => {
    const { name, value } = e.target;
    const newData = cropList.map((item) => {
      return item.id === id ? {
        ...item,
        [name]: value
      } : item
    })
    setCropList(newData);
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name !== 'image') {
      if (name === 'contactNumber') {
        console.log(e.target.value);
        if (e.target.value.length > 10) {
          return;
        }
      }
      setFormData({ ...formData, [name]: value });
    }

    else
      setImage(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    // e.preventDefault();

    const consolidatedData = {
      ...formData,
      crops: [...cropList]
    }

    const newForm = new FormData();
    newForm.append('farmerData', JSON.stringify(consolidatedData));
    newForm.append('image', image);

    axios.post(`${BACKEND_URL}formData`, newForm, config)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  const removeItem = (e, id) => {
    e.preventDefault();

    if (cropList.length < 2)
      return;

    const newList = cropList.filter(item => item.id !== id);
    console.log(newList);
    setCropList(newList);
  }

  return (
    <div className="App">
      <form>
        <h1 className='formHeading'>Farmer Details Form</h1>
        <label htmlFor="farmerName">
          Farmer Name
        </label>

        <input name='name'
          id='farmerName'
          onChange={onChangeHandler}
          value={formData.name}
        />

        <label htmlFor="contactNumber">
          Contact Number
        </label>

        <input name='contactNumber'
          type='number'
          id='contact'
          onChange={onChangeHandler}
          value={formData.contactNumber}
        />

        <h4>Farmer Detail Form</h4>
        <button onClick={addCrop}>Add Crop</button>

        <div className="cropListContainer">

          {
            cropList.map((item, index) => {
              return <React.Fragment key={index}>
                <div key={index} className="cropListItem">
                  <label htmlFor="cropName">Crop Name</label>
                  <input type='text' id='cropName' name='cropName' value={item.cropName} onChange={(e) => onCropChange(e, item.id)} />

                  <label htmlFor="cropArea">Crop Area</label>
                  <input type='text' id='cropArea' name='cropArea' value={item.cropArea} onChange={(e) => onCropChange(e, item.id)} />

                  <label htmlFor="sprayProduct">Spray Product</label>
                  <input type='text' id='sprayProduct' name='sprayProduct' value={item.sprayProduct} onChange={(e) => onCropChange(e, item.id)} />
                </div>
                <button onClick={(e) => removeItem(e, item.id)}>-</button>
              </React.Fragment>
            })
          }
        </div>

        <div>
          <p style={{
            margin: '0',
            paddingBottom: '12px',
          }}>
            Images
          </p>
          <label htmlFor="image" className="imageButton">+</label>
          <input type='file' className='inputFile' accept='image/*' name='image' id='image' alt='inputImage' onChange={onChangeHandler} />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </form>

      <div className="farmerListContainer">
        {
          farmerList.map((item, index) => {
            return <div className="infoCard" key={index}>
              <img src={item.imageUrl === '' ? `${BACKEND_URL}solid-color-image.jpeg` : item.imageUrl} alt='farmerImage' />
              <div className="infoCardDetails">
                <label htmlFor={`infoName${index}`}>Farmer Name: </label>
                <input value={item.name} id={`infoName${index}`} readOnly />
                <label htmlFor={`infoContact${index}`}>Contact: </label>
                <input value={item.contactNumber} id={`infoContact${index}`} readOnly />
              </div>
              <h4 style={{ margin: '5px', textAlign: 'center', textDecoration: 'underline' }}>CROP DETAILS</h4>
              <table>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Area</td>
                    <td>Product</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    item.crops.map((crop, index) => {
                      return <tr key={index}>
                        <td>{crop.cropName}</td>
                        <td>{crop.cropArea}</td>
                        <td>{crop.sprayProduct}</td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          })
        }
      </div>
    </div>
  );
}

export default App;
