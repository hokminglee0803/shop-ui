import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {


  const defaultState = {
    tax: "123",
    subtotal:0.0,
    total:0.0,
    productName : "",
    price: 0.0,
    quantity: 0,
    productNameList:[],
    quantityList:[],
    priceList:[],
    location: "CA",
    isInit: true,
    isPurchase: false,
  };

  const [state, setState] = useState({ ...defaultState });

  useEffect(() => {
    if(isInit)
      setState({ ...state, isInit:false });
  });

  const {
    tax,
    subtotal,
    total,
    price,
    productName,
    quantity,
    productNameList,
    quantityList,
    priceList,
    location,
    isInit,
    isPurchase
  } = state;

  function purchase(){
    let initConfig = {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache,no-store,must-revalidate,max-age=-1,private",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Expires: "-1"
      }
    };
    const instance = axios.create(initConfig);
  
    let path = "http://localhost:8080/v1/purchase";

    let itemList = [];
    for(var i = 0 ; i< productNameList.length; i++){
        let item = {
          productName : productNameList[i].productName,
          price : priceList[i].price,
          quantity : quantityList[i].quantity
        }
        itemList.push(item);
    }
    let payload = {
      itemList : itemList,
      location : state.location
    }
  
    instance.post(path,payload).then(
      response => {
        setState({
          subtotal: response.data.subtotal,
          tax : response.data.tax,
          total : response.data.total,
          isPurchase: true
        })
      },
      error => console.log(error)
    )
  };

  function add(productName,price,quantity){
    productNameList.push(productName);
    priceList.push(price);
    quantityList.push(quantity);
    
    setState({
      ...state,
      productName : "",
      price: "",
      quantity : ""
    })
  }

  function handleChange(e){
    setState({
      ...state,
      [e.target.name] : e.target.value
    })
  }

    return (
      <div className="App">       
        <div className="App-header">
          <p>
            Product:   
            <br/>
            <input name="productName" onChange={handleChange} value={productName}/>
          </p>
          <p>
            Price:
            <br/>
            <input name="price" onChange={handleChange} value={price}/>
          </p>
          <p>
            Quantity
            <br/>
            <input name="quantity" onChange={handleChange} value={quantity}/>
          </p>
          <p>
            <select name="location" onChange={handleChange}>
              <option value="CA">California</option>
              <option value="NY">New York</option>
            </select>
            <br/>
          </p>
          <button onClick={() => add({productName},{price},{quantity})}>Add</button>
          <br/>
          <button onClick={() => purchase()}>Purchase</button>
          <p>
            {isPurchase?
              (
                <div>
                  Receipt:
                  <p>
                    Tax: {tax}
                  </p>
                  <p>
                    subtotal: { subtotal}
                  </p>
                  <p>
                    total : {total}
                  </p>
                </div>
              ):
              ""
            }
          </p>
        </div>
      </div>
    )
}

export default App;
