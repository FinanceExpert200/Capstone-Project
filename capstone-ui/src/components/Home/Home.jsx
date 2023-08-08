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
  Modal, 
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import axios, { all } from "axios";
import StockGraph from "../Graph/StockGraph";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js";
//import MovingAverageCrossover from '../../TradingCalculations/MovingAverageCrossover.js'
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js";
import Divergence from "../../TradingCalculations/Divergence.js";
import Utilities from "../../TradingCalculations/Utilities.js";
import ClickPopover from "../Popover/Popover"
// import { ThemeContext } from "../App/App";
// importy history

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
  strategyBuyingPower,
  setStrategyBuyingPower,
  strategy,
  getStrategy,
  removeStrategy,
  metaAVGBuyPrice,
  crmAVGBuyPrice,
  nflxAVGBuyPrice,
  amznAVGBuyPrice,
  googlAVGBuyPrice
}) => {
  const [metaData, setMetaData] = useState([]);
  const [amznData, setAmznData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [crmData, setCrmData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
  let formattedStrategyName = "";


  useEffect(() => {
    tickers.forEach(async (ticker) => {
      if (portfolio) {
        // Find the dictionary with the given ticker in the portfolio list
        const tickerIndex = portfolio.findIndex(
          (item) => item.ticker === ticker
        );
        console.log("tickerIndex", tickerIndex);

        // If the ticker exists in the list, add the get_avg_buy_price value to the dictionary
        if (tickerIndex !== -1) {
          console.log("specific ticker", portfolio[tickerIndex]);
          console.log("tryna add", portfolio[tickerIndex].avgBuyPrice);
          if (ticker === "CRM")
            portfolio[tickerIndex].avgBuyPrice = crmAVGBuyPrice;
          else if (ticker === "AMZN")
            portfolio[tickerIndex].avgBuyPrice = amznAVGBuyPrice;
          else if (ticker === "GOOGL")
            portfolio[tickerIndex].avgBuyPrice = googlAVGBuyPrice;
          else if (ticker === "META")
            portfolio[tickerIndex].avgBuyPrice = metaAVGBuyPrice;
          else if (ticker === "NFLX")
            portfolio[tickerIndex].avgBuyPrice = nflxAVGBuyPrice;

        }

      } else {
        console.log("Portfolio is null or empty.");
      }
    });
  }, [portfolio, metaAVGBuyPrice]);

  // portfolio["AMZN"].get_avg_buy_price = amznAVGBuyPrice;

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
    const runCurrentStrategy = async () => {
      if (strategy) {
        setIsLoading(true);
        await Utilities.runCurrentStrategy(strategy);
        // Below calls will wait until runCurrentStrategy has finished
        await getAccount();
        setIsLoading(false);
      }
    };
    runCurrentStrategy();
  }, [strategy]);
 

  //gathers the individual stocks together as sets

  useEffect(() => {
    if (portfolio != null) {
      const stockCard = portfolio.map((item) => (
        <Box borderRadius={30} borderWidth={3} borderColor={"green.500"} p={3}>
          <Text color="green.500" fontWeight={"bold"} fontSize={"40px"}>
            {item.ticker}
          </Text>
          <Text color={"grey"} fontSize={15}>
            Purchased on: {fixedDate(item.created_at)}
          </Text>
          <Text fontSize={25} color={"green.100"}>
            {item.quantity}
          </Text>
        </Box>
      ));
      setTest(stockCard);
    }
  }, [test]);

  
  
  //console.log("THE POPULATED: ", test)
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
        break
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
  console.log("THE STRATEGY IS ADDED HERE: ", strategy)
  return (
    <Box
      position={"absolute"}
      w={"full"}
      bgColor={'#ecf2f3'}
      textColor={'#03314b'}
      fontWeight={"light"}
    >


      {profile && account && portfolio && historicalData ? (
        <Stack direction={"row"} padding={20} w={"full"}>
          <Stack direction={"column"} p={1}>
            {portfolio.length ? (
              <Box>
                <Text fontSize={"25px"} >
                  {" "}
                  <ClickPopover word = "Stocks Owned Section" display = "Stocks Owned" color = "#03314b" description={"Here you can see the stocks you currently own (Also known as your portfolio). Click on the Trade page to buy and sell stocks"}  />
                </Text>
                {portfolio.map((item, key) => (
                  <Link to={`/trade`} key={item.ticker}>
                    <Box borderRadius={10} borderWidth={3} borderColor={'#90abad'} p={3} mb={5}  >
                      <Text
                        align={"center"}
                        bgColor={'#ecf2f3'}
                        fontWeight={"bold"}
                        fontSize={"50px"}
                      >
                        {item.ticker}
                      </Text>
                      <Flex direction={'row'} justify={'space-between'}>
                        <Text
                          fontSize={"25px"}
                        >
                          Quantity:
                        </Text>
                        <Text fontSize={"25px"}>
                          {item.quantity}
                        </Text>


                      </Flex>

                    </Box>
                  </Link>
                ))}
              </Box>
            ) : (
              <Stack
                direction="column"
                alignItems={"center"}
                p={10}
                color={"white"}
              >
                <Text>No stocks owned</Text>
                <Button
                  bgColor={"green.400"}
                  onClick={(event) => {
                    window.location.href = "/trade";
                  }}
                >
                  Start Trading!
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack direction={"column"} w={"full"} ml={10}>
            <Box bgColor={'#03314b'} minH={'30vh'} w={'full'} p={7}>
              <Flex direction={'row'} w={'full'} justify={'space-between'} textColor={'white'}>
                <Box>
                  <Stack direction={"row"} >
                    <Text fontSize={"60px"} >
                      Welcome back,{" "}
                      {profile.firstName.charAt(0).toUpperCase() +
                        profile.firstName.slice(1)}{" "}
                      !
                    </Text>
                  </Stack>
                  <Text fontSize={"30px"} >
                    Here are your stats for today:
                  </Text>
                </Box>
                {/* <Text>tester</Text> */}
                <Stack direction={"row"}>
              {strategy && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  fontSize={"20"}
                  borderRadius={15}
                  bgColor={"#ecf2f3"}
                  textColor={'#03314b'}
                  fontWeight={'light'}
                  p={3}
                  
                >
                  <Text
                    textDecoration={"underline"}

                  >
                    Strategy:{" "}
                  </Text>
                 
                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    mt={2}
                  >
                    <Text fontWeight={'medium'} color={"#1ecc97"}>{formattedStrategyName}</Text>
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
            <Container color='#edf0f5' p={4} w={'full'} mt={'-120px'} h={300} boxShadow={'0,2px,5px,rgba(0,0,0,0.2)'}>
              <Flex direction={'row'} justify={'space-between'}
                bgColor={'#edf0f5'} borderRadius={'5'}
                boxShadow={'20px 20px 90px grey'}>
                <Square w={'auto'} h={'200px'}
                  display={'flex'} flexDirection={'column'}

                  alignItems="center"
                >
                  (<Text color={'gray.500'} fontSize={25} fontWeight={'light'}>
                     <ClickPopover word="Account Value" display="Account Value" color={'grey.500'} description="The account value is your buying power and the current price of all your stocks added together. If you had $20 in your pocket and owned a salesforce stock, your account value would be $20 plus the current price of the stock" />{" "}
                  </Text>)
                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    fontSize={"40"}
                    fontWeight={"medium"}
                    textColor={'#1ecc97'}
                  >
                    
                    {isLoading ? (<Text>Calculating <Spinner /></Text> ): 
                    <Text >${account.acc_value}</Text>}
                  </Stack>
                </Square>

                <Box display="flex" alignItems="center">
                  <Divider orientation="vertical" h="100px" borderColor="gray.300" />
                </Box>

                <Square w={'auto'} h={'200px'}
                  display={'flex'} flexDirection={'column'}
                  justifySelf={'center'}
                >

                  <Text color={'gray.500'} fontSize={25}>
                    <ClickPopover word="Buying Power" display="Buying Power"
                      color={"grey.500"}
                      description="Buying power is the amount of money you have to buy stocks. If you had $20 and owned a salesforce stock, your buying power would be $20" />{" "}{" "}
                  </Text>
                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    fontSize={"40"}
                    fontWeight={"medium"}
                    textColor={'#1ecc97'}
                  >
                    <Text >$</Text>
                    <Text >{account.buying_power}</Text>
                  </Stack>

                </Square>

              </Flex>
            </Container>

            

            <StockGraph priceList={historicalData} />
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
