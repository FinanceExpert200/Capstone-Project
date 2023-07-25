// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";
import { Box, Button, Center, Flex, Grid, GridItem, Input, Link,Text, Stack, Icon, Container } from '@chakra-ui/react'

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleStockGraph from "../Graph/SingleStockGraph";

export default function StockCard({
  updateStockPrice,
  tickers,
  stockData,
  currentUserId,
  historicalData,
  acc_value
}) {
  const [stateForm, setStateForm] = useState("reg");
  console.log(stateForm);
  const { stockId } = useParams();
  const stockInfo = stockData[stockId];
  console.log("data", historicalData);
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    setQuantity(parsedQuantity);
  };

  // updates the stock price on the page as you open it
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);

  const addTransaction = async (
    event,
    ticker,
    quantity,
    curr_price,
    trans_type
  ) => {
    try {
      event.preventDefault();

      updateStockPrice(tickers);

      const res = await axios.post(`http://localhost:3001/trans/${trans_type}`, {
        ticker: ticker,
        quantity: quantity,
        curr_price: curr_price,
        user_id: currentUserId,
        trans_type: trans_type,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //UNDO THIS
  console.log("transaction history", stockInfo);

  // here will be some sort of function that displays the stock graph, and just overall infromation based on the stock id that is passed
  return (
    <Flex w={'full'}
      position={'fixed'}
      bgColor={'#000409'}
    >
      <Grid
        templateAreas={`
        "header nav"
        "main nav"
      `}
        w={'full'}
        h={'100vh'}
        gridTemplateRows={'1fr'}
        gridTemplateColumns={'4fr  2fr'}
        gap='1'
        p={20}
        color='blackAlpha.700'
        fontWeight='bold'

      >
        <GridItem h={'20vh'} pl='5' area={'header'} borderBottom={'1px'}>
          <Stack direction={'row'}>
            
            <Text as={'h1'} color={'white'}>
              {stockInfo.stockName}
            </Text>
            <Text fontSize={20} mt={'6'} color={'white'}>Apple.Inc</Text>

          </Stack>
          <Text fontSize={25} color={'white'}> {stockInfo.stockPrice} USD </Text>
        </GridItem>
        <GridItem pl='2' area={'main'} h={'100vh'}>
          <SingleStockGraph data={historicalData} dataName={stockInfo.stockName} />
        </GridItem>

        <GridItem pl='2' area={'nav'} h={'100vh'}>
          <Stack 
            borderRadius={10}
            w={'full'}
            h={'100%'}
            p={10}
            justify={'center'}

          >
            <Center direction={'row'}  >
              <Link onClick={(event) => {
                setStateForm("buy")

              }}  p={2} bgColor={'whitesmoke'} _hover={{ bg: 'green.400' ,  color:"white" }} fontSize={'40px'} color={'Black'} > Buy </Link>
              <Link 
              onClick={(event) => {setStateForm("sell")}} 
              p={2} bgColor={'whitesmoke'} 
              _hover={{ bg: 'green.400' ,  color:"white" }} 
              fontSize={'40px'} 
              color={'Black'}> Sell </Link>

            </Center>

            <Stack direction={'column'}>
              <Text fontSize={'30px'} color={'green.500'}>Quantity</Text>
              <Input
                color={'grey.300'}
                w={20}
                type="number"
                onChange={(event) => handleQuantityChange(event.target.value)}
              />

              <Text color={'white'}>Total Amount: </Text>

            </Stack>
            {stateForm === "reg" ? (
              <Text>

              </Text>

            ) : (
            <Container>

            <Button
              onClick={(event) =>
                addTransaction(
                  event,
                  stockInfo.stockName,
                  quantity,
                  stockInfo.stockPrice,
                  stateForm.toString()
                )
              }
            >
              {stateForm.toUpperCase()}
            </Button>
            </Container>

            )}


          </Stack>

        </GridItem>
        

      </Grid>
    </Flex>

  );
}
