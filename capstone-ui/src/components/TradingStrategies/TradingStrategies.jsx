import React from "react";
import "./TradingStrategies.css";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js";
import EMAStrat from "../../TradingCalculations/EMAStrat.js";

import { Link as RouterLink } from "react-router-dom";
import {
  Link,
  Text,
  Center,
  Flex,
  Image,
  Box,
  Stack,
  Square,
  Container,
  Button,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { color } from "framer-motion";
 




const TradingStrategies = ({ userId , setFormattedStrategyName}) => {
  return (
    <Center
      position={"absolute"}
      w={"full"}
      h={"100vh"}
      bgColor={"#171923"}
      color={"white"}
      fontWeight={"light"}
      fontSize={"1cm"}
      display={"flex"}
    >
      <Flex flexDirection={"column"} ml={"400px"} mr={"400px"} w={"full"}>
        <Square>
          <Heading fontSize={"5rem"}>Trading Strategies</Heading>
          <Text ml={1}>Learn More</Text>
        </Square>

        <Tabs variant="enclosed" borderColor={"black"} w={"full"} p={5}>
          <TabList p={1}>
            <Tab>Moving Average Crossover</Tab>
            <Tab>Mean Reversion</Tab>
            <Tab>RSI Divergence</Tab>
            <Tab>Pairs Trading</Tab>
            <Tab>Exponential Moving Average</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex
                direction={"column"}
                justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={25}>
                  Involves using two different moving averages, one for a
                  shorter period and the other for a longer period. When the
                  short-term average crosses above the long-term average, it's a
                  signal to buy, as recent prices are higher, suggesting the
                  stock may be on the rise. Conversely, when the short-term
                  average crosses below the long-term average, it's a signal to
                  sell, as recent prices are lower, indicating the stock may be
                  on a downward trend.
                </Text>
                <Link as={RouterLink} to="/strategies/movingaveragecrossover">
                  <Button
                    fontSize={"20px"}
                    _hover={{ bg: "green.500", color: "white" }}
                  >
                    Moving Average Crossover
                  </Button>
                </Link>
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex
                direction={"column"}
                justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={25}>
                  We utilize the dynamic Mean Reversion Strategy to spot
                  compelling trading opportunities. When there are instances
                  where a stock's 30-day moving average falls 10 percent below
                  its 120-day moving average, we BUY. Once the stock price
                  rebounds and aligns with its 120-day moving average, we
                  execute a SELL order to secure profits.
                </Text>
                <Link as={RouterLink} to="/strategies/meanreversion">
                  <Button
                    fontSize={"20px"}
                    _hover={{ bg: "green.500", color: "white" }}
                  >
                    Mean Reversion
                  </Button>
                </Link>
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex
                direction={"column"}
                justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={30}>
                  It watches the RSI and daily price changes. When the price
                  goes down but RSI goes up, it tells us to buy the stock,
                  thinking it might go up later. When the price goes up but RSI
                  goes down, it tells us to sell, thinking the price might go
                  down.
                </Text>
                <Link as={RouterLink} to="/strategies/divergence">
                  <Button
                    fontSize={"20px"}
                    _hover={{ bg: "green.500", color: "white" }}
                  >
                    RSI Divergence
                  </Button>
                </Link>
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex
                direction={"column"}
                justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={30}>
                  Pairs trading is a strategy that trades two correlated stocks
                  based on their price ratio, which is the price of one stock
                  divided by the price of the other. It calculates the
                  historical average and standard deviation of this ratio.
                </Text>
                <Link as={RouterLink} to="/strategies/pairstrading">
                  <Button
                    fontSize={"20px"}
                    _hover={{ bg: "green.500", color: "white" }}
                  >
                    Pairs Trading
                  </Button>
                </Link>
              </Flex>
            </TabPanel>

            <TabPanel>
              <Flex
                direction={"column"}
                justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={30}>
                  The Exponential Moving Average (EMA) is a type of moving
                  average that places a greater weight and significance on the
                  most recent data points.
                </Text>
                <Link as={RouterLink} to="/strategies/exponentialmovingaverage">
                  <Button
                    fontSize={"20px"}
                    _hover={{ bg: "green.500", color: "white" }}
                  >
                    Exponential Moving Average
                  </Button>
                </Link>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Center>
  );
};

export default TradingStrategies;
