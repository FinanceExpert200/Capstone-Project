import * as React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Trade.css";
//import Trade from "../../TradingCalculations/Trade.js"
//import Trading from "../../TradingCalculations/Trade.js";
import { Text, Box, Center, Stack } from '@chakra-ui/react'

export default function Trade({
  updateStockPrice,
  tickers,
  stockData
}) {
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);
  //UNDO THIS
  //console.log("ticker", tickers);
  const handleRefresh = async () => {
    updateStockPrice(tickers);
  };


  return (

    <Center
      position={'absolute'}
      w={'full'}
      h={'100vh'}
      bgColor={'#000409'}

    >
      <Stack direction={'column'}>
        <Text as='h1' color="#00f008">
          Start Trading!
        </Text>
        <Text as='h1' color='whiteSmoke'>
          Choose from the following companies
        </Text>
        <Box>
          <Stack direction={'row'}>
            {Object.keys(stockData).map((stockId) => (
              <Link to={stockId} key={stockId}>
                <Box borderColor={'green'} borderWidth={3} borderRadius={10} p={5}>
                  <Text color={'#00f008'} as={'h1'}>
                    {stockData[stockId].stockName}
                  </Text>
                  <Center fontSize={'30px'} color={'white'}>
                    $ {stockData[stockId].stockPrice.toFixed(2)}
                  </Center>

                </Box>
              </Link>
            ))}

          </Stack>
        </Box>
        <Center>
        <form className="refresh-form" onSubmit={(event) => handleRefresh(event)} >
          <button type="submit" className="refresh-button" >
            <Text color={'white'}>Refresh</Text>
          </button>
        </form>

        </Center>

      </Stack>
    </Center>

  );
}
