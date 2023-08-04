import React from "react";
import { useState, useEffect } from "react";
import {
  Heading,
  Button,
  Box,
  Center,
  Circle,
  Container,
  Divider,
  Square,
  Stack,
  Text,
  Flex,
  Tag,
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
import { format, parseISO } from "date-fns";
import StrategyGraph from "../Graph/StrategyGraph";
//maArray, transactionHistory, accountValues

export default function MovingAverageResult({
  maArray,
  transactionHistory,
  accountValues,
  companies,
  buyingPower,
}) {
  console.log("Moving Average Result: ", transactionHistory);
  const [history, setHistory] = useState([]);
  const [transHistory, setTransHistory] = useState([]);
  useEffect(() => {
    const updatedHistory = companies.map((company) => {
      return maArray.filter((comp) => comp.ticker === company);
    });
    setHistory(updatedHistory);
    const updatedTransaction = companies.map((company) => {
      console.log("company: ", company);
      return transactionHistory.filter((trans) => trans.ticker === company);
    });
    console.log("HISTORY_____ ", updatedHistory);
    setTransHistory(updatedTransaction);
  }, [companies, transactionHistory]);

  console.log("BO", buyingPower);

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
            <Heading fontWeight={"light"}>Moving Average Strategy:</Heading>
            <Tag fontSize={"23"} bg="whiteAlpha.600">
              Buying Power: ${buyingPower}
            </Tag>
          </Flex>
          <Text fontSize={25} mt={4}>
            Involves using two different moving averages, one for a shorter
            period and the other for a longer period. When the short-term
            average crosses above the long-term average, it's a signal to buy,
            as recent prices are higher, suggesting the stock may be on the
            rise. Conversely, when the short-term average crosses below the
            long-term average, it's a signal to sell, as recent prices are
            lower, indicating the stock may be on a downward trend.
          </Text>
        </Flex>
      </Box>

      <Container
        color="#edf0f5"
        p={4}
        w={"full"}
        mt={"-120px"}
        h={300}
        boxShadow={"0,2px,5px,rgba(0,0,0,0.2)"}
      >
        <Flex
          direction={"row"}
          justify={"space-between"}
          bgColor={"#edf0f5"}
          borderRadius={"5"}
          pl={3}
          pr={3}
          boxShadow={"20px 20px 90px grey"}
        >
          <Square
            w={"auto"}
            h={"200px"}
            display={"flex"}
            flexDirection={"column"}
            justify={"center"}
          >
            <Text
              color={Number(accountValues[0]) < 0 ? "red.600" : "#1ecc97"}
              fontSize={30}
            >
              ${Number(accountValues[0]).toFixed(2)}
            </Text>
            <Text color={"gray.500"} fontSize={25}>
              3 Month Profit
            </Text>
          </Square>

          <Box display="flex" alignItems="center">
            <Divider orientation="vertical" h="100px" borderColor="gray.300" />
          </Box>

          <Square
            w={"auto"}
            h={"200px"}
            display={"flex"}
            flexDirection={"column"}
          >
            <Text
              color={Number(accountValues[1]) < 0 ? "red.600" : "#1ecc97"}
              fontSize={30}
            >
              ${Number(accountValues[1]).toFixed(2)}
            </Text>
            <Text color={"gray.500"} fontSize={25}>
              6 Month Profit
            </Text>
          </Square>

          <Box display="flex" alignItems="center">
            <Divider orientation="vertical" h="100px" borderColor="gray.300" />
          </Box>

          <Square
            w={"auto"}
            h={"200px"}
            display={"flex"}
            flexDirection={"column"}
          >
            <Text
              color={Number(accountValues[2]) < 0 ? "red.600" : "#1ecc97"}
              fontSize={30}
            >
              ${Number(accountValues[2]).toFixed(2)}
            </Text>
            <Text color={"gray.500"} fontSize={25}>
              1 Year Profit
            </Text>
          </Square>
        </Flex>
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
          {history.map((company) => (
            <TabPanel key={company}>
              <StrategyGraph
                data={company}
                dataName={"percentage"}
                aspect={4}
                color={"#b4abaf"}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Flex direction={"row"} justify={"space-between"}>
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
          <TabPanels>
            {transHistory.map((company) => (
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
                          <Td>{c.ticker}</Td>
                          <Td>{format(parseISO(c.date), "MMM, d, yyyy")}</Td>
                          <Td>
                            <Tag bg="whiteAlpha.600">
                              {c.type.slice(0, 1).toUpperCase() +
                                c.type.slice(1, c.type.length)}
                            </Tag>
                          </Td>
                          <Td isNumeric>${c.price.toFixed(2)}</Td>
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
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}
