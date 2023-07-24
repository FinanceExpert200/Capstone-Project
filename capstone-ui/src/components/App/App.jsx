import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  json,
} from "react-router-dom";
import axios from "axios";

import LandingPage from "../LandingPage/LandingPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import TransactionTable from "../TransactionTable/TransactionTable";
import Trading from "../../TradingCalculations/Trade.js"



import Navbar from "../NavBar/NavBar";
import SignInPage from "../SignInPage/SignInPage";
import Home from "../Home/Home";
import Trade from "../Trade/Trade"



import StockCard from "../StockCard/StockCard";

import { useEffect } from "react";

// import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"

import Trading from "../../TradingCalculations/Trade.js"  


function App() {


  // MeanReversionStrat.mainFunc();











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

  //State Variable that gatehrs the price in teh last 30 days
  const [historicalPrice, setHistoricalPrice] = useState([]);

  // login functiionaility
  const [isLogged, setIsLogged] = useState(false);
  // this contains the id of the currently logged in user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [usertoken, setUserToken] = useState(null);

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  const [transactionHistory, setTransactionHistory] = useState();

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

  //a function that restructures the date
  const fixedDate = (dat) => {
    try{
      const date = new Date(dat);
      let day = date.getDate().toString();
      let month = (date.getMonth()+1).toString();
      let year = date.getFullYear();
      return month + '/' + day + '/' + year;

    }catch(error){
      console.log(error);
    }
  }

  // Trading.calculateDisplayedProfit("META")

  //The following 3 getter: gets the list of all stocks and account used by the user
  
  const getProfile = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/auth/profile/${localStorage.getItem("currentUserId")}`);
      setProfile(res.data.user);
    } catch(error){
      console.log(error)
    } 
  }

  const getAccount = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/trans/account/${localStorage.getItem("currentUserId")}`);
      setAccount(res.data.account);
    } catch(error){
      console.log(error)
    } 
  }

  const getPortfolio = async() => {
    try {
      const res = await axios.get(`http://localhost:3001/trans/portfolio/${localStorage.getItem("currentUserId")}`);
      setPortfolio(res.data.user);
    } catch(error){
      console.log(error)
    } 
  }

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
  //The function fetches the price of past Stock
  const pastStockPrice = async(tick, date) => {
    try{
      //console.log("history is being used")
      const list = await Trade.fetchHistoricalData(tick, date);
      //The data now extracts the date and open price
      
      const extractedData = list.map(item => (
        {
        date: fixedDate(item.date),
        [tick]: item.open,
      }));
      return extractedData;
      } catch(error){
      console.error(error);
    }
  }



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
            <Route path="/home" element={<Home getProfile={getProfile} getAccount={getAccount} getPortfolio={getPortfolio} 
                                               pastStockPrice={pastStockPrice} portfolio={portfolio} profile= {profile} 
                                               account={account} historicalPrice={historicalPrice} tickers = {tickers}
                                               fixedDate ={fixedDate}  />} />
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
