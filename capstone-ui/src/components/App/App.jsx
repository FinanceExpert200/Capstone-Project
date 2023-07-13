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
import Trade from "../Trade/Trade";
import NavBar from "../NavBar/NavBar";
import SignInPage from "../SignInPage/SignInPage";
import Home from "../Home/Home";

import { useEffect } from "react";

function App() {
  // State Variables that have the current price of the stock

  const [metaPrice, setMetaPrice] = useState(0);
  const [amznPrice, setAmznPrice] = useState(0);
  const [aaplPrice, setAaplPrice] = useState(0);
  const [nflxPrice, setNflxPrice] = useState(0);
  const [googlPrice, setGooglPrice] = useState(0);
  const [crmPrice, setCrmPrice] = useState(0);



  // const socket = new WebSocket(
  //   "wss://ws.finnhub.io?token=cio3l89r01qhd71bn54gcio3l89r01qhd71bn550"
  // );

  // // Function to handle subscriptions
  // const subscribeToSymbols = () => {
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "META" }));
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "AMZN" }));
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "NFLX" }));
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "GOOGL" }));
  //   socket.send(JSON.stringify({ type: "subscribe", symbol: "CRM" }));
  // };

  // // Function to handle unsubscriptions
  // const unsubscribeFromSymbols = () => {
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "META" }));
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "AMZN" }));
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "AAPL" }));
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "NFLX" }));
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "GOOGL" }));
  //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: "CRM" }));
  // };

  // // Subscribe to symbols when the socket connection is opened
  // socket.addEventListener("open", function (event) {
  //   subscribeToSymbols();

  //   // Start the timer to update data every minute
  //   setInterval(() => {
  //     unsubscribeFromSymbols();
  //     subscribeToSymbols();
  //   }, 60000); // 60000 milliseconds = 1 minute
  // });

  // // Listen for messages
  // socket.addEventListener("message", function (event) {
  //   const message = JSON.parse(event.data);
  //   const trades = message.data;
  //   // console.log("Message from server", trades);

  //   if (trades && trades.length > 0) {
  //     const firstTrade = trades[0];

  //     if (firstTrade.s === "META") {
  //       setMetaPrice(firstTrade.p);
  //     } else if (firstTrade.s === "AMZN") {
  //       setAmznPrice(firstTrade.p);
  //     } else if (firstTrade.s === "AAPL") {
  //       setAaplPrice(firstTrade.p);
  //     } else if (firstTrade.s === "NFLX") {
  //       setNflxPrice(firstTrade.p);
  //     } else if (firstTrade.s === "GOOGL") {
  //       setGooglPrice(firstTrade.p);
  //     } else if (firstTrade.s === "CRM") {
  //       setCrmPrice(firstTrade.p);
  //     }

  //     console.log("Message from server", firstTrade);
  //     // console.log("Meta Price", metaPrice);
  //     // console.log("AMZN Price", amznPrice);
  //     // console.log("AAPL Price", aaplPrice);
  //   }
  // });

  // login functiionaility
  const [isLogged, setIsLogged] = useState(false);
  // this contains the id of the currently logged in user
  const [currentUserId, setCurrentUserId] = useState(null);

  // const [id, setId] = useState(null);

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  // set

  const [transactionHistory, setTransactionHistory] = useState();

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");
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
