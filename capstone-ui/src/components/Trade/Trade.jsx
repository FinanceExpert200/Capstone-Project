import * as React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Trade.css";
//import Trade from "../../TradingCalculations/Trade.js"
//import Trading from "../../TradingCalculations/Trade.js";
import { Text, Box, Button,Center,Container,Flex, Heading,Stack, useColorMode, useColorModeValue } from '@chakra-ui/react'
import StockGraph from "../Graph/StockGraph";

export default function Trade({
  updateStockPrice,
  tickers,
  stockData,
  account,
  historicalData
}) {
  console.log('DATAAAAA: ', historicalData)
  // useEffect(() => {
  //   updateStockPrice(tickers);
  // }, []);
  //UNDO THIS
  const handleRefresh = async () => {
    updateStockPrice(tickers);
  };

  const formattedStockName = (name) => {
    switch (name) {
      case "NFLX":
        return "Netflix";
      case "META":
        return "Facebook";
      case "CRM":
        return "Salesforce";

      case "AMZN":
        return "Amazon";
      case "GOOGL":
        return "Google";
      default:
        break;
    }
  };

  const Card = ({route,price,name}) => {
    return (
      <Box
        as='a'
        maxW={{base:'full',md:'275px'}}
        w={'full'}
        borderRadius={'lg'}
        borderWidth={3}
        borderColor={'#90abad'}
        overflow={'hidden'}
        p={1}
        href={`/trade/${route}`} 
          
        >
          <Stack align={'center'} spacing={2}>
            <Box mt={2} >
              <Heading fontSize={'50px'}>{name}</Heading>
              <Text>{formattedStockName(name)}</Text>
              {price && (
              <Text mt={1} fontSize={'25px'} color={'#1ecc97'}>${price.toFixed(2)}</Text>
              )}
            </Box>

          </Stack>

      </Box>
    )
  }

  return (
    
    <Center 
    p={4} 
    bgColor={'#ecf2f3'} 
    pos={'absolute'}
    w={'full'}
    h={'100vh'}
    textColor={'#03314b'}
    >
      {stockData && historicalData ? (
      <Flex direction={'row'} >
      <Stack as={Container} mt={20} ml={10}
             maxW={'full'} maxH={'80vh'}>
      <Heading>
        Historical Overview
      </Heading>
      <Text>Displays the opening prices from the past 30 days </Text>
      <StockGraph priceList={historicalData} />
      </Stack>

      <Stack spacing={4} as={Container} mt={20}
             maxW={'5xl'} textAlign={'center'} >
        <Heading fontWeight={'bold'} fontSize={'80px'} >
          Start Trading!
        </Heading>
        <Text  fontSize={'25'}>
         Choose from one of the following companies...
        </Text>

        <Container  maxW={'5xl'} mt={12}>
          <Flex flexWrap={'wrap'} gridGap={6} justify={'center'}>
          {Object.keys(stockData).map((stockId) => (
            
          
            <Card route={stockId} name={stockData[stockId].stockName} price={stockData[stockId].stockPrice} />
            
           
       
        ))}

          </Flex>

        </Container>

      </Stack>
      </Flex>

      ):(
        <Button
    isLoading
    loadingText='Loading'
    color='black'
    variant='outline'
    bgColor={'#ecf2f3'} 
  ></Button>
      )}

    </Center>

);
}

