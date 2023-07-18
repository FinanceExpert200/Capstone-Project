import React from "react";
import TickerGraphs from "./TickerGraphs";
import { useEffect, useRef } from "react";
//import { Chart } from "chart.js";
import {Grid, Flex,Center,Box, GridItem, Stack} from '@chakra-ui/react'


const Home = ({getProfile,profile}) => {
  useEffect(()=> {
    console.log("Being used");
    getProfile();
  },[]);
  return (
    
        <Center 
          w={'full'}
          h={'100vh'}
          >
            <Grid
              templateAreas={`"profile graph"`}
              h='100vh'
              w={'full'}
              templateRows='repeat(1, 1fr)'
              templateColumns='repeat(2, 1fr)'
              p={55}
            >
              <GridItem rowSpan={1} area= {'profile'} >
                

              </GridItem>
              <GridItem rowSpan={1} >
                <Stack direction={'column'} justify={'sapce-between'}>
                  <Stack bgColor={'red'}
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
          
          
          
        </Center>
        
     


  );
};

export default Home;
