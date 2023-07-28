
import React from "react";
import "./TradingStrategies.css";

import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Text,
  Center,
  Flex,
  Image,
  Box,
  Stack,
  Square,
  Container,
  Button,
  Heading,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import { color } from "framer-motion";
// import { Link } from "react-router-dom";



const TradingStrategies = () => {
  return (
    <Center
      position={'absolute'}
      w={'full'}
      h={'100vh'}
      bgColor={'#000409'}
      color={'white'}
      fontWeight={'light'}
      fontSize={'1cm'}
      display={'flex'}
    >
      <Flex flexDirection={'column'} ml={'400px'} mr={'400px'} w={'full'}>
        <Square>
          <Heading fontSize={'5rem'}>Trading Strategies</Heading>
          <Text ml={1}>Learn More</Text>
        </Square>

        <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
          <TabList p={1} >
            <Tab >Moving Average Crossover</Tab>
            <Tab>Mean Reversion</Tab>
            <Tab>RSI Divergence</Tab>
            <Tab>Pairs Trading</Tab>
          </TabList>

          <TabPanels >
            <TabPanel>
              <Flex direction={'column'} justify={'space-between'} align={'center'}>
                <Text >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Aliquam purus sit amet luctus venenatis lectus. Purus gravida quis blandit turpis cursus in hac.
                  </Text>
                  <Link as={RouterLink} to="/strategies/movingaveragecrossover">
                    <Button fontSize={'20px'} _hover={{ bg: 'green.500' ,color:'white' }}>Moving Average Crossover</Button>
                  </Link>               
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex direction={'column'} justify={'space-between'} align={'center'}>
                  <Text >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Aliquam purus sit amet luctus venenatis lectus. Purus gravida quis blandit turpis cursus in hac.
                    </Text>
                  <Link as={RouterLink} to="/strategies/meanreversion">
                    <Button fontSize={'20px'} _hover={{ bg: 'green.500' ,color:'white' }}>Mean Reversion</Button>
                  </Link>
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex direction={'column'} justify={'space-between'} align={'center'}>
                  <Text >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Aliquam purus sit amet luctus venenatis lectus. Purus gravida quis blandit turpis cursus in hac.
                    </Text>
                  <Link as={RouterLink} to="/strategies/divergence">
                    <Button fontSize={'20px'} _hover={{ bg: 'green.500' ,color:'white' }}>RSI Divergence</Button>
                  </Link>
           
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex direction={'column'} justify={'space-between'} align={'center'}>
                <Text >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Aliquam purus sit amet luctus venenatis lectus. Purus gravida quis blandit turpis cursus in hac.
                </Text>
                  <Link as={RouterLink} to="/strategies/pairstrading">
                    <Button fontSize={'20px'} _hover={{ bg: 'green.500' ,color:'white' }}>Pairs Trading</Button>
                  </Link>

              </Flex>
            </TabPanel>
          </TabPanels>


        </Tabs>
      </Flex>




    </Center>
  );
};

export default TradingStrategies;
