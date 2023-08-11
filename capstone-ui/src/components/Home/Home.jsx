import React from "react";
import "./Home.css";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import {
  Grid,
  Text,
  Flex,
  Center,
  Box,
  Heading,
  GridItem,
  Stack,
  Square,
  Divider,
  Container,
  Button,
  Spinner,
  useDisclosure,
  Wrap, WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import axios, { all } from "axios";
import StockGraph from "../Graph/StockGraph";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js";
//import MovingAverageCrossover from '../../TradingCalculations/MovingAverageCrossover.js'
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js";
import Divergence from "../../TradingCalculations/Divergence.js";
import Utilities from "../../TradingCalculations/Utilities.js";
import ClickPopover from "../Popover/Popover"
import UserPieChart from "../Graph/UsersPieChart";
// import { ThemeContext } from "../App/App";
// importy history

import {Link as RouterLink} from "react-router-dom"

const Home = ({
  getProfile,
  getAccount,
  getPortfolio,
  pastStockPrice,
  portfolio,
  profile,
  account,
  historicalData,
  tickers,
  fixedDate,
  pieChartData,
  bo,
  strategyBuyingPower,
  setStrategyBuyingPower,
  strategy,
  getStrategy,
  removeStrategy,
  metaAVGBuyPrice,
  crmAVGBuyPrice,
  nflxAVGBuyPrice,
  amznAVGBuyPrice,
  googlAVGBuyPrice,
}) => {
  const currDate = new Date();
  const [stockValues, setStockValues] = useState(null);
  const [pieChart, setPieChart] = useState([]);

  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
  let formattedStrategyName = "";

  const [test, setTest] = useState();
  useEffect(() => {
    const fetchDataAndRunStrategy = async () => {
      await getProfile();
      await getAccount();
      await getPortfolio();
      await getStrategy();

    };
    fetchDataAndRunStrategy();
  }, []);
  useEffect(() => {
    if (portfolio !== null) {
      console.log('I am here: ', portfolio)
      const stockValuesArray = portfolio.map((item) => ({
        ticker: item.ticker,
        quantity: item.quantity
      }));
      setStockValues(stockValuesArray);
    }
    //console.log('portfoliooo', stockValues)
  }, [portfolio])

  useEffect(() => {
    const runCurrentStrategy = async () => {
      if (strategy) {
        setIsLoading(true);
        try {
            await Utilities.runCurrentStrategy(strategy);
            await getAccount();
            await getPortfolio();
        } catch (error) {
            console.error("Error running strategy: ", error);
        } finally {
            setIsLoading(false);
        }
      }
    };
    runCurrentStrategy();
}, [strategy]);


  //gathers the individual stocks together as sets

  //console.log('portfoliooo: ', stockValues)

  const formatStrategyName = (name) => {
    switch (name) {
      case "meanreversion":
        formattedStrategyName = "Mean Reversion";
        break;
      case "movingaveragecrossover":
        formattedStrategyName = "Moving Average Crossover";
        break;
      case "divergence":
        formattedStrategyName = "Relative Strength Divergence";
        break;
      case "pairstrading":
        formattedStrategyName = "Pairs Trading";
        break;
      case "exponentialmovingaverage":
        formattedStrategyName = "Exponential Moving Average";
        break;

      default:
        break;
    }
  };

  if (typeof strategy !== "undefined" && strategy) {
    formatStrategyName(strategy.strategy_name);
  }
  function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (stockValues) {
      console.log('checker here: ', stockValues)
      const updatedPieChart = stockValues.map((stock) => {
        const tick = stock.ticker;
        const info = pieChartData.find((data) => data.ticker === stock.ticker);
        return { ticker: tick, name: info.name, quantity: stock.quantity, stockPrice: info.stockPrice * stock.quantity };
      });
      const buyingPower = { name: 'Buying Power', stockPrice: Number(bo) }
      console.log('THE ARRAY INDEX', buyingPower)
      setPieChart([buyingPower, ...updatedPieChart]);

    } else {
      const buyingPower = { name: 'Buying Power', stockPrice: Number(bo) }
      setPieChart([buyingPower])
    }

  }, [stockValues])
  console.log('check here: ', pieChart)
  return (
    <Box
      position={"absolute"}
      w={"full"}
      bgColor={"#ecf2f3"}
      textColor={"#03314b"}
      fontWeight={"light"}
    >
      {profile && account && portfolio && historicalData ? (
        <Stack direction={"row"} padding={20} w={"full"}>

          <Stack direction={"column"} w={"full"} ml={10}>
            <Box bgColor={"#03314b"} minH={"30vh"} w={"full"} p={7}>
              <Flex
                direction={"row"}
                w={"full"}
                justify={"space-between"}
                textColor={"white"}
              >
                <Box>
                  <Stack direction={"row"}>
                    <Text fontSize={"60px"}>
                      Welcome back,{" "}
                      {profile.firstName.charAt(0).toUpperCase() +
                        profile.firstName.slice(1)}{" "}
                      !
                    </Text>
                  </Stack>
                  <Text fontSize={"30px"}>Here are your stats for today:</Text>
                </Box>
                

                <Stack direction={"row"}>
                  {strategy && (
                    <Box
                      zIndex={5}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"17"}
                      borderRadius={15}
                      bgColor={"#ecf2f3"}
                      textColor={"#03314b"}
                      fontWeight={"light"}
                      p={1}
                      
                    >
                      <Text textDecoration={"underline"}>Strategy: </Text>

                      <Stack direction={"row"} justifyContent={"center"} mt={2}>
                        <Text fontWeight={"medium"} color={"#1ecc97"}>
                          {formattedStrategyName}
                        </Text>
                      </Stack>

                      <Box
                        width={"full"}
                        borderRadius={15}
                        mt={4}
                        align={'center'}

                      >
                        <Text
                          textDecoration={"underline"}
                        >
                          Strategy Buying Power:{" "}
                        </Text>
                        <Stack direction={"row"} justifyContent={"center"} mt={2} fontWeight={'medium'}>

                          {isLoading ? (
                            <Text> Checking for trades <Spinner /></Text> // replace this with your actual loading spinner
                          ) : (
                            <Text color={"#1ecc97"}>${strategy.buying_power}</Text>
                          )}
                        </Stack>
                      </Box>
                      <Button
                        bgColor={"green.400"}
                        onClick={(event) => {
                          removeStrategy();
                        }}
                        mt={2}
                        p={0}
                        mb={1}

                      >
                        Remove Strategy
                      </Button>
                    </Box>
                  )}

                </Stack>



              </Flex>
            </Box>
            {portfolio.length ? (
              <Flex 
                direction={"column"}
                bgColor={"#edf0f5"}
                borderRadius={"5"}
                textColor={'black'}
                boxShadow={"20px 20px 50px grey"}
                pt={1}
                pl={3}
                mt={"-60px"}
                ml={10}
                mr={10}
                mb={10}
                

              >
                <Text fontSize={"25px"}>
                  {" "}
                  <ClickPopover
                    word="Stocks Owned Section"
                    display="Stocks Owned"
                    color="#03314b"
                    description={
                      "Here you can see the stocks you currently own (Also known as your portfolio). Click on the Trade page to buy and sell stocks"
                    }
                  />
                </Text>
                <Flex
                  direction={"row"}
                  justify={"space-evenly"}
                >

                  {portfolio.map((item, key) => (
                    <Link to={`/trade`} key={item.ticker}>
                      <Box
                        p={3}
                        mb={5}
                        bgColor={"#edf0f5"}
                      >
                        <Text

                          fontWeight={'light'}
                          align={"center"}
                          bgColor={"#ecf2f3"}
                          fontSize={"50px"}
                        >
                          {item.ticker}
                        </Text>

                        <Flex direction={"row"} justify={"space-between"}>
                          <Text fontSize={"25px"} color={'gray.600'}
                            fontWeight={'light'}>Quantity: {item.quantity}</Text>
                          {/* <Text fontSize={"25px"}>
                          Average Buy Price:{" "}
                          {Number(item.avgBuyPrice).toFixed(2)}
                        </Text> */}
                        </Flex>
                      </Box>
                    </Link>


                  ))}



                </Flex>

              </Flex>
            ) : (
              <Stack
                alignItems={"center"}
                direction={"column"}
              >
                <Text>No stocks owned</Text>
                <Button
                  bgColor={"green.400"}
                  
                  as={Link}
                  to='/trade'

                >
                  Start Trading!
                </Button>
              </Stack>
            )}
            {pieChart ? (
              <Box w={'100%'} h={'90vh'}>
                <Heading>Breakdown of Account Value</Heading>
                <Box display={'flex'} direction={'row'} w={'full'} >
                  <UserPieChart stockData={pieChart} />
                  <Flex
                    direction={"row"}
                    justify={"space-evenly"}
                    bgColor={"#edf0f5"}
                    borderRadius={"5"}

                    w={'full'}

                  >
                    <Square

                      h={"200px"}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems="center"
                    >
                      <Text color={'gray.500'} fontSize={25} fontWeight={'light'}>
                        <ClickPopover word="Account Value" display="Account Value" color={'grey.500'} description="The account value is your buying power and the current price of all your stocks added together. If you had $20 in your pocket and owned a salesforce stock, your account value would be $20 plus the current price of the stock" />{" "}
                      </Text>
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        fontSize={"40"}
                        fontWeight={"medium"}
                        textColor={"#1ecc97"}
                      >

                        {isLoading ? (<Text>Calculating <Spinner /></Text>) :

                          <Text>${addCommasToNumber(account.acc_value)}</Text>
                        }
                      </Stack>
                    </Square>

                    <Box display="flex" alignItems="center">
                      <Divider
                        orientation="vertical"
                        h="100px"
                        borderColor="gray.300"
                      />
                    </Box>

                    <Square
                      w={"auto"}
                      h={"200px"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifySelf={"center"}
                    >
                      <Text color={"gray.500"} fontSize={25}>
                        <ClickPopover
                          word="Buying Power"
                          display="Buying Power"
                          color={"grey.500"}
                          description="Buying power is the amount of money you have to buy stocks. If you had $20 and owned a salesforce stock, your buying power would be $20"
                        />{" "}
                      </Text>
                      <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        fontSize={"40"}
                        fontWeight={"medium"}
                        textColor={"#1ecc97"}
                      >
                        <Text>$</Text>
                        <Text>{addCommasToNumber(account.buying_power)}</Text>
                      </Stack>
                    </Square>
                  </Flex>

                </Box>

              </Box>

            ) : (
              <Button
                isLoading
                loadingText="Loading"
                colorScheme="teal"
                variant="outline"
                spinnerPlacement="start"
              ></Button>
            )}
          </Stack>
        </Stack>
      ) : (
        <Center w={"full"} h={"100vh"} color={"white"} bgColor={"#171923"}>
          <Button
            isLoading
            loadingText="Loading"
            colorScheme="teal"
            variant="outline"
            spinnerPlacement="start"
          ></Button>
        </Center>
      )}
    </Box>
  );
};

export default Home;