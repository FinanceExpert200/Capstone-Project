import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./StrategyPage.css";
import axios from "axios"
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js";
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js";
import Divergence from "../../TradingCalculations/Divergence.js";
import PairsTrading from "../../TradingCalculations/PairsTrading";
import ResultDivergence from "./ResultDivergence";
import ResultMovingAverage from "./ResultMovingAverage";
import ResultMeanReversion from "./ResultMeanReversion";
import ResultPairsTrading from "./ResultPairsTrading";
import EMAStrat from "../../TradingCalculations/EMAStrat";

import {
  Button,
  Box,
  Heading,
  Flex,
  Center,
  Stack,
  Text,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const StrategyPage = ({ userId, strategyBuyingPower, setStrategyBuyingPower, strategyType, setStrategyType, buyingPower, setBuyingPower }) => {
  const { name } = useParams();
  let formattedName = ''
  const [currentAccountValue, setCurrentAccountValue] = useState([]);
  const [currentTransactionHistory, setCurrentTransactionHsitory] = useState([]);
  const [ranStrategy, setRanStrategy] = useState(false);
  const [selectedTickers, setselectedTickers] = useState([]);
  const [error, seterror] = useState(false);
  const [error2, setError2] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');

  const [rsi, setRsi] = useState(null);
  const [movAverage, setMovingAverage] = useState(null);
  const [arrayAvr, setArrayAvr] = useState(null)
  const [pairsTradeArray, setPairsTradeArray] = useState(null)
  //quanity set is here
  const [simulatedBuyingPower, setSimulatedBuyingPower] = useState(0)
  const [bo, setBO] = useState(0);

  // Here we need to handle each of the buttons
  // This page consists of:
  // A brief description of the strategy and How it works
  // A form to choose which stocks you want to run the strategy on (for pairs trading there should always be only two stocks selected at a time)
  // An input to choose how muhc money they want toe bot to trade with
  // A run button
  // A part that shows the total profatibility of the straregy
  // Tiles that show the company and all trades that were made


  // Now we need to reormat name 
  const formatStrategyName = (name) => {
    switch (name) {
      case "meanreversion":
        formattedName = "Mean Reversion"
        break;
      case "movingaveragecrossover":
        formattedName = "Moving Average Crossover"
        break
      case "divergence":
        formattedName = "Relative Strength Divergence"
        break
      case "pairstrading":
        formattedName = "Pairs Trading"
        break
      case "exponentialmovingaverage":
        formattedName = "Exponential Moving Average"
        break

      default:
        break;
    }
  }
  formatStrategyName(name)


  const displayDescription = (name) => {
    let description = "";

    switch (name) {
      case "meanreversion":
        description =
          "we utilize the dynamic Mean Reversion Strategy to spot compelling trading opportunities. Our strategy identifies instances where a stock's 30-day moving average falls 10 percent below its 120-day moving average. When this occurs, we seize the opportunity to BUY the stock. Our detailed analysis suggests an imminent upward correction, making it an enticing entry point for investors looking to leverage short-term market imbalances. Once the stock price rebounds and aligns with its 120-day moving average, we execute a SELL order to secure profits. This well-calibrated approach allows you to capture gains as the stock reverts to its historical trend, maximizing your investment potential. StockSwap - Empowering Your Success For a Better Tomorrow.";
        break;

      case "movingaveragecrossover":
        description =
          "Moving Average Crossover Strategy description goes here.";
        break;

      case "divergence":
        description = "Divergence Strategy description goes here.";
        break;

      case "pairstrading":
        description = "Pairs Trading Strategy description goes here.";
        break;
      case "EMAStrat":
        description = "EMAStrat Strategy description goes here.";
        break;

      default:
        description = "Invalid strategy type.";
        break;
    }

    return <p>{description}</p>;
  };

  const runMovingAverageCrossoverStrategy = async (selectedStocks) => {
    console.log(selectedStocks);
    let transactionHistory =
      await MovingAverageCrossover.calculateDisplayedProfit(
        simulatedBuyingPower,
        selectedStocks
      );
    let accountValue = await MovingAverageCrossover.getAccountValue();
    let ma = MovingAverageCrossover.getMovingAverages();
    console.log("account value ------", accountValue);
    console.log("Trade Averages ----- ", ma);

    setCurrentTransactionHsitory(transactionHistory);
    let result = accountValue.map(value => value - simulatedBuyingPower);
    setCurrentAccountValue(result);
    setMovingAverage(ma);
  };
  //console.log("Moving Average Array -----", currentTransactionHistory);
  //console.log("PROFIT ---", currentAccountValue)

  const runMeanReversionStrategy = async (selectedTickers) => {
    await MeanReversionStrat.mainFunc(simulatedBuyingPower, selectedTickers);
    let transaction = await MeanReversionStrat.getTransactionHistory();
    let profitArray = await MeanReversionStrat.getProfitArray();
    let AvgArray = await MeanReversionStrat.getThirtyDayAvgArray();
    //console.log("THIRTY DAY : ", thirtyDayArray)
    setCurrentTransactionHsitory(transaction);
    setCurrentAccountValue(profitArray);
    setArrayAvr(AvgArray);
  };

  const runEMAStrategy = async (selectedTickers) => {
    EMAStrat.mainFunc(simulatedBuyingPower, selectedTickers);
  };

  if (simulatedBuyingPower != 0) {
    console.log("SimulatedBuyingPower ", simulatedBuyingPower)
  }



  const runDivergenceStrategy = async (selectedStocks) => {
    try {
      console.log("clicked");
      let [transactionHistory, returnedArray] =
        await Divergence.calculateDisplayedProfit(
          simulatedBuyingPower,
          selectedStocks
        );
      let result = returnedArray.map(value => value - simulatedBuyingPower);
      setCurrentTransactionHsitory(transactionHistory);
      setCurrentAccountValue(result)
      const RSI = await Divergence.getRSIData()
      //set a var array to display in front end
      setRsi(RSI);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const runPairsTradingStrategy = async (selectedStocks) => {
    let transactionHistory = await PairsTrading.calculateProfit(
      selectedStocks,
      simulatedBuyingPower
    );
    let accountValue = PairsTrading.getAccountValue()
    // setTest(PairsTrading.getTransactionHistory());
    let result = accountValue.map(value => value - simulatedBuyingPower);
    setCurrentAccountValue(result)
    // setPriceRatioArray(PairsTrading.getPriceRatio())
    setCurrentTransactionHsitory(transactionHistory);
    console.log("PAIRS TRADING DATA")
    const pairsTradingData = PairsTrading.getAllDataArray()
    setPairsTradeArray(pairsTradingData);
    console.log("TRADE DATA", pairsTradeArray)
    //console.log("TEST", test)


  };



  const runStrategy = async (event, name) => {
    event.preventDefault();
    setCurrentAccountValue(0);
    setCurrentTransactionHsitory([]);
    //console.log();

    if (selectedTickers.length >= 1 && simulatedBuyingPower > 500) {
      console.log('GOT ACCEPTED')
      setRanStrategy(true);
      switch (name) {
        case "meanreversion":
          runMeanReversionStrategy(selectedTickers);
          break;

        case "movingaveragecrossover":
            runMovingAverageCrossoverStrategy(selectedTickers);
          break;

        case "divergence":
          runDivergenceStrategy(selectedTickers);
          break;
        case "pairstrading":
          runPairsTradingStrategy(selectedTickers);
          break;
        case "exponentialmovingaverage":
          runEMAStrategy(selectedTickers);
          break;

        default:
          console.log("Invalid strategy type.");
          break;
      }
      setRanStrategy(true);
    } else if (selectedTickers.length === 0 && simulatedBuyingPower < 500 && simulatedBuyingPower > 0) {
      setErrorMessage("You must select a ticker and input a minimum of $500 to start");
      setError2(true)
      console.log("ERRORS", { errorMessage })
    }
    else if (simulatedBuyingPower < 500 && simulatedBuyingPower > 0) {
      console.log("BEING USED HERE ")
      setErrorMessage("Must input a minimum amount allowed is $500");
      setError2(true)
      console.log("ERRORS", { errorMessage })
    }
    else if (selectedTickers.length === 0) {
      console.log("You must select at least one ticker")
      setErrorMessage("You must select at least one ticker");
      setError2(true)
      console.log("ERRORS", { errorMessage })
    }
    else if (simulatedBuyingPower < 0) {
      console.log("length error here ")
      setErrorMessage("Quantity cannot be a negative number");
      setError2(true)
      console.log("ERRORS", { errorMessage })
    }


    //setselectedTickers([]);
    seterror(false);
    setBuyingPower(0);
    setSimulatedBuyingPower(0);
    const quantityInput = document.getElementById("quantity");
    if (quantityInput) {
      quantityInput.value = ""; // Reset the input to empty
    }
  };

  const renderButtons = (name) => {
    return ["META", "AMZN", "GOOGL", "AAPL", "CRM", "NFLX"].map((number) => (
      <Button
        key={number}
        onClick={() => handleButtonClick(number, name)}
        bg={selectedTickers.includes(number) ? "green.500" : "#bbdbcb"}
        color={selectedTickers.includes(number) ? "white" : "#03314b"}
        _hover={{ bg: "green.500", color: "white" }}
        m={3}
      >
        {number}
      </Button>
    ));
  };
  const handleButtonClick = (buttonNumber, name) => {
    if (name == "pairstrading" && selectedTickers.length > 2) {
      console.log(
        "Pairs trading only works with two stocks, select two in ordet to submit"
      );
      seterror(true);
    } else if (name != "pairstrading" && selectedTickers.length === 0) {
      setErrorMessage("you must select a ticker")
      seterror(true);
    }
    if (selectedTickers.includes(buttonNumber)) {
      setselectedTickers(selectedTickers.filter((num) => num !== buttonNumber));
      seterror(false);
    } else if (name != "pairstrading" || selectedTickers.length < 2) {
      setselectedTickers([...selectedTickers, buttonNumber]);
      seterror(false);
    } else {
      setErrorMessage("you must select a ticker")
      seterror(true);
    }
  };

  const handleInputChangeForSimulatedBuyingPower = (event) => {
    console.log(
      `setting the current simulated buying Power to ${event.target.value}`
    );
    setSimulatedBuyingPower(event.target.value);
    setBO(event.target.value)
  };

  const handleInputChangeForstrategyBuyingPower = (event) => {
    event.preventDefault()
    setStrategyBuyingPower(event.target.value)
  }

  const addStrategyToUser = async (strategyName, strategyBuyingPower, currentUserId) => {
    console.log(`StrategyName ${strategyName} Buying Power ${strategyBuyingPower}, UserID: ${currentUserId} user buying power ${buyingPower}`)
    //Check if the user has enough money to gve to the bot
    if (buyingPower > strategyBuyingPower) {
      try {

        const res = await axios.post(`http://localhost:3001/strategy/add`, {
          strategy_type: strategyName,
          buying_power: strategyBuyingPower,
          user_id: currentUserId
        });
        console.log(res.data);
        console.log("Formatted name ", formattedName)

      } catch (err) {
        console.log(err);
      }
    }
    else {
      console.error("INSUFFICIENT FUNDS")
    }
  };

  console.log("selected tickers", simulatedBuyingPower);


  return (
    <Box
      h={"100vh"}
      w={"full"}
      bgColor={'#ecf2f3'}
      position={"absolute"}
      paddingLeft={"80px"}
      pr={"80px"}
    >
      {ranStrategy && currentAccountValue && currentTransactionHistory ? (
        <div>
          {rsi ? (
            <ResultDivergence
              accountValues={currentAccountValue}
              transactionHistory={currentTransactionHistory}
              rsi={rsi}
              companies={selectedTickers}
              buyingPower={bo}
            />
          ) : movAverage ? (
            <ResultMovingAverage
              maArray={movAverage}
              transactionHistory={currentTransactionHistory}
              accountValues={currentAccountValue}
              companies={selectedTickers}
              buyingPower={bo}
            />
          ) : arrayAvr ? (
            <ResultMeanReversion
              transactionHistory={currentTransactionHistory}
              accountValues={currentAccountValue}
              averageArray={arrayAvr}
              companies={selectedTickers}
              buyingPower={bo} />

          ) : pairsTradeArray ? (
            <ResultPairsTrading accountValues={currentAccountValue}
              transactionHistory={currentTransactionHistory}
              companies={selectedTickers}
              pairsData={pairsTradeArray}
              buyingPower={bo}
            />
          ) : (
            <Center h={"100vh"}>
              <Flex
                direction={"row"}
                justify={"space-between"}
                fontSize={"50px"}
              >
                <Stack m={3}>
                  <Text color={"green.600"}>${Number(currentAccountValue[0]).toFixed(2)}</Text>
                  <Text>3 Month Profit</Text>
                </Stack>
                <Stack m={3}>
                  <Text color={"green.600"}>
                    ${Number(currentAccountValue[1]).toFixed(2)}
                  </Text>
                  <Text>6 Month Profit</Text>
                </Stack>
                <Stack m={3}>
                  <Text color={"green.600"}>
                    ${Number(currentAccountValue[2]).toFixed(2)}
                  </Text>
                  <Text>1 Year Profit</Text>
                </Stack>
              </Flex>
            </Center>
          )}
          <Button
            onClick={() => {
              setRanStrategy(false);
              setselectedTickers([]);
            }}
          >
            Run Again
          </Button>
        </div>
      ) : (
        <Center
          h={"100vh"}
          w={"full"}
          textColor={"#03314b"}
          flexDirection={"column"}
        >
          <Heading
            fontSize={50}

            color={'#03314b'}
          >
            {formattedName} Simulation
          </Heading>
          <Heading
            fontSize={30}
            m={8}
            color={'#03314b'}
          >
            Select From the Following Companies
          </Heading>
          <Text mb={3}>Requirments:</Text>
          <Box
            rounded={"lg"}
            boxShadow={'20px 20px 30px grey'}
            p={8}
            borderWidth={3} borderColor={'#90abad'}

          >
            <Box
              as={"form"}
              className="run-strategy-form"
              onSubmit={(event) => runStrategy(event, name)}
            >
              {renderButtons(name)}

              <Box fontSize={'20px'}>Selected buttons:</Box>
              <Text m={'10px'} fontSize={'20px'}> {selectedTickers.join(', ')}</Text>
              {error && (<Alert status='warning'>
                <AlertIcon />
                <AlertDescription>Pairs Trading can only have 2 options selected</AlertDescription>
              </Alert>)}

              <Flex direction={'row'} justify={'space-between'}>

                <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForSimulatedBuyingPower} w={'30'} />
                <Button type="submit" bg={'blackAlpha.200'} _hover={{ bg: "green.500", color: "white" }}>
                  Run Strategy
                </Button>
              </Flex>
              
              {error2 && (<Alert status='warning' w={'auto'} fontSize={'sm'} mt={3} mb={3}>
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>)}


            </Box>
            <Flex mt={3} mb={3} justify={'space-between'}>
            <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForstrategyBuyingPower} w={'30'} />
            <Button bg={'blackAlpha.200'} _hover={{ bg: "green.500", color: "white" }} onClick={(event) => { event.preventDefault(); addStrategyToUser(name, strategyBuyingPower, userId) }}  >
              Add Strategy To Account
            </Button>

            </Flex>

          </Box>

        </Center>
      )}




    </Box>
  )
}

export default StrategyPage;