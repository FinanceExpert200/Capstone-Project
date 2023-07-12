// import logo from './assets/logo.svg';
// import logo from "../../assets/logo.svg";
// import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
  BrowserRouter,
} from "react-router-dom";
import axios from "axios";

import LandingPage from "../LandingPage/LandingPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import TransactionTable from "../TransactionTable/TransactionTable";

function App() {

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  // set

  const [currentUserId, setCurrentUserId] = useState(null)
  const [transactionHistory, setTransactionHistory] = useState()


  const addTransaction = async (ticker, quantity, currentPrice, userId, transactionType) =>{
    try {
      const res = await axios.post(`http://localhost:3001/trans/add`, {
        ticker: ticker,
        quantity: quantity,
        curr_price: currentPrice,
        user_id: userId,
        trans_type: transactionType
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getTransactions = async (userID) =>{
    axios
      .get(`http://localhost:3001/trans/${1}`)
      .then((response) => {
        setTransactionHistory(response.data.transactions)
        
      })
      .catch((error) => {
        console.error(error);
      });
    
  }





  const [currentUserId, setCurrentUserId] = useState(null)
  const [transactionHistory, setTransactionHistory] = useState()


  const addTransaction = async (ticker, quantity, currentPrice, userId, transactionType) =>{
    try {
      const res = await axios.post(`http://localhost:3001/trans/add`, {
        ticker: ticker,
        quantity: quantity,
        curr_price: currentPrice,
        user_id: userId,
        trans_type: transactionType
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getTransactions = async (userID) =>{
    axios
      .get(`http://localhost:3001/trans/${1}`)
      .then((response) => {
        setTransactionHistory(response.data.transactions)
        
      })
      .catch((error) => {
        console.error(error);
      });
    
  }





  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Routes>
           <Route path = '/' element = {<LandingPage/>}/>
           <Route path = '/transaction' element = {<TransactionTable transactionHistory = {transactionHistory}  />} />
           <Route path = '/register' element = {<RegisterPage buying_power={buying_power} acc_value={acc_value}/>}/>
          </Routes>

        </main>
      </BrowserRouter>
      
      <button onClick = {getTransactions}>click</button>
      
      <br/>
      


    </div>
  );
}

export default App;
