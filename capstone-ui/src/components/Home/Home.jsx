import React from "react";
import "./Home.css";
import { useEffect, useState } from "react";
import {Grid, Flex,Center,Box, GridItem, Text, Stack, Container, Button} from '@chakra-ui/react'
import axios, { all } from "axios";
import StockGraph from "./StockGraph";

const Home = ({getProfile,getAccount, getPortfolio, pastStockPrice, portfolio, profile, account, historicalPrice, tickers}) => {
  const [metaData, setMetaData] = useState([]);
  const [amznData, setAmznData] = useState([]);
  const [nflxData, setNflxData] = useState([]);
  //const [allData, setAllData] = useState([]);

  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate()- 30);

  useEffect(()=> {
    getProfile();
    getAccount();
    getPortfolio();
    //fetches the data from a promise 
    const fetchData = async () => {
      try {
        const meta = await pastStockPrice(tickers[0], rangeDate);
        const amzn = await pastStockPrice(tickers[1], rangeDate);
        const nflx = await pastStockPrice(tickers[2], rangeDate);
        setMetaData(meta);
        setAmznData(amzn);
        setNflxData(nflx);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  },[]);
  

  // console.log("Meta: " , metaData);
  // console.log("Amazon: " , amznData);
  // console.log("Netflix: " , nflxData);
  const allData = [metaData, amznData,nflxData];
  console.log("All Data: ", allData)
  return (
        <Box 
          w={'full'}
          h={'100vh'}
          bgGradient={[
            'linear(to-b, green.400, black)',
          ]}
          
          >
          {profile && account ? (
            <Stack direction={'row'} padding={20} w={'full'} >
              <Stack direction={'column'} p={'10'} 
                     bgColor={'#B2D3C2'}
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
          
            {!portfolio ? (
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
                {allData ? (
                  <StockGraph priceList={allData}/>
                ):(
                  <Text>Loading...</Text>
                )}
                

              </Stack>

            </Stack>
            
            ):(
              <Box>
              Loading...
            </Box>
          )}
          
          
          
        </Box>
        
        
        
        
        );
      };
      
      export default Home;