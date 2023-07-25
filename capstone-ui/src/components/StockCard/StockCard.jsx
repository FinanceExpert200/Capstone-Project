// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";
import { Box, Button, Center, Flex, Grid, GridItem, Input,Image, Link,Text, Stack, Icon, Container } from '@chakra-ui/react'
import { ArrowUpIcon } from '@chakra-ui/icons'

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
  const [submission,setSubmission] = useState(null);
  console.log(stateForm);
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
      if(res.status === 201){
        setStateForm("reg")
        setSubmission( <Text color={'green.400'}>Your submission was placed successfully!</Text>);
      }
    } catch (err) {
      console.log(err);
      //must update the error message
      setSubmission(<Text color={'red.400'}>Your submission failed</Text>);
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

            <Image src={stockInfo.logo} w={100} h={100} borderRadius={'full'} bgColor={'white'}/>        
            <Text fontSize={70} color={'white'}>
              {stockInfo.stockName}
            </Text>
            <Text fontSize={20} mt={'13'} color={'white'}>{stockInfo.company}</Text>
            

          </Stack>
          <Stack direction={'row'} mt={5} ml={20}>
          <Text fontSize={45} color={'white'}> {stockInfo.stockPrice.toFixed(2)} USD</Text>
          {stockInfo.stockPercentage > 0 ? (
            <Stack direction={'row'} ml={5} mt={5}>
              <ArrowUpIcon color={'#00f008'} w={10} h={10}/>
              <Text fontSize={25} color={'#00f008'} > {stockInfo.stockPercentage.toFixed(2)} % </Text>

            </Stack>

          ):(
            <Text fontSize={25} color={'red'} mt={5} ml={10}> {stockInfo.stockPercentage} % </Text>

          )}

          </Stack>
        </GridItem>
        <GridItem pl='2' area={'main'} h={'100vh'}>
          <SingleStockGraph data={historicalData} dataName={stockInfo.stockName} />
        </GridItem>

        <GridItem pl='2' area={'nav'} h={'100vh'}>
          <Center 
            borderRadius={10}
            w={'full'}
            h={'100%'}
            display={'flex'}
            flexDirection={'column'}
            

          >
            <Stack direction={'row'} justifyContent={'center'} bgColor={'whitesmoke'} >
              <Link 
              onClick={(event) => {setSubmission(""),setStateForm("buy")}}  
              
              bgColor={stateForm ==="buy" ? ("green.400"):('whitesmoke')} 
              _hover={{ bg: 'green.400' ,  color:"white" }} 
              fontSize={'40px'} 
              color={'Black'} > Buy </Link>
              <Link 
              onClick={(event) => {setStateForm("sell")}} 
              
              bgColor={stateForm ==="sell" ? ("green.400"):('whitesmoke')}
              _hover={{ bg: 'green.400' ,  color:"white" }} 
              fontSize={'40px'} 
              color={'Black'}> Sell </Link>

            </Stack>

            <Stack direction={'column'} p={10}>
              <Text fontSize={'30px'} color={'green.500'}>Quantity</Text>
              <Input
                color={'white'}
                w={20}
                type="number"
                onChange={(event) => handleQuantityChange(event.target.value)}
              />

              <Text color={'white'}>Total Amount: </Text>

            </Stack>
            {submission && submission}
            {stateForm === "reg" ? (
              <Text color={'white'}>
                Choose a type above to start 
              </Text>

            ) : (
            

            <Button
              aligin={'center'}
              
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
              {stateForm.toString()}
            </Button>
            

            )}


          </Center>

        </GridItem>
        

      </Grid>
    </Flex>

  );
}
