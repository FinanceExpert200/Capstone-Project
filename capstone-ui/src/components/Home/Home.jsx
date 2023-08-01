import React from "react";
import "./Home.css";
import { useEffect, useState, useContext } from "react";
import { Grid, Text, Flex, Center, Box, GridItem, Stack, Container, Button } from '@chakra-ui/react'
import axios, { all } from "axios";
import StockGraph from "../Graph/StockGraph";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"
//import MovingAverageCrossover from '../../TradingCalculations/MovingAverageCrossover.js'
import MovingAverageCrossover from '../../TradingCalculations/MovingAverageCrossover.js'
import Divergence from "../../TradingCalculations/Divergence";
import Utilities from "../../TradingCalculations/Utilities"
// import { ThemeContext } from "../App/App";

const Home = ({ getProfile, getAccount, getPortfolio, pastStockPrice, portfolio, profile, account, historicalData, tickers, fixedDate, strategyBuyingPower,setStrategyBuyingPower,strategy, getStrategy, removeStrategy}) => {
  const [metaData, setMetaData] = useState([]);
  const [amznData, setAmznData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [crmData, setCrmData] = useState([]);


  // const theme = useContext(ThemeContext);


  const [test, setTest] = useState();
  useEffect(() => {
    getProfile();
    getAccount();
    getPortfolio();
    getStrategy();
  }, []);

  //gathers the individual stocks together as sets

  useEffect(() => {

    if (portfolio != null) {
      const stockCard = portfolio.map((item) => (
        <Box borderRadius={30} borderWidth={3} borderColor={'green.500'} p={3}>
          <Text color='green.500' fontWeight={'bold'} fontSize={'40px'}>{item.ticker}</Text>
          <Text color={'grey'} fontSize={15}>Purchased on: {fixedDate(item.created_at)}</Text>
          <Text fontSize={25} color={'green.100'}>{item.quantity}</Text>
        </Box>
      ))
      setTest(stockCard)
    }

  }, [test])
  //console.log("THE POPULATED: ", test)

  const runTest = async () =>{
    console.log("Strategy", strategy)
    await Utilities.runCurrentStrategy(strategy)


  }


  return (
    <Box
      position={'absolute'}
      w={'full'}
      bgColor={'#171923'}
      fontWeight={'light'}
    >
      {profile && account && portfolio && historicalData ? (
        <Stack direction={'row'} padding={20} w={'full'} >
          <Button onClick={runTest}>test</Button>
          <Stack direction={'column'}
            p={1}

          >
            {portfolio.length ? (

              <Box >
                <Text as={'h1'} color={'whitesmoke'}> Stocks Available</Text>
                {portfolio.map((item, key) => (
                  <Box borderRadius={25}   bgColor={'#111214'} p={3} mb={5}>
                    <Text align={'center'} color='#04e168' fontWeight={'bold'} fontSize={'50px'}>{item.ticker}</Text>
                    <Text color={'white'} fontSize={'20px'}>Purchased on: {fixedDate(item.created_at)}</Text>
                    <Text mr={3} align={'right'} fontSize={'35px'} color={'green.300'}>{item.quantity}</Text>
                  </Box>
                ))}

              </Box>
            ) : (
              <Stack direction="column" alignItems={'center'} p={10} color={'white'}>
                <Text>No stock available</Text>
                <Button bgColor={'green.400'} onClick={(event) => { window.location.href = "/trade" }}>
                  Start Trading!
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack direction={'column'} w={'full'} ml={10}>
            <Box >
              <Stack direction={'row'} color={'#cccbcc'}  >
                <Text fontSize={'60px'} color={'white'}>
                  Welcome Back, {profile.firstName} !
                </Text>
              </Stack>
              <Text fontSize={'30px'} color={'white'}>
                Here are your stats for today:
              </Text>
            </Box>
            <Stack direction={'row'} >

              <Container width={'30%'} fontSize={'18'} borderRadius={15}   bgColor={'#111214'}>
                <Text fontWeight={'medium'} color={'white'}>Total Amount: </Text>
                <Stack direction={'row'} justifyContent={'center'} fontSize={'40'} fontWeight={'medium'}>
                  <Text color={'#00f008'}>$</Text>
                  <Text  color={'#00f008'}>
                    {account.acc_value}
                  </Text>
                </Stack>
              </Container>

              <Container width={'30%'} fontSize={'18'} borderRadius={15}  bgColor={'#111214'}>
                <Text fontWeight={'medium'} fontSize={'18'} color={'white'} >Buying Power: </Text>
                <Stack direction={'row'} justifyContent={'center'} fontSize={'40px'} fontWeight={'medium'} >
                  <Text color={'#00f008'}>$</Text>
                  <Text color={'#00f008'}>{account.buying_power}</Text>
                </Stack>
              </Container>
            </Stack>

            <Stack direction={'row'}>

              {strategy && <Container><Container width={'30%'} fontSize={'18'} borderRadius={15}   bgColor={'#111214'}>
                <Text fontWeight={'medium'} textDecoration={'underline'} color={'white'}>Strategy: </Text>
                <Button bgColor={'green.400'} onClick={(event) => {removeStrategy()}}>
                  Remove Strategy
                </Button>
                <Stack direction={'row'} justifyContent={'center'} fontSize={'40'}>
                  <Text color={'#00f008'}>
                    {strategy.strategy_name}
                  </Text>
                </Stack>
              </Container>

              <Container width={'30%'} fontSize={'18'} borderRadius={15}  bgColor={'#111214'}>
                <Text fontWeight={'medium'} fontSize={'18'} color={'white'} textDecoration={'underline'}>Strategy Buying Power: </Text>
                <Stack direction={'row'} justifyContent={'center'} fontSize={'40px'}  >
                  <Text color={'#00f008'}>$</Text>
                  <Text color={'#00f008'}>{strategy.buying_power}</Text>
                </Stack>
              </Container>
              </Container> }
              </Stack>


            <StockGraph priceList={historicalData} />

          </Stack>

        </Stack>

      ) : (
        <Center w={'full'}
          h={'100vh'}
          color={'white'}
        >
          <Button
            isLoading
            loadingText='Loading'
            colorScheme='teal'
            variant='outline'
            spinnerPlacement='start'
          >
          
          </Button>

        </Center>
      )}



    </Box>






  );
};

export default Home;