import React from "react";
import "./Home.css";
import { useEffect, useState } from "react";
import {Grid,Text, Flex,Center,Box, GridItem, Text, Stack, Container, Button} from '@chakra-ui/react'
import axios, { all } from "axios";
import StockGraph from "./StockGraph";

const Home = ({getProfile,getAccount, getPortfolio, pastStockPrice, portfolio, profile, account, historicalPrice, tickers,fixedDate}) => {
  const [metaData, setMetaData] = useState([]);
  const [amznData, setAmznData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [crmData, setCrmData] = useState([]);
  // const [nflxData, setNflxData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [test,setTest] = useState();

  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate()- 30);

  const mergeArrays = (arr1, arr2, arr3, arr4) => {
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
  
  
    // Convert the data in the dataMap back to an array
    Object.keys(dataMap).forEach((date) => {
      mergedArray.push({ date, ...dataMap[date] });
    });
  
    return mergedArray;
  };

  useEffect(()=> {
    getProfile();
    getAccount();
    getPortfolio();
    //fetches the data from a promise 
    const fetchData = async () => {
      try {
        const meta = await pastStockPrice(tickers[0], rangeDate);
        const amzn = await pastStockPrice(tickers[1], rangeDate);
        const google = await pastStockPrice(tickers[3], rangeDate);
        const crm = await pastStockPrice(tickers[4], rangeDate);
        // const nflx = await pastStockPrice(tickers[2], rangeDate);

        setMetaData(meta);
        setAmznData(amzn);
        setGoogleData(google);
        setCrmData(crm);
        // setNflxData(nflx);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  },[]);
  
//gathers the individual stocks together as sets
  useEffect(() => {
    if (metaData.length > 0 && amznData.length > 0 && googleData.length > 0 && crmData.length > 0) {
      setAllData([metaData, amznData, googleData, crmData]);

    }
  }, [metaData, amznData, googleData, crmData]);
  const data = mergeArrays(metaData,amznData,googleData, crmData);
console.log("THE STOCK" , portfolio)
useEffect(()=>{
  if(portfolio != null){
    const stockCard = portfolio.map((item)=> (
      <Box borderRadius={30} borderWidth={3} borderColor={'green.500'} p={3}>
        <Text color='green.500' fontWeight={'bold'} fontSize={'40px'}>{item.ticker}</Text>
        <Text color={'grey'} fontSize={15}>Purchased on: {fixedDate(item.created_at)}</Text>
        <Text fontSize={25} color={'green.100'}>{item.quantity}</Text>
      </Box>
    ))
    setTest(stockCard)
  }
  
}, [test])
   console.log("THE POPULATED: ", test)
  return (
        <Box 
          position={'absolute'}
          w={'full'}
          bgColor={'#000409'}
          // bgGradient={[
          //   'linear(to-b, green.900, black)',
          // ]}
          
          >
          {profile && account && data.length ? (
            <Stack direction={'row'} padding={20} w={'full'} >
              <Stack direction={'column'} 
                     p={1}
                     >      
            {portfolio.length ? (
              
               <Box>
               {test}
               </Box>
            ):(
               <Stack direction="column" alignItems={'center'} p={10}>
                 <Text>No stock available</Text>
                 <Button bgColor={'green.400'} onClick={(event) => {window.location.href = "/trade"}}>
                  Start Trading!
                 </Button>
               </Stack>
            )}
              </Stack>
              <Stack direction={'column'} w={'full'}>
                <Box >
                <Stack direction={'row'} fontWeight={'medium'} color={'#cccbcc'} fontSize={60} fontFamily={'Arial'}>
                <Text color={'green.300'}>
                  Welcome
                </Text>
                <Text color={'green.300'}>
                {profile.firstName} !
                </Text>
                </Stack>
                <Text fontSize={20}color={'grey'}>
                  Here are your stats for today:
                </Text>
                </Box>
                <Stack direction={'row'}>

                  <Container width={'30%'}  fontSize={'18'} borderRadius={30} borderWidth={3} borderColor={'green.500'}>
                  <Text fontWeight={'medium'} textDecoration={'underline'} color={'grey'}>Total Amount: </Text>
                  <Stack direction = {'row'} justifyContent={'center'} fontSize={'40'}>
                    <Text color={'green.400'}>$</Text>
                    <Text color={'green.400'}>      
                        {account.acc_value}
                    </Text>
                  </Stack>
                  </Container>

                  <Container width={'30%'}  fontSize={'18'} borderRadius={30} borderWidth={3} borderColor={'green.500'}>
                  <Text fontWeight={'medium'} fontSize={'18'} color={'grey'} textDecoration={'underline'}>Buying Power: </Text>
                  <Stack direction = {'row'} justifyContent={'center'} fontSize={'40px'}>
                    <Text color={'green.400'}>$</Text>
                    <Text color={'green.400'}>{account.buying_power}</Text>
                  </Stack>
                  </Container>
                </Stack>
                
               
                <StockGraph priceList={data}/>

              </Stack>

            </Stack>
            
            ):(
              <Center  w={'full'}
              h={'100vh'}
              color={'white'}>
                <Text>Loading...</Text>
              </Center>
          )}
          
          
          
        </Box>
        
        
        
        
        );
      };
      
      export default Home;