import { React, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Container,
  Divider,
  Square,
  Tag,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import StrategyGraph from "../Graph/StrategyGraph";
import MeanReversionGraph from "../Graph/MeanReversionGraph";
import { format, parseISO } from "date-fns";

export default function ResultMeanReversion({
  accountValues,
  transactionHistory,
  averageArray,
  companies,
  buyingPower,
}) {
  const [checker, setChecker] = useState(0);
  const [meanReversionArray, setMeanReversionArray] = useState([]);
  const [transHistory, setTransHistory] = useState(null);
  useEffect(() => {
    //console.log("HISTORY of transaction : ", accountValue)
    setTimeout(() => {
      fetchMeanReversionData();
    }, 700);
  }, [averageArray, transactionHistory]);

  console.log("accvals", accountValues);
  // console.log("should be number", Number(accountValues[0]["AMZN"].profitThreeMonths))

  function fetchMeanReversionData() {
    if (averageArray) {
      //console.log("the array length is greater than zero.")
      const updatedHistory = companies.map((company) => {
        const c = averageArray.filter((comp) => comp.ticker === company);
        return { [company]: c };
      });
      //console.log("Before set Meanreversion data - UPDATED history: ", updatedHistory)
      setMeanReversionArray(updatedHistory);
    }
    if (transactionHistory) {
      const updatedTransaction = companies.map((company) => {
        return transactionHistory.filter((trans) => trans.Ticker === company);
      });
      setTransHistory(updatedTransaction);
    }
  }
  return (
    <Flex
      direction={"column"}
      w={"full"}
      h={"80vh"}
      mt={10}
      p={10}
      textColor={"#03314b"}
    >
      <Box bgColor={"#03314b"} minH={"30vh"} w={"full"} p={7}>
        <Flex direction={"column"} w={"full"} textColor={"white"}>
          <Flex direction="row" justify="space-between" align="center">
            <Heading fontWeight={"light"}>Mean Reversion Strategy:</Heading>
            <Tag fontSize={"23"} bg="whiteAlpha.600">
              Buying Power: ${buyingPower}
            </Tag>
          </Flex>
          {/* <Text fontSize={25} mt={4}>
            We utilize the dynamic Mean Reversion Strategy to spot compelling
            trading opportunities. When there are instances where a stock's
            30-day moving average falls 10 percent below its 120-day moving
            average, we BUY. Once the stock price rebounds and aligns with its
            120-day moving average, we execute a SELL order to secure profits.
          </Text> */}
        </Flex>
      </Box>

      <Container>
        <Tabs
          as="container"
          variant="enclosed"
          w={"full"}
          p={5}
          color="#edf0f5"
          mt={"-120px"}
          h={300}
          boxShadow={"0,2px,5px,rgba(0,0,0,0.2)"}
        >
          <TabList>
            {companies.map((company) => (
              <Tab
                _selected={{ color: "black", bg: "white" }}
                borderTopRadius={5}
              >
                {company}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {companies.map((company, index) => (
              <TabPanel>
                <Flex
                  direction={"row"}
                  justify={"space-between"}
                  bgColor={"#edf0f5"}
                  borderRadius={"5"}
                  pl={3}
                  pr={3}
                  boxShadow={"20px 20px 90px grey"}
                  mr={3}
                  ml={3}
                >
                  {/* <Square w={'auto'} h={'200px'} 
            display={'flex'} flexDirection={'column'}
            justify={'center'}
          >
            <Text color={Number(accountValues[index][company].profitThreeMonths) < 0 ? 'red.600' : '#1ecc97'} fontSize={30}>${Number(accountValues[index][company].profitThreeMonths).toFixed(2)}</Text>
            <Text color={'gray.500'} fontSize={25}>3 Month Profit</Text>
          </Square> */}

                  {/* <Box display="flex" alignItems="center"> */}
                  {/* <Divider orientation="vertical" h="100px" borderColor="gray.300" /> */}
                  {/* </Box> */}

                  <Square
                    w={"auto"}
                    h={"200px"}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <Text
                      color={
                        Number(accountValues[index][company].profitSixMonths) <
                        0
                          ? "red.600"
                          : "#1ecc97"
                      }
                      fontSize={30}
                    >
                      $
                      {Number(
                        accountValues[index][company].profitSixMonths
                      ).toFixed(2)}
                    </Text>
                    <Text color={"gray.500"} fontSize={25}>
                      6 Month Profit
                    </Text>
                  </Square>

                  <Box display="flex" alignItems="center">
                    <Divider
                      orientation="vertical"
                      h="100px"
                      borderColor="gray.300"
                    />
                  </Box>

                  <Square
                    w={"auto"}
                    h={"200px"}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <Text
                      color={
                        Number(accountValues[index][company].profitYear) < 0
                          ? "red.600"
                          : "#1ecc97"
                      }
                      fontSize={30}
                    >
                      $
                      {Number(accountValues[index][company].profitYear).toFixed(
                        2
                      )}
                    </Text>
                    <Text color={"gray.500"} fontSize={25}>
                      1 Year Profit
                    </Text>
                  </Square>
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>

      <Tabs variant="enclosed" borderColor={"black"} w={"full"} p={5}>
        <TabList>
          {companies.map((company) => (
            <Tab
              _selected={{ color: "white", bg: "#03314b" }}
              borderTopRadius={5}
              borderBottomRadius={0}
            >
              {company}
            </Tab>
          ))}
        </TabList>
        <TabPanels bgColor={"#03314b"}>
          {meanReversionArray.length === companies.length ? (
            meanReversionArray.map((array, index) => (
              <TabPanel key={index} w={"full"}>
                <MeanReversionGraph
                  data={array[companies[index]]}
                  dataName="close"
                  aspect={4}
                  color="#b4abaf"
                  thirty="thirtyDayAverage"
                  twenty="twentyOneAverage"
                  key={index}
                />
              </TabPanel>
            ))
          ) : (
            <Button
              isLoading
              loadingText="Loading"
              color="white"
              variant="outline"
            ></Button>
          )}
        </TabPanels>
      </Tabs>
      <Flex direction={"row"} justify={"space-between"}>
        <Tabs variant="enclosed" borderColor={"black"} w={"full"} p={5}>
          <TabList>
            {companies.map((company) => (
              <Tab
                _selected={{ color: "white", bg: "#03314b" }}
                _hover={{ bg: "green.500", color: "white" }}
              >
                {company}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {transHistory ? (
              transHistory.map((company) => (
                <TabPanel key={company} overflow="scroll" h={"25vh"}>
                  <TableContainer>
                    <Table variant="simple">
                      <TableCaption>Description</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Date</Th>
                          <Th>Type</Th>
                          <Th isNumeric>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody overflow="scroll" h={"20vh"}>
                        {company.map((c) => (
                          <Tr>
                            <Td>{c.Ticker}</Td>
                            <Td>{format(parseISO(c.Date), "MMM, d, yyyy")}</Td>
                            <Td>
                            {c.type === 'buy' ? (
                              <Tag colorScheme='green'>{c.Type.slice(0, 1).toUpperCase() + c.Type.slice(1, c.Type.length)}</Tag>

                            ):(
                              <Tag colorScheme='red'>{c.Type.slice(0, 1).toUpperCase() + c.Type.slice(1, c.Type.length)}</Tag>
                            )}
                            
                          </Td>
                            <Td isNumeric>${c.Price.toFixed(2)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                      <Tfoot>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Date</Th>
                          <Th>Type</Th>
                          <Th isNumeric>Price</Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </TableContainer>
                </TabPanel>
              ))
            ) : (
              <Button
                isLoading
                loadingText="Loading"
                color="white"
                variant="outline"
              ></Button>
            )}
          </TabPanels>


        </Tabs>
      </Flex>
    </Flex>
  );
}
