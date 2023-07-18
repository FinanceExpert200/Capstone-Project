import React from "react";
import TickerGraphs from "./TickerGraphs";
import { useEffect, useRef } from "react";
//import { Chart } from "chart.js";
import {Grid, Flex,Center,Box, GridItem, Header, Text, Stack} from '@chakra-ui/react'


const Home = ({getProfile,getAccount, getPortfolio, portfolio, profile, account}) => {
  useEffect(()=> {
    getProfile();
    getAccount();
    getPortfolio();

  },[]);

  //console.log("NAME: " , profile.firstName)
  return (
        <Center 
          w={'full'}
          h={'100vh'}
          bg = {'#0A100D'}
          >
          {profile && account ? (
            <Grid
              templateAreas={`"profile graph"`}
              h='100vh'
              w={'full'}
              templateRows='repeat(1, 1fr)'
              templateColumns='repeat(2, 1fr)'
              p={55}
            >
              <GridItem rowSpan={1} 
                        area= {'profile'}
                        bg= {'#B9BAA3'} 
                        borderRadius={30}
                        p={10}
                        >
                <Stack direction={'column'} 
                       bg = {'#D6D5C9'}

                       p= {10}>
                <span></span>
                <Center>           
                  Welcome {profile.firstName}
                </Center>
                <Box >
                  <h1>Total Amount: </h1>
                  <Center>{account.acc_value}</Center>
                </Box>
                <Box >
                  <h1>Buying Amount: </h1>
                  <Center>{account.buying_power}</Center>
                </Box>
                
                {!portfolio ? (
                    <Text>
                      The list is available
                    </Text>
                ):(
                    <Box>
                      No stock available
                    </Box>
                )}
                

                </Stack>

              </GridItem>
              <GridItem rowSpan={1} >
                <Stack direction={'column'} justify={'sapce-between'}>
                  <Stack bgColor={'grey'}
                        >
                          <Box>
                            Timer here it will grow 
                          </Box>
                          <Box>
                            here
                          </Box>
                  
                  </Stack>
                  <Stack bgColor={'red'}>
                    <Box>here</Box>
                  </Stack>

                </Stack>
              </GridItem>
            
            </Grid>

          ):(
            <Box>
              Loading...
            </Box>
          )}
          
          
          
        </Center>
        
     


  );
};

export default Home;
