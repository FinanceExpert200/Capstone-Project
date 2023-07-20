import React from "react";
import "./Home.css";
import { useEffect, useState } from "react";
import {Grid, Flex,Center,Box, GridItem, Text, Stack, Container, Button} from '@chakra-ui/react'
import axios, { all } from "axios";
import StockGraph from "./StockGraph";

const Home = ({getProfile,getAccount, getPortfolio, pastStockPrice, portfolio, profile, account, historicalPrice, tickers}) => {
  const [metaData, setMetaData] = useState([]);
  const [amznData, setAmznData] = useState([]);
  const [googleData, setGoogleData] = useState([]);
  const [crmData, setCrmData] = useState([]);
  // const [nflxData, setNflxData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [test,setTest] = useState([]);

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

  return (
        <Box 
          w={'full'}
          h={'100vh'}
          bgGradient={[
            'linear(to-b, green.400, black)',
          ]}
          
          >
          {profile && account && data.length ? (
            <Stack direction={'row'} padding={20} w={'full'} >
              <Stack direction={'column'} p={'10'} 
                     bgColor={'green.700'}
                     borderRadius={10}>

                <Stack direction={'row'} fontWeight={'medium'} fontSize={50} fontFamily={'Arial'}>
                <Text >
                  Welcome 
                </Text>
                <Text>
                {profile.firstName}
                </Text>
                </Stack>

                <Box>
                  <Text fontWeight={'medium'} textDecoration={'underline'}>Total Amount: </Text>
                  <Stack direction = {'row'} justifyContent={'center'} fontSize={'40'}>
                    <Text>$</Text>
                    <Text >      
                        {account.acc_value}
                    </Text>
                    
                  </Stack>
                </Box>

                <Box>
                  <Text fontWeight={'medium'} textDecoration={'underline'}>Buying Power: </Text>
                  <Stack direction = {'row'} justifyContent={'center'} fontSize={'40'}>
                    <Text>$</Text>
                    <Text >      
                      {account.buying_power}
                    </Text>
                    
                  </Stack>
                </Box>
          
            {portfolio.length ? (
               <Text>
                 The list is available
               </Text>
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
                <Box>
                  The wacther and graph
                </Box>
               
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