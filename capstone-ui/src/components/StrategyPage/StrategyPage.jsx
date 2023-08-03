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
  useColorModeValue,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

const StrategyPage = ({userId,strategyBuyingPower,setStrategyBuyingPower,strategyType,setStrategyType, buyingPower, setBuyingPower}) => {
  const { name } = useParams();
  let formattedName = ''
  const [currentAccountValue, setCurrentAccountValue] = useState([]);
  const [currentTransactionHistory, setCurrentTransactionHsitory] = useState([]);
  const [ranStrategy, setRanStrategy] = useState(false);
  const [selectedTickers, setselectedTickers] = useState([]);
  const [error, seterror] = useState(false);

  const [rsi, setRsi] = useState(null);
  const [movAverage, setMovingAverage] = useState(null);
  const [arrayAvr,setArrayAvr] = useState([])
  const [simulatedBuyingPower, setSimulatedBuyingPower] = useState(0)
  const [pairsTradeArray, setPairsTradeArray] = useState(null)
  

  //const [priceRatioArray, setPriceRatioArray] = useState(null)
  //const [test,setTest] = useState(null);
  // Here we need to handle each of the buttons
  // This page consists of:
  // A brief description of the strategy and How it works
  // A form to choose which stocks you want to run the strategy on (for pairs trading there should always be only two stocks selected at a time)
  // An input to choose how muhc money they want toe bot to trade with
  // A run button
  // A part that shows the total profatibility of the straregy
  // Tiles that show the company and all trades that were made

  //   let description = "";

  // Now we need to reormat name 
  const formatStrategyName = (name)=>{
    switch (name) {
      case "meanreversion":

        formattedName =  "Mean Reversion"
      case "movingaveragecrossover":
        formattedName = "Moving Average Crossover"
        break
      case "divergence":
        formattedName = "Relative StrengthI Divergence"
        break
      case "pairstrading":
        formattedName =  "Pairs Trading"
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
    setCurrentAccountValue(accountValue);
    setMovingAverage(ma);
  };
  console.log("Moving Average Array -----", currentTransactionHistory);
  console.log("PROFIT ---", currentAccountValue)

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

  useEffect(() => {
    console.log("ARRAY AVERAGE HAS CHANGED in strategy!")
    console.log(arrayAvr)
  }, [arrayAvr])

  const runEMAStrategy = async (selectedTickers) => {
    EMAStrat.mainFunc(simulatedBuyingPower, selectedTickers);
  };


  const runDivergenceStrategy = async (selectedStocks) => {
    try {
      console.log("clicked");
      let [transactionHistory, returnedArray] =
        await Divergence.calculateDisplayedProfit(
          simulatedBuyingPower,
          selectedStocks
        );
      setCurrentTransactionHsitory(transactionHistory);

            setCurrentAccountValue(returnedArray)
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
    // setTest(PairsTrading.getTransactionHistory());
    setCurrentAccountValue(PairsTrading.getAccountValue());
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
    console.log(name);

    if (selectedTickers.length >= 1) {
      setRanStrategy(true);
      switch (name) {
        case "meanreversion":
          runMeanReversionStrategy(selectedTickers);
          break;

        case "movingaveragecrossover":
          if (selectedTickers.length >= 1) {
     
            runMovingAverageCrossoverStrategy(selectedTickers);
          }
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
        colorScheme={selectedTickers.includes(number) ? "green" : "gray"}
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
    }
    if (selectedTickers.includes(buttonNumber)) {
      setselectedTickers(selectedTickers.filter((num) => num !== buttonNumber));
      seterror(false);
    } else if (name != "pairstrading" || selectedTickers.length < 2) {
      setselectedTickers([...selectedTickers, buttonNumber]);
      seterror(false);
    } else {
      seterror(true);
    }
  };

  const handleInputChangeForSimulatedBuyingPower = (event) => {
    console.log(
      `setting the current simulated buying Power to ${event.target.value}`
    );
    setSimulatedBuyingPower(event.target.value);
  };

    const handleInputChangeForstrategyBuyingPower = (event) =>{
        event.preventDefault()
        setStrategyBuyingPower(event.target.value)
    }

    const addStrategyToUser = async (strategyName, strategyBuyingPower, currentUserId) => {
        console.log(`StrategyName ${strategyName} Buying Power ${strategyBuyingPower}, UserID: ${currentUserId} user buying power ${buyingPower}`)
        //Check if the user has enough money to gve to the bot
        if(buyingPower > strategyBuyingPower){
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
        else{
            console.error("INSUFFICIENT FUNDS")
        }
    };
    
    console.log("selected tickers", selectedTickers);
    return (
      <Box
      h={"100vh"}
      w={"full"}
      bgColor={"#171923"}
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
            />
          ) : movAverage ? (
            <ResultMovingAverage
              maArray={movAverage}
              transactionHistory={currentTransactionHistory}
              accountValues={currentAccountValue}
              companies={selectedTickers}
            />
          ) : arrayAvr ? (
            <ResultMeanReversion 
              transactionHistory={currentTransactionHistory}
              accountValue={currentAccountValue}
              averageArray={arrayAvr}
              companies={selectedTickers}/>
          ): pairsTradeArray ? (
            <ResultPairsTrading accountValue={currentAccountValue} 
                                transactionHistory={currentTransactionHistory} 
                                companies={selectedTickers}
                                pairsData ={pairsTradeArray}
                               />
          ):(
            <Center h={"100vh"}>
              <Flex
                direction={"row"}
                justify={"space-between"}
                fontSize={"50px"}
              >
                <Stack m={3}>
                  <Text color={"green.600"}>
                    ${Number(currentAccountValue[0]).toFixed(2)}
                  </Text>
                  <Text>3 month</Text>
                </Stack>
                <Stack m={3}>
                  <Text color={"green.600"}>
                    ${Number(currentAccountValue[1]).toFixed(2)}
                  </Text>
                  <Text>6 month</Text>
                </Stack>
                <Stack m={3}>
                  <Text color={"green.600"}>
                    ${Number(currentAccountValue[2]).toFixed(2)}
                  </Text>
                  <Text>1 year</Text>
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
          textColor={"white"}
          flexDirection={"column"}
        >
          <Heading
            fontSize={50}
            m={10}
            bgGradient="linear(to-l, green.100, green)"
            bgClip="text"
          >
            Select From the Following Companies
          </Heading>
          <Box
            rounded={"lg"}
            boxShadow={"lg"}
            p={8}
            bgColor={useColorModeValue("gray.700")}
          >
            <Box
              as={"form"}
              className="run-strategy-form"
              onSubmit={(event) => runStrategy(event, name)}
            >
              {renderButtons(name)}

                        <Box fontSize={'20px'}>Selected buttons:</Box>
                        <Text m={'10px'} fontSize={'20px'}> {selectedTickers.join(', ')}</Text>
                        {error && <Text>Pairs Trading can only have 2 options selected</Text>}
                        <Flex direction={'row'} justify={'space-between'}>

                        <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForSimulatedBuyingPower} w={'30'}/>
                        <Button type="submit"  >
                            Run {formattedName} strategy
                        </Button>
                        </Flex>

                
                    </Box>

                    <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForstrategyBuyingPower} w={'30'}/>
                        <Button onClick={(event) => { event.preventDefault(); addStrategyToUser(name, strategyBuyingPower, userId)}}  >
                            set {formattedName} strategy
                        </Button>
                    </Box>


                </Center>
                )}




        </Box>
    )
}

export default StrategyPage;

{
  /* 3 months profit: {Number(currentAccountValue[0]).toFixed(2)},
6 months profit: {Number(currentAccountValue[1]).toFixed(2)}, 
1 Year profit: {Number(currentAccountValue[2]).toFixed(2)} */
}