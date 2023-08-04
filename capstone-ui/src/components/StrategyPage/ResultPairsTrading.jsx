import { React, useState, useEffect } from "react";
import {
  Box,
  Button,
  Circle,
  Container,
  Divider,
  Square,
  Text,
  Tag,
  Flex,
  Heading,
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
import PairsTradeGraph from "../Graph/PairsTradeGraph";

export default function ResultMeanReversion({
  accountValues,
  transactionHistory,
  companies,
  pairsData,
  buyingPower,
}) {
  // console.log("account:___", accountValue)
  // console.log("history:___", transactionHistory)
  // console.log("companies:___", companies)
  // console.log("PAIRs data: __ ", pairsData)

  const [history, setHistory] = useState([]);
  useEffect(() => {
    const updatedHistory = companies.map((company) => {
      return transactionHistory.filter((comp) => comp.ticker === company);
    });
    setHistory(updatedHistory);
  }, [companies, transactionHistory]);

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
            <Heading fontWeight={"light"}>Pair Trading</Heading>
            <Tag fontSize={"23"} bg="whiteAlpha.600">
              Buying Power: ${buyingPower}
            </Tag>
          </Flex>
          {/* <Text fontSize={30} mt={4}>
            Pairs trading is a strategy that trades two correlated stocks based
            on their price ratio, which is the price of one stock divided by the
            price of the other. It calculates the historical average and
            standard deviation of this ratio.
          </Text> */}
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
      <Box w={"full"} p={5} bgColor={"#03314b"} borderRadius={10}>
        <PairsTradeGraph
          data={pairsData}
          historical={"historical_mean"}
          priceRatio={"price_ratio"}
          aspect={5}
          color={"white"}
        />
      </Box>
      <Flex direction={"row"} justify={"space-between"}>
        <Tabs variant="enclosed" borderColor={"black"} w={"full"} p={5}>
          <TabList>
            {companies.map((company) => (
              <Tab
                _selected={{ color: "white", bg: "#03314b" }}
                _hover={{ bg: "green.500", color: "white" }}
                borderTopRadius={5}
                borderBottomRadius={0}
              >
                {company}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {history.map((company) => (
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
                          <Td>{c.type === 'buy' ? (
                              <Tag colorScheme='green'>{c.type.slice(0, 1).toUpperCase() + c.type.slice(1, c.type.length)}</Tag>

                            ):(
                              <Tag colorScheme='red'>{c.type.slice(0, 1).toUpperCase() + c.type.slice(1, c.type.length)}</Tag>
                            )}</Td>
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
