import { useState, useContext, createContext } from "react";
import "./App.css";
//color alternative for background #021809 : more green

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
//import Trading from '../../TradingCalculations/MovingAverageCrossover';
import Trading from "../../TradingCalculations/Trade";
import StrategyPage from "../StrategyPage/StrategyPage";

import Navbar from "../NavBar/NavBar";
import SignInPage from "../SignInPage/SignInPage";
import Home from "../Home/Home";
import Trade from "../Trade/Trade";
import NotFound from "../NotFound/NotFound";

// import Trading from "../../TradingCalculations/Trade"

import TradingStrategies from "../TradingStrategies/TradingStrategies";

import Utilities from "../../TradingCalculations/Utilities.js";

import StockCard from "../StockCard/StockCard";

import { useEffect } from "react";
import { Button, Center } from "@chakra-ui/react";

// import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"

// export const ThemeContext = createContext();

function App() {
  // keep for theme consistency
  // const [theme, setTheme] = useState('dark');
  // { background: black , color: white }

  // MeanReversionStrat.mainFunc();
  //State of the users Profile
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  // State Variables that have the current price of the stock

  const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];

  const [metaPrice, setMetaPrice] = useState(0);
  const [amznPrice, setAmznPrice] = useState(0);
  const [nflxPrice, setNflxPrice] = useState(0);
  const [googlPrice, setGooglPrice] = useState(0);
  const [crmPrice, setCrmPrice] = useState(0);

  //The percentage change
  const [metaPercent, setMetaPercent] = useState(0);
  const [amznPercent, setAmznPercent] = useState(0);
  const [nflxPercent, setNflxPercent] = useState(0);
  const [googlPercent, setGooglPercent] = useState(0);
  const [crmPercent, setCrmPercent] = useState(0);

  //State Variable that gatehrs the price in teh last 30 days
  const [historicalMeta, setHistoricalMeta] = useState([]);
  const [historicalAmzn, setHistoricalAmzn] = useState([]);
  const [historicalGoogle, setHistoricalGoogle] = useState([]);
  const [historicalCrm, setHistoricalCrm] = useState([]);
  const [historicalNflx, setHistoricalNflx] = useState([]);
  const [historicalChecker, setHistoricalChecker] = useState(false);

  // login functiionaility
  const [isLogged, setIsLogged] = useState(false);
  // this contains the id of the currently logged in user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [usertoken, setUserToken] = useState(null);

  const [buying_power, setBuyingPower] = useState(10000);
  const [acc_value, setAccValue] = useState(10000);
  const [transactionHistory, setTransactionHistory] = useState(null);

  // -------------------- Strategy Usestate Variables ------------------\\\
  const [strategyBuyingPower, setStrategyBuyingPower] = useState(0);
  const [strategyType, setStrategyType] = useState(0);
  const [formattedStrategyName, setFormattedStrategyName] = useState();

  // Now that we are adding our strategies into our APp, we edit some calculations
  //  - account value now also includes the bots buying power
  //  - we subtract the users buying power from the bots buying power

  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate() - 30);

  const mergeArrays = (arr1, arr2, arr3, arr4, arr5) => {
    const mergedArray = [];
    // Create an object to keep track of merged data
    const dataMap = {};
    
    arr1.forEach(({ date, ...rest }) => {
      dataMap[date] = { ...dataMap[date], ...rest };
    });
    
    arr2.forEach(({ date, ...rest }) => {
      dataMap[date] = { ...dataMap[date], ...rest };
    });
    
    arr3.forEach(({ date, ...rest }) => {
      dataMap[date] = { ...dataMap[date], ...rest };
    });
    
    arr4.forEach(({ date, ...rest }) => {
      dataMap[date] = { ...dataMap[date], ...rest };
    });
  
    // For the fifth array
    arr5.forEach(({ date, ...rest }) => {
      dataMap[date] = { ...dataMap[date], ...rest };
    });
  
    // Convert the data in the dataMap back to an array
    Object.keys(dataMap).forEach((date) => {
      mergedArray.push({ date, ...dataMap[date] });
    });
  
    return mergedArray;
  };

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
    try {
      const date = new Date(dat);
      let day = date.getDate().toString();
      let month = (date.getMonth() + 1).toString();
      let year = date.getFullYear();
      return month + "/" + day + "/" + year;
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("CURRENT USER ", currentUserId)
  //Trading.calculateDisplayedProfit("META")

  //  /stock/:ticker

  // /avgbuyprice/:ticker/:user_id

  let tickerAvgBuyPrice = {};
  const [metaAVGBuyPrice, setMetaAVGBuyPrice] = useState(0);
  const [amznAVGBuyPrice, setAmznAVGBuyPrice] = useState(0);
  const [nflxAVGBuyPrice, setNflxAVGBuyPrice] = useState(0);
  const [googlAVGBuyPrice, setGooglAVGBuyPrice] = useState(0);
  const [crmAVGBuyPrice, setCrmAVGBuyPrice] = useState(0);

  // const getTickerViaUser = async (ticker) => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:3001/trans/avgbuyprice/${ticker}/${localStorage.getItem(
  //         "currentUserId"
  //       )}`
  //     );
  //     // console.log("Response Data: ", res.data); // Log the response data to see its structure
  //     const length = res.data.data.length;

  //     if (length != 0) {
  //       // console.log("here is it" ,res.data.data)
  //       tickerAvgBuyPrice[ticker] = res.data.data[length - 1].avg_buy_price;
  //     }
  //   } catch (error) {
  //     console.log("Error:", error.response.data.error.message);
  //   }
  // };

  // getTickerViaUser("CRM");

  // reason this is in asyn is for the way that js works that the dictionary is not saved in its state
  // const processTickers = async () => {
  //   // Execute all API calls in parallel and wait for all of them to complete
  //   await Promise.all(tickers.map((ticker) => getTickerViaUser(ticker)));
  //   // Now that all API calls are completed, log the fully populated dictionary
  //   // console.log("the dict, ", tickerAvgBuyPrice);

  //   // console.log("the dict", tickerAvgBuyPrice)

  //   setMetaAVGBuyPrice(tickerAvgBuyPrice["META"]);
  //   setAmznAVGBuyPrice(tickerAvgBuyPrice["AMZN"]);
  //   setNflxAVGBuyPrice(tickerAvgBuyPrice["NFLX"]);
  //   setGooglAVGBuyPrice(tickerAvgBuyPrice["GOOGL"]);
  //   setCrmAVGBuyPrice(tickerAvgBuyPrice["CRM"]);
  // };

  // processTickers();

  
  // console.log("META PRICE INN AS ETF", nflxAVGBuyPrice)

  //The following 3 getter: gets the list of all stocks and account used by the user

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/auth/profile/${localStorage.getItem(
          "currentUserId"
        )}`
      );
      setProfile(res.data.user);
      // console.log("PROFILE ", res.data.user)
    } catch (error) {
      console.log(error);
    }
  };

  // getProfile();

  const getAccount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/trans/account/${localStorage.getItem(
          "currentUserId"
        )}`
      );
      setAccount(res.data.account);
      // console.log("ACCOUNT ", res.data.account)
    } catch (error) {
      console.log(error);
    }
  };

  const getPortfolio = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/trans/portfolio/${localStorage.getItem(
          "currentUserId"
        )}`
      );
      setPortfolio(res.data.user);
      // console.log("PORTFOLIO ", res.data.user)
    } catch (error) {
      console.log(error);
    }
  };

  

  // console.log("is it pop here", nflxPercent )
  const stockData = {
    2: {
      company: "Meta Platforms Inc",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",
      stockName: "META",
      stockPrice: metaPrice,
      stockPercentage: metaPercent,
    },
    4: {
      company: "Amazon.com Inc.",
      logo: "https://www.citypng.com/public/uploads/preview/-11596400565qsuxfwyv9j.png",
      stockName: "AMZN",
      stockPrice: amznPrice,
      stockPercentage: amznPercent,
    },
    1: {
      company: "Netflix Inc",
      logo: "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png",
      stockName: "NFLX",
      stockPrice: nflxPrice,
      stockPercentage: nflxPercent,
    },
    5: {
      company: "Alphabet Inc Class A",
      logo: "https://dvh1deh6tagwk.cloudfront.net/finder-us/wp-uploads/sites/5/2020/04/AlphabetLogo_Supplied_250x250.png",
      stockName: "GOOGL",
      stockPrice: googlPrice,
      stockPercentage: googlPercent,
    },
    3: {
      company: "Salesforce Inc",
      logo: "https://www.sfdcstatic.com/common/assets/img/logo-company-large.png",
      stockName: "CRM",
      stockPrice: crmPrice,
      stockPercentage: crmPercent,
    },
  };

  // --------------------------------------------------------------------------------------------------------------
  // this function gets the current price of the stocks
  // const getPercentChange = async (ticker) => {
  //   console.log("PERCENT CHANGE-------------")
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/trans/stock/${ticker}`
  //     );

  //     const percentChange = response.data.data.dp; // this is the current price of the stock
  //     // const currPrice = price.c
  //     console.log(percentChange)
  //     return percentChange
  //     // console.log(price);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getStockPrice = async (ticker) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/trans/stock/${ticker}`
      );

      const price = response.data.data.c; // this is the current price of the stock
      const percentChange = response.data.data.dp;
      switch (ticker) {
        case "META":
          setMetaPrice(price);
          
          setMetaPercent(percentChange);          
          break;
        case "AMZN":
          setAmznPrice(price);
          setAmznPercent(percentChange);
          break;
        case "NFLX":
          setNflxPrice(price);
          setNflxPercent(percentChange);
          // console.log("NFLX percentChange", percentChange)
          break;
        case "GOOGL":
          setGooglPrice(price);
          setGooglPercent(percentChange);
          break;
        case "CRM":
          setCrmPrice(price);
          setCrmPercent(percentChange);
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

  const updateStockPrice = async (tickers) => {
    console.log(tickers);
    tickers.forEach(async (ticker) => {
      await getStockPrice(ticker);
    });
  };

  // --------------------------------------------------------------------------------------------------------------
  //The function fetches the price of past Stock
  const pastStockPrice = async (tick, date) => {
    try {
      //console.log("history is being used")
      const list = await Trading.fetchHistoricalData(tick, date);
      //The data now extracts the date and open price
      // console.log("history is being used", list)

      const extractedData = list.map((item) => ({
        date: item.date,
        [tick]: item.open,
      }));
      return extractedData;
    } catch (error) {
      console.error(error);
    }
  };

  const getStrategy = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/strategy/${localStorage.getItem(
          "currentUserId"
        )}`
      );
      // console.log("STRATEGY ", res.data.data)
      setStrategyType(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeStrategy = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/strategy/remove/${localStorage.getItem(
          "currentUserId"
        )}`
      );
      await getStrategy();
      await getAccount();
      console.log(
        `Removed strategy for user ${localStorage.getItem(
          "currentUserId"
        )}${localStorage.getItem("currentUserId")}`
      );
    } catch (error) {
      console.error(`Failed to remove strategy for user ${userId}:`, error);
    }
  };

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
    const fetchData = async () => {
      const meta = await pastStockPrice(tickers[0], rangeDate);
      const amzn = await pastStockPrice(tickers[1], rangeDate);
      const google = await pastStockPrice(tickers[3], rangeDate);
      const crm = await pastStockPrice(tickers[4], rangeDate);
      const nflx = await pastStockPrice(tickers[2], rangeDate)

      // const mPercentage = await getPercentChange(tickers[0]);
      // const aPercentage = await getPercentChange(tickers[1]);
      // const gPercentage = await getPercentChange(tickers[3]);
      // //netflix here
      // const cPercentage = await getPercentChange(tickers[4]);

      const [historicalMeta, historicalAmzn, historicalCrm, historicalGoogle, historicalNflx] =
        await Promise.all([meta, amzn, crm, google, nflx]);
      setHistoricalAmzn(historicalAmzn);
      setHistoricalCrm(historicalCrm);
      setHistoricalGoogle(historicalGoogle);
      setHistoricalMeta(historicalMeta);
      setHistoricalNflx(historicalNflx)
      // setMetaPercent(metaPercent);
      // setAmznPercent(amznPercent);
      // setGooglPercent(googlPercent);
      // setCrmPercent(crmPercent);

      setHistoricalChecker(true);
    };
    const getTransactions = async (userID) => {
      axios
        .get(`http://localhost:3001/trans/history/${userID}`)
        .then((response) => {
          // console.log("HISTORY in APP: ", response);
          setTransactionHistory(response.data.userTransactionHistory);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
    getTransactions(localStorage.getItem("currentUserId"));
  }, []);

  return (
    <div className="App">
      {/* <ThemeContext.Provider value={theme} > */}
      <BrowserRouter>
        <main>
          <Navbar isLogged={isLogged} setIsLogged={setIsLogged} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/home"
              element={
                <Home
                  getProfile={getProfile}
                  getAccount={getAccount}
                  getPortfolio={getPortfolio}
                  pastStockPrice={pastStockPrice}
                  portfolio={portfolio}
                  profile={profile}
                  account={account}
                  tickers={tickers}
                  fixedDate={fixedDate}
                  historicalData={mergeArrays(
                    historicalAmzn,
                    historicalCrm,
                    historicalGoogle,
                    historicalMeta,
                    historicalNflx
                  )}
                  strategyBuyingPower={strategyBuyingPower}
                  setStrategyBuyingPower={setStrategyBuyingPower}
                  strategy={strategyType}
                  setStrategyType={setStrategyType}
                  getStrategy={getStrategy}
                  userId={currentUserId}
                  removeStrategy={removeStrategy}
                  formattedStrategyName={formattedStrategyName}
                  metaAVGBuyPrice={metaAVGBuyPrice}
                  crmAVGBuyPrice={crmAVGBuyPrice}
                  nflxAVGBuyPrice={nflxAVGBuyPrice}
                  amznAVGBuyPrice={amznAVGBuyPrice}
                  googlAVGBuyPrice={googlAVGBuyPrice}
                />
              }
            />
            <Route
              path="/trade"
              element={
                <Trade
                  updateStockPrice={updateStockPrice}
                  tickers={tickers}
                  stockData={stockData}
                  historicalData={mergeArrays(
                    historicalAmzn,
                    historicalCrm,
                    historicalGoogle,
                    historicalMeta,
                    historicalNflx
                  )}
                />
              }
            />
            <Route
              path="/transaction"
              element={isLogged?(<TransactionTable transactionHistory={transactionHistory} stockData={stockData} fixedDate={fixedDate} username = {profile} />):(<LandingPage />)}
                
              
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
              element={
                <SignInPage
                  setIsLogged={setIsLogged}
                  setCurrentUserId={setCurrentUserId}
                />
              }
            />
            <Route
              path="/trade/:stockId"
              element={
                historicalChecker && stockData ? (
                  <StockCard
                    updateStockPrice={updateStockPrice}
                    tickers={tickers}
                    stockData={stockData}
                    currentUserId={currentUserId}
                    historicalData={mergeArrays(
                      historicalAmzn,
                      historicalCrm,
                      historicalGoogle,
                      historicalMeta,
                      historicalNflx
                    )}
                  account = {account}
                  getAccount = {getAccount}
                  getPortfolio={getPortfolio}
                  portfolio = {portfolio}
                  />
                ) : (
                  <Center
                    position={"fixed"}
                    w={"full"}
                    h={"100vh"}
                    bgColor={"#000409"}
                  >
                    <Button
                      isLoading
                      loadingText="Loading"
                      color="white"
                      variant="outline"
                    ></Button>
                  </Center>
                )
              }
            />
            <Route
              path="/strategies"
              element={
                <TradingStrategies
                  strategyBuyingPower={strategyBuyingPower}
                  setStrategyBuyingPower={setStrategyBuyingPower}
                  strategy={strategyType}
                  setStrategyType={setStrategyType}
                  getStrategy={getStrategy}
                  userId={currentUserId}
                  removeStrategy={removeStrategy}
                />
              }
            />

            <Route
              path="/strategies/:name"
              element={
                <StrategyPage
                  strategyBuyingPower={strategyBuyingPower}
                  setStrategyBuyingPower={setStrategyBuyingPower}
                  buyingPower={buying_power}
                  setBuyingPower={setBuyingPower}
                  strategy={strategyType}
                  setStrategyType={setStrategyType}
                  getStrategy={getStrategy}
                  userId={currentUserId}
                  removeStrategy={removeStrategy}
                  setFormattedStrategyName={setFormattedStrategyName}
                />
              }
            />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
      {/* </ThemeContext.Provider> */}

      <br />
    </div>
  );
}

export default App;
