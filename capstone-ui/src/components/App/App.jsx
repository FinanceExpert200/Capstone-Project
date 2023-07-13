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
  json,
} from "react-router-dom";
import axios from "axios";

import LandingPage from "../LandingPage/LandingPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import TransactionTable from "../TransactionTable/TransactionTable";
import Trade from "../Trade/Trade";
import NavBar from "../NavBar/NavBar";
import SignInPage from "../SignInPage/SignInPage";
import Home from "../Home/Home";

import { useEffect } from "react";

function App() {
  // State Variables that have the current price of the stock

  // const [metaPrice, setMetaPrice] = useState(0);
  // const [amznPrice, setAmznPrice] = useState(0);
  // const [nflxPrice, setNflxPrice] = useState(0);
  // const [googlPrice, setGooglPrice] = useState(0);
  // const [crmPrice, setCrmPrice] = useState(0);

  // const[currentAccountValue, setCurrentAccountValue] = useState(0)

  


  const getStockPrice = async (ticker) => {
    axios
      .get(`http://localhost:3001/trans/stock/${ticker}`)
      .then((response) => {
        
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getStockPrice("META")


  







  // login functiionaility
  const [isLogged, setIsLogged] = useState(false);
  // this contains the id of the currently logged in user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [usertoken, setUserToken] = useState(null);

  // const [id, setId] = useState(null);

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  // set

  const [transactionHistory, setTransactionHistory] = useState();

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");
    const token = localStorage.getItem("token");
    //console.log("Here is my token from local Storge: " , token);
    if (currentUserId) {
      setCurrentUserId(currentUserId);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [isLogged]);

  const addTransaction = async (
    ticker,
    quantity,
    currentPrice,
    userId,
    transactionType
  ) => {
    try {
      const res = await axios.post(`http://localhost:3001/trans/add`, {
        ticker: ticker,
        quantity: quantity,
        curr_price: currentPrice,
        user_id: userId,
        trans_type: transactionType,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTransactions = async (userID) => {
    axios
      .get(`http://localhost:3001/trans/${1}`)
      .then((response) => {
        setTransactionHistory(response.data.transactions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <NavBar isLogged={isLogged} setIsLogged={setIsLogged} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route
              path="/transaction"
              element={
                <TransactionTable transactionHistory={transactionHistory} />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  buying_power={buying_power}
                  acc_value={acc_value}
                />
              }
            />
            <Route
              path="/login"
              element={<SignInPage setIsLogged={setIsLogged} />}
            />
          </Routes>
        </main>
      </BrowserRouter>

      <br />
    </div>
  );
}

export default App;
