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
import StockCard from "../StockCard/StockCard";

import { useEffect } from "react";

function App() {
  // State Variables that have the current price of the stock

  const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];


  const [metaPrice, setMetaPrice] = useState(0);
  const [amznPrice, setAmznPrice] = useState(0);
  const [nflxPrice, setNflxPrice] = useState(0);
  const [googlPrice, setGooglPrice] = useState(0);
  const [crmPrice, setCrmPrice] = useState(0);

  const [stockInfo, setStockInfo] = useState(
    { name: "meta", price: metaPrice, id: 1 },
    { name: "amzn", price: amznPrice, id: 2 },
    { name: "nflx", price: nflxPrice, id: 3 },
    { name: "googl", price: googlPrice, id: 4 },
    { name: "crm", price: crmPrice, id: 5 }
  );

  // const[currentAccountValue, setCurrentAccountValue] = useState(0)

  const getStockPrice = async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/trans/stock/${ticker}`
      );
      const price = response.data.data.c; // THIS IS INCORRECT
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

  // console.log("Here is the meta price: ", metaPrice);

  const updateStockPrice = async (tickers) => {
    console.log(tickers);
    tickers.forEach(async (ticker) => {
      await getStockPrice(ticker);
    });
  };

  // useEffect(() => {
  //   // getStockPrice("META");
  //   updateStockPrice(tickers)
  // }, []);
  // updateStockPrice(tickers)
  // getStockPrice("META");

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
            <Route
              path="/trade"
              element={
                <Trade
                  updateStockPrice={updateStockPrice}
                  tickers={tickers}
                  metaPrice={metaPrice}
                  amznPrice={amznPrice}
                  nflxPrice={nflxPrice}
                  googlPrice={googlPrice}
                  crmPrice={crmPrice}
                  getStockPrice={getStockPrice}
                  stockInfo={stockInfo}
                />
              }
            />
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
            <Route path="/trade/:stockId" element={<StockCard metaPrice={metaPrice} updateStockPrice={updateStockPrice} tickers={tickers} />} />
          </Routes>
        </main>
      </BrowserRouter>

      <br />
    </div>
  );
}

export default App;
