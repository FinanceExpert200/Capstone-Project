import * as React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Trade.css";
//import Trade from "../../TradingCalculations/Trade.js"
//import Trading from "../../TradingCalculations/Trade.js";
import { Text, Box, Button,Center,Container,Flex, Heading,Stack, useColorMode, useColorModeValue } from '@chakra-ui/react'

export default function Trade({
  updateStockPrice,
  tickers,
  stockData
}) {
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);
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
        bg={useColorModeValue('green.600')}
        borderRadius={'lg'}
        overflow={'hidden'}
        p={5}
        href={`/trade/${route}`}       
        >
          <Stack align={'center'} spacing={2}>
            <Box mt={2} textColor={'white'}>
              <Heading fontSize={'50px'}>{name}</Heading>
              <Text>{formattedStockName(name)}</Text>
              {price && (
              <Text mt={1} fontSize={'25px'}>${price.toFixed(2)}</Text>
              )}
            </Box>

          </Stack>

      </Box>
    )
  }

  return (
    
    <Center 
    p={4} 
    bgColor={'#171923'} 
    pos={'absolute'}
    w={'full'}
    h={'100vh'}
    >
      {stockData ? (

      <Stack spacing={4} as={Container} mt={20}
             maxW={'5xl'} textAlign={'center'} >
        <Heading color={'white'}  fontWeight={'bold'} fontSize={'80px'} bgGradient="linear(to-l, green.100, green)"
        bgClip="text">
          Start Trading!
        </Heading>
        <Text color={'white'} fontSize={{base:'sm', sm:'lg'}}>
         Choose from the following companies...
        </Text>

        <Container  maxW={'5xl'} mt={12}>
          <Flex flexWrap={'wrap'} gridGap={6} justify={'center'}>
          {Object.keys(stockData).map((stockId) => (
            
          
            <Card route={stockId} name={stockData[stockId].stockName} price={stockData[stockId].stockPrice}/>
            
           
       
        ))}

          </Flex>

        </Container>

      </Stack>
      ):(
        <Button
    isLoading
    loadingText='Loading'
    color='white'
    variant='outline'
  ></Button>
      )}

    </Center>

);
}

{/* <Center
  position={'absolute'}
  w={'full'}
  h={'100vh'}
 
  >
  {stockData ? (
  <Stack direction={'column'}>
    <Text as='h1' color="#00f008">
      Start Trading!
    </Text>
    <Text as='h1' color='whiteSmoke'>
      Choose from the following companies
    </Text>
    <Box>
      <Stack direction={'row'}>
        <Card></Card>
        {Object.keys(stockData).map((stockId) => (
          <Link to={stockId} key={stockId}>
            <Box borderColor={'green'} borderWidth={3} borderRadius={10} p={5}>
              <Text color={'#00f008'} as={'h1'}>
                {stockData[stockId].stockName}
              </Text>
              {stockData[stockId].stockPrice && (

              <Center fontSize={'30px'} color={'white'}>
                $ {stockData[stockId].stockPrice.toFixed(2)}
              </Center>
              )}

            </Box>
          </Link>
        ))}

      </Stack>
    </Box>

  </Stack>

  ):(
    <Button
    isLoading
    loadingText='Loading'
    color='white'
    variant='outline'
  ></Button>

  )}
</Center> */}