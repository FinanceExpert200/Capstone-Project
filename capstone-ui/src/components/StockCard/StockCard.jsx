// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";
import { Box,Button, Center,Input, Text, Stack } from '@chakra-ui/react'

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StockCard({
  updateStockPrice,
  tickers,
  stockData,
  currentUserId,
  acc_value
}) {
  const { stockId } = useParams();
  const stockInfo = stockData[stockId];

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
    <Center 
      w={'full'}
      h={'100vh'}
      bgColor={'#F5F5F5'}
      position={'absolute'}>

      {stockInfo && (
        <Stack direction={'row'}>
          <Stack direction={'column'}>
          <Text as={'h1'} >
          {stockInfo.stockName}
          </Text>
          <Text>
          {stockInfo.stockPrice}
          </Text>
          <Box>
            AQUI IDEALMENTE EL GRAPHICO
          </Box>

          </Stack>
          <Box bgColor={'#000409'}
               p={5}>

            <div className="buy-component">
              <Button
                onClick={(event) =>
                  addTransaction(
                    event,
                    stockInfo.stockName,
                    quantity,
                    stockInfo.stockPrice,
                    "buy"
                  )
                }
              >
                Buy
              </Button>
              <Button
                onClick={(event) =>
                  addTransaction(
                    event,
                    stockInfo.stockName,
                    quantity,
                    stockInfo.stockPrice,
                    "sell"
                  )
                }
              >
                Sell
              </Button>
              <div>
                <Text fontSize={'30px'} color={'green.500'}>Quantity</Text>
                <Input
                  color={'grey.300'}
                  w={20}
                  type="number"
                  onChange={(event) => handleQuantityChange(event.target.value)}
                />
              </div>
            </div>
            <Text color={'white'}>Total Amount: </Text>
          </Box>



        </Stack>
      )}

    </Center>
  );
}
