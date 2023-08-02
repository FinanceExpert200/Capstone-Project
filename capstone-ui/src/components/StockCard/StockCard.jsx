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
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleStockGraph from "../Graph/SingleStockGraph";
import PopupConfirmation from "./PopupConfirmation";
import { set } from "date-fns";

export default function StockCard({
  updateStockPrice,
  tickers,
  stockData,
  currentUserId,
  historicalData,
  acc_value,
}) {
  const [stateForm, setStateForm] = useState("reg");
  const [submission, setSubmission] = useState(false);
  const { stockId } = useParams();
  const stockInfo = stockData[stockId];
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    setQuantity(parsedQuantity);
    if (parsedQuantity > 0) {
      setTotalPrice(parsedQuantity * stockInfo.stockPrice);
    } else {
      setTotalPrice(0);
    }
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
        //setStateForm("reg")
        setSubmission(true);
        //setSubmission(<Text color={'green.400'}>Your submission was placed successfully!</Text>);
      }
    } catch (err) {
      // console.log(err);

      setErrorMessage(err.response.data.error.message);
      // console.error(err.response.data.error.message);

      //must update the error message
      //setSubmission(<Text color={'red.400'}>Your submission failed</Text>);
    }
  };

  //UNDO THIS
  console.log("transaction was : ", submission);

  // here will be some sort of function that displays the stock graph, and just overall infromation based on the stock id that is passed
  return (
    <Flex w={"full"} position={"absolute"} bgColor={"#171923"}>
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
        <GridItem h={"20vh"} pl="5" area={"header"} borderBottom={"1px"}>
          <Stack direction={"row"}>
            <Image
              src={stockInfo.logo}
              w={100}
              h={100}
              borderRadius={"full"}
              bgColor={"white"}
            />
            <Text fontSize={70} color={"white"} fontWeight={"light"}>
              {stockInfo.stockName}
            </Text>
            <Text fontSize={20} mt={"10"} color={"white"} fontWeight={"light"}>
              {stockInfo.company}
            </Text>
          </Stack>
          <Stack direction={"row"} mt={5} ml={20}>
            <Text fontSize={45} color={"white"} fontWeight={"light"}>
              {" "}
              {stockInfo.stockPrice} USD
            </Text>
            {stockInfo.stockPercentage > 0 ? (
              <Stack direction={"row"} ml={5} mt={5}>
                <ArrowUpIcon color={"#00f008"} w={10} h={10} />
                <Text fontSize={25} color={"#00f008"} fontWeight={"light"}>
                  {" "}
                  {stockInfo.stockPercentage} %{" "}
                </Text>
              </Stack>
            ) : (
              <Stack direction={"row"} ml={5} mt={5}>
                <ArrowDownIcon color={"red"} w={10} h={10} />
                <Text fontSize={25} color={"red"}>
                  {" "}
                  {stockInfo.stockPercentage} %{" "}
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
            color={"white"}
          />
        </GridItem>

        <GridItem pl="2" area={"nav"} position={"relative"}>
          {submission && (
            <PopupConfirmation
              submission={submission}
              name={stockInfo.stockName}
              quantity={quantity}
              price={stockInfo.stockPrice}
              trans_type={stateForm.toString()}
            />
          )}
          <Center h={"100vh"} w={"full"}>
            <Box
              w={"full"}
              borderRadius={10}
              display={"flex"}
              flexDirection={"column"}
              bgColor={"#A3C4BC"}
              textColor={"black"}
            >
              <Flex textColor="black">
                <Square
                  flex="1"
                  _hover={{ bg: "green.400" }}
                  borderRadius={5}
                  bgColor={stateForm === "buy" ? "green.400" : "transparent"}
                >
                  <Link
                    fontWeight={"light"}
                    onClick={(event) => {
                      setStateForm("buy");
                    }}
                    _hover={{ bg: "green.400" }}
                    fontSize={"60px"}
                    color={"black"}
                  >
                    {" "}
                    Buy{" "}
                  </Link>
                </Square>

                <Square
                  flex="1"
                  _hover={{ bg: "green.400" }}
                  borderRadius={3}
                  bgColor={stateForm === "sell" ? "green.400" : "transparent"}
                >
                  <Link
                    fontWeight={"light"}
                    onClick={(event) => {
                      setStateForm("sell");
                    }}
                    _hover={{ bg: "green.400" }}
                    fontSize={"60px"}
                  >
                    {" "}
                    Sell{" "}
                  </Link>
                </Square>
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
                      color={"black"}
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
                      Total Amount:{" "}
                    </Text>
                    <Text fontSize={"30px"} fontWeight={"light"}>
                      {totalPrice}
                    </Text>
                  </Flex>
                  <Flex justify={"center"} mt={5}>
                    <Button
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
                                      <Text
                      fontSize={15}
                      color={"red"}
                      fontWeight={"bold"}
                      mt={5}
                      // margin={"auto"}
                      marginTop={5}
                      marginLeft={105}
                    >
                      {errorMessage}
                    </Text>
                </Flex>
              )}
            </Box>
          </Center>
        </GridItem>
      </Grid>
    </Flex>
  );
}
