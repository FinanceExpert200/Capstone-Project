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
import { Params } from "react-router-dom";

import LandingPage from "../LandingPage/LandingPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import TransactionTable from "../TransactionTable/TransactionTable";
import Trade from "../Trade/Trade";
import Navbar from "../NavBar/NavBar";
import SignInPage from "../SignInPage/SignInPage";
import Home from "../Home/Home";

import Trading from "../../TradingCalculations/Trade.js"

import StockCard from "../StockCard/StockCard";

import { useEffect } from "react";



function App() {
  //State of the users Profile
  const [profile,setProfile] = useState(null);
  const [account,setAccount] = useState(null);
  const [portfolio, setPortfolio] = useState(null)
  // State Variables that have the current price of the stock

  const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];

  const [metaPrice, setMetaPrice] = useState(0);
  const [amznPrice, setAmznPrice] = useState(0);
  const [nflxPrice, setNflxPrice] = useState(0);
  const [googlPrice, setGooglPrice] = useState(0);
  const [crmPrice, setCrmPrice] = useState(0);

  // login functiionaility
  const [isLogged, setIsLogged] = useState(false);
  // this contains the id of the currently logged in user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [usertoken, setUserToken] = useState(null);

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  const [transactionHistory, setTransactionHistory] = useState();


  useEffect(() => {
    
    const userId = localStorage.getItem("currentUserId");
    const token = localStorage.getItem("token");
    if (userId ) {
      setCurrentUserId(userId);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
    console.log(isLogged);



  }, [isLogged]);

  Trading.calculateDisplayedProfit("META")

  const getProfile = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/auth/profile/${localStorage.getItem("currentUserId")}`);
      setProfile(res.data.user);
    } catch(error){
      console.log(error)
    } 
  }
//testing get result
console.log(profile)

  const getAccount = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/trans/account/${localStorage.getItem("currentUserId")}`);
      setAccount(res.data.account);
    } catch(error){
      console.log(error)
    } 
  }
//testing get result
console.log(account);

//gets the list of all stocks used by the user
  const getPortfolio = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/trans/account/${localStorage.getItem("currentUserId")}`);
      setPortfolio(res.data.account);
    } catch(error){
      console.log(error)
    } 
  }
//testing get result
console.log(portfolio);

  const stockData = {
    "1": {
      stockName: "META",
      stockPrice: metaPrice,
    },
    "2": {
      stockName: "AMZN",
      stockPrice: amznPrice,
    },
     "3" : {
      stockName: "NFLX",
      stockPrice: nflxPrice,
    },
     "4" : {
      stockName: "GOOGL",
      stockPrice: googlPrice,
    },
      "5" : {
      stockName: "CRM",
      stockPrice: crmPrice,
    },
  };

// --------------------------------------------------------------------------------------------------------------
  // this function gets the current price of the stocks

  const getStockPrice = async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/trans/stock/${ticker}`
      );

      const price = response.data.data.c; // this is the current price of the stock
      // const currPrice = price.c
      switch (ticker) {
        case "META":
          setMetaPrice(price);
          break;
        case "AMZN":
          setAmznPrice(price);
          break;
        case "NFLX":
          setNflxPrice(price);
          break;
        case "GOOGL":
          setGooglPrice(price);
          break;
        case "CRM":
          setCrmPrice(price);
          break;
        default:
          break;
      }
      // console.log(price);
    } catch (error) {
      console.error(error);
    }
  };

  
  // Trading.calculateMovingAverage('AAPL', "2022-02-01");

  



  // console.log("Here is the meta price: ", metaPrice);

  const updateStockPrice = async (tickers) => {
    console.log(tickers);
    tickers.forEach(async (ticker) => {
      await getStockPrice(ticker);
    });
  };
  // --------------------------------------------------------------------------------------------------------------




  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");
    const token = localStorage.getItem("token");
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


  useEffect(() => {

  

  const getTransactions = async (userID) => {
    axios
      .get(`http://localhost:3001/trans/history/${userID}`)
      .then((response) => {
        setTransactionHistory(response.data.userTransactionHistory);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getTransactions(12);
  }, []);
  
  





  return (
    <div className="App" >
      <BrowserRouter>
        <main>
          <Navbar isLogged={isLogged} setIsLogged={setIsLogged} /> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home getProfile={getProfile} getAccount={getAccount} getPortfolio={getPortfolio} portfolio={portfolio} profile= {profile} account={account}/>} />
            <Route
              path="/trade"
              element={
                <Trade
                  updateStockPrice={updateStockPrice}
                  tickers={tickers}
                  stockData={stockData}
                />
              }
            />
            <Route
              path="/transaction"
              element={isLogged?(<TransactionTable transactionHistory={transactionHistory} />):(<LandingPage />)}
                
              
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
              element={<SignInPage setIsLogged={setIsLogged} 
              setCurrentUserId = {setCurrentUserId} />}
            />
            <Route path="/trade/:stockId" element={<StockCard updateStockPrice={updateStockPrice} tickers={tickers} currentUserId={currentUserId} stockData={stockData} acc_value={acc_value}/>} />
          </Routes>
        </main>
      </BrowserRouter>

      <br />
    </div>
  );
}

export default App;
