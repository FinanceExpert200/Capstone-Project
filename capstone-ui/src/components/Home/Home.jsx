import React from "react";
import "./Home.css";
import { useEffect, useRef } from "react";

import {Grid, Flex,Center,Box, GridItem, Text, Stack, Container, Button} from '@chakra-ui/react'
import axios from "axios";
import StockGraph from "./StockGraph";

const Home = ({getProfile,getAccount, getPortfolio, pastStockPrice, portfolio, profile, account, historicalPrice}) => {
  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate()- 30);

  useEffect(()=> {
    getProfile();
    getAccount();
    getPortfolio();
    pastStockPrice(rangeDate);

  },[]);
  

  console.log("NAME: " , historicalPrice)
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
                {historicalPrice ? (
                  <StockGraph priceList={historicalPrice}/>
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
      
      // <Grid
      //   templateAreas={`"profile graph"`}
      //   h='100vh'
      //   w={'full'}
      //   templateRows='repeat(1, 1fr)'
      //   templateColumns='repeat(2, 1fr)'
      //   p={55}
      // >
      //   <GridItem rowSpan={1} 
      //             area= {'profile'}
      //             bg= {'transparent'} 
      //             borderRadius={30}
      //             p={10}
                  
      //             >
      //     <Stack direction={'column'} 
      //            bg = {'#D6D5C9'}
                 
      //            p= {10}>
      //     <span></span>
      //     <Center>           
      //       Welcome {profile.firstName}
      //     </Center>
      //     <Box >
      //       <h1>Total Amount: </h1>
      //       <Center>{account.acc_value}</Center>
      //     </Box>
      //     <Box >
      //       <h1>Buying Amount: </h1>
      //       <Center>{account.buying_power}</Center>
      //     </Box>
          
      //     {!portfolio ? (
      //         <Text>
      //           The list is available
      //         </Text>
      //     ):(
      //         <Box>
      //           No stock available
      //         </Box>
      //     )}
          

      //     </Stack>

      //   </GridItem>
      //   <GridItem rowSpan={1} >
      //     <Stack direction={'column'} justify={'sapce-between'}>
      //       <Stack bgColor={'grey'}
      //             >
      //               <Box>
      //                 Timer here it will grow 
      //               </Box>
      //               <Box>
      //                 here
      //               </Box>
            
      //       </Stack>
      //       <Stack bgColor={'red'}>
      //         <Box>here</Box>
      //       </Stack>

      //     </Stack>
      //   </GridItem>
      
      // </Grid>