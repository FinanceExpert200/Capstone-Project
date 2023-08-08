// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Input,
  Image,
  Link,
  Text,
  Stack,
  Square,
  Container,
  useBoolean,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon} from "@chakra-ui/icons";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleStockGraph from "../Graph/SingleStockGraph";
import PopupConfirmation from "./PopupConfirmation";
import Popover from "../Popover/Popover"
import { object } from "prop-types";



export default function StockCard({
  updateStockPrice,
  tickers,
  stockData,
  currentUserId,
  historicalData,
  account,
  getAccount,
  getPortfolio,
  portfolio
}) {
  const [stateForm, setStateForm] = useState("reg");
  const [submission, setSubmission] = useState(false);
  const { stockId } = useParams();
  const stockInfo = stockData[stockId];

  

  const [quantity, setQuantity] = useState(0);
  const [totalPrice,setTotalPrice] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0)
  const [disableButton, setDisableButton] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [currTickerQuantity, setCurrTickerQuantity] = useState(0)


  const getCurrentQuantity = () =>{
    console.log("Show")
    console.log(portfolio)
    if(portfolio){
      let objectWithTicker = portfolio.find(item => item.ticker === stockInfo.stockName);
      console.log("NFLX S")
      console.log(stockInfo.stockName)
      console.log(objectWithTicker)
      if(objectWithTicker && objectWithTicker.quantity > 0){
        console.log("quantity set")
        setCurrTickerQuantity(objectWithTicker.quantity)
      } else{
        setCurrTickerQuantity(0)
      }
    }
  }

  const handleQuantityChange = (quantity) => {
    if (account && portfolio && stockInfo) {
      let objectWithTicker = portfolio.find(
        (item) => item.ticker === stockInfo.stockName
      );

      let parsedQuantity = Math.floor(parseInt(quantity, 10));

      // Check if the quantity is negative
      if (parsedQuantity < 0) {
        parsedQuantity = 0;
      }

      setQuantity(parsedQuantity);

      if (parsedQuantity > 0) {
        setTotalPrice((parsedQuantity * stockInfo.stockPrice).toFixed(2));
        if (stateForm.toString() == "buy") {
          const newBuyingPower = (
            parseFloat(account.buying_power) -
            parsedQuantity * stockInfo.stockPrice
          ).toFixed(2);
          setBuyingPower(newBuyingPower);

          if (newBuyingPower < 0) {
            setSubmission(false);
            setDisableButton(true);
            setErrorMsg(
              "You do not have enough buying power to complete this purchase."
            );
          } else {
            setDisableButton(false);
            setErrorMsg("");
          }
        }
        if (stateForm.toString() == "sell") {
          const newBuyingPower = (
            parseFloat(account.buying_power) +
            parsedQuantity * stockInfo.stockPrice
          ).toFixed(2);
          setBuyingPower(newBuyingPower);

          if (!objectWithTicker || objectWithTicker.quantity < parsedQuantity) {
            setDisableButton(true);
            setErrorMsg(
              "You do not have enough of this stock to sell this amount."
            );
          } else {
            setDisableButton(false)
            setErrorMsg("");
          }
        }
      } else {
        setSubmission(false);
        setBuyingPower(account.buying_power);
        setTotalPrice(0);
        setDisableButton(true);
        setErrorMsg("");
      }
    }
  };

  console.log("NETFLIX DATA ")
  console.group(stockInfo.stockName)
  
  
  // updates the stock price on the page as you open it
  useEffect(() => {
    const fetchData = async () => {
        updateStockPrice(tickers);
        await getAccount();
        await getPortfolio();
    };

    // Call fetchData
    fetchData();
}, []);
useEffect(() => {
  if(portfolio !== null){
      getCurrentQuantity();
  }
}, [portfolio]);


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

      const res = await axios.post(
        `http://localhost:3001/trans/${trans_type}`,
        {
          ticker: ticker,
          quantity: quantity,
          curr_price: curr_price,
          user_id: currentUserId,
          trans_type: trans_type,
          purchased_by: "user",
        }
      );
      if (res.status === 201) {
        setStateForm("reg");
        setSubmission(true);
        //setSubmission(<Text color={'green.400'}>Your submission was placed successfully!</Text>);
      }
    } catch (err) {
      console.log(err);


      //must update the error message
      //setSubmission(<Text color={'red.400'}>Your submission failed</Text>);
    }
  };

  

  


  // here will be some sort of function that displays the stock graph, and just overall infromation based on the stock id that is passed
  return (
    <Flex
      w={"full"}
      position={"absolute"}
      bgColor={"#ecf2f3"}
      textColor={"#03314b"}
    >
      <Grid
        templateAreas={`
        "header nav"
        "main nav"
      `}
        w={"full"}
        gridTemplateRows={"1fr"}
        gridTemplateColumns={"4fr  2fr"}
        gap="1"
        p={20}
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem h={"20vh"} pl="5" area={"header"} >
          <Stack direction={"row"}>
            <Image
              src={stockInfo.logo}
              w={100}
              h={100}
              borderRadius={"full"}
              bgColor={"white"}
            />
            <Text fontSize={70} color={"white"} fontWeight={"light"}>
              <Popover
                word="Ticker"
                display={stockInfo.stockName}
                color={"#03314b"}
                description={
                  "A ticker is just a nickname for a companies stock. Every stock has a unique ticker."
                }
              />
            </Text>
            <Text
              fontSize={20}
              mt={"10"}
              color={"#03314b"}
              fontWeight={"light"}
            >
              {stockInfo.company}
            </Text>
            <Text fontSize={20} mt={'10'} color={'#03314b'} fontWeight={'light'}>{stockInfo.company}</Text>


          </Stack>
          <Stack direction={"row"} mt={5} ml={20}>
            <Text fontSize={45} color={"#03314b"} fontWeight={"light"}>
              
              <Popover
                word="Current Price"
                display={` Price $${stockInfo.stockPrice.toFixed(2)}
               `} color="#03314b"
                description={`This is the current price of a stock. This price can change every second from people buying and selling the stock. Check the price again in a few minutes and the price will likely have changed`}
              />{" "}
             
            </Text>
            {stockInfo.stockPercentage > 0 ? (
              <Stack direction={"row"} ml={5} mt={5}>
                <Text fontSize={25} color={"#03314b"} fontWeight={"light"}>
                  Percent Change:{" "}
                </Text>
                <ArrowUpIcon color={"#00f008"} w={10} h={10} />
                <Text fontSize={25} color={"#00f008"} fontWeight={"light"}>
                  {" "}
                  <Popover
                    word="Percent Change"
                    display={`${stockInfo.stockPercentage.toFixed(1)}%`}
                    color={"#00f008"}
                    description={`The percent change is how much the price has gone up or down compared to the previous day. In this case the price has gone up by ${stockInfo.stockPercentage.toFixed(
                      1
                    )}%since yesterday`}
                  />{" "}
                  {" "}
                </Text>
              </Stack>
            ) : (
              <Stack direction={"row"} ml={5} mt={5}>
                <Text fontSize={25} color={"#03314b"} fontWeight={"light"}>
                  Percent Change:{" "}
                </Text>
                <ArrowDownIcon color={"red"} w={10} h={10} />
                <Text fontSize={25} color={"red"}>
                  {" "}
                  {
                    <Popover
                      word="Percent Change"
                      display={`${stockInfo.stockPercentage.toFixed(1)}$`}
                      color="red"
                      description={`The percent change is how much the price has gone up or down compared to the previous day. In this case the price has gone down by ${stockInfo.stockPercentage.toFixed(
                        1
                      )}% since yesterday`}
                    />
                  }{" "}
                  {" "}
                </Text>
              </Stack>
            )}
          </Stack>
        </GridItem>
        <GridItem pl="2" area={"main"} h={"100vh"}>
          <SingleStockGraph
            data={historicalData}
            dataName={stockInfo.stockName}
            aspect={2}
            color={"#03314b"}
          />
        </GridItem>

        <GridItem pl='2' area={'nav'} position={'relative'}>
           {submission && ( 
            <PopupConfirmation submission={submission} name={stockInfo.stockName} 
                               quantity={quantity} price={stockInfo.stockPrice} 
                               trans_type={stateForm.toString()}/>
           )} 
          
            <Flex direction={'column'} h={'100vh'} w={'full'} justify={'center'}>
            <Box >
              <Text fontSize={'35px'} fontWeight={'bold'} color='white'>
                <Popover word = "Portfolio" display = {"Portfolio"} color = "#03314b" description = {`Your portfolio is how much of each stock you own. It looks like you currently own ${currTickerQuantity} share(s) of ${stockInfo.stockName} `}/>
              </Text>
              {portfolio &&
                portfolio.map((item, index) => (
                  <Box key={index} p={2} bg="gray.700" borderRadius="md" my={2}>
                    <Text color="white">Ticker: {item.ticker}</Text>
                    <Text color="white">Quantity: {item.quantity}</Text>
                  </Box>
                ))}
            </Box>
            <Box
              w={"full"}
              borderRadius={10}
              display={"flex"}
              flexDirection={"column"}
              bgColor={"#03314b"}
              textColor={"white"}
            >
              <Flex textColor="black">
                <Square
                  flex="1"
                  _hover={{ bg: "#1ecc97" }}
                  borderRadius={5}
                  bgColor={stateForm === "buy" ? "transparent" : "#1ecc97"}
                >
                  <Link
                    fontWeight={"light"}
                    onClick={(event) => {
                      setStateForm("buy");
                    }}
                    fontSize={"60px"}
                    color={"white"}
                  >
                    {" "}
                    Buy{" "}
                  </Link>
                </Square>

                 {currTickerQuantity > 0 && <Square
                  flex="1"
                  _hover={{ bg: "#1ecc97" }}
                  borderRadius={3}
                  bgColor={stateForm === "sell" ? "transparent" : "#1ecc97"}
                >
                  <Link
                    fontWeight={"light"}
                    onClick={(event) => {
                      setStateForm("sell");
                    }}
                    fontSize={"60px"}
                    color = "white"
                  >
                    {" "}
                    Sell{" "}
                  </Link>
                </Square>}
              </Flex>

              {stateForm === "reg" ? (
                <Center p={10} fontWeight={"light"} fontSize={"20px"}>
                  Choose a type above to start
                </Center>
              ) : (
                <Flex direction={"column"} p={10}>
                  <Flex direction={"row"} justify={"space-between"}>
                    <Text fontSize={"30px"} fontWeight={"light"}>
                      Quantity
                    </Text>
                    <Input
                      color={"white"}
                      w={20}
                      h={"40px"}
                      type="number"
                      onChange={(event) =>
                        handleQuantityChange(event.target.value)
                      }
                    />
                  </Flex>
                  <Flex direction={"row"} justify={"space-between"}>
                    <Text fontSize={"30px"} fontWeight={"light"}>
                      Total Price:{" "}
                    </Text>
                    <Text fontSize={"30px"} fontWeight={"light"}>
                      ${totalPrice}
                    </Text>
                  </Flex>
                  <Flex direction={"row"} justify={"space-between"}>
                    <Text fontSize={"30px"} fontWeight={"light"}>
                    <Popover
                      word="New Buying Power"
                      display={`New Buying Power`}
                      color="white"
                      description={`The new buying power is how much money you will have after trading the stock.`}
                      icon = {"white"}
                    />{" "}
                    </Text>
                    <Text
                      fontSize={"30px"}
                      fontWeight={"light"}
                      color={buyingPower < 0 ? "red" : "#1ecc97"}
                    >
                      ${buyingPower}
                    </Text>
                  </Flex>
                  <Flex color="red">
                    {errorMsg && <div className="error">{errorMsg}</div>}
                  </Flex>

                  <Flex justify={"center"} mt={5}>
                    <Button
                      isDisabled={disableButton}
                      _hover={{ bg: "green.500", color: "white" }}
                      w={20}
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
                      {stateForm.toString().toUpperCase()}
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  );
}
