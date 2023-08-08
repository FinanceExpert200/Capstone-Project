import { React, useState } from "react";
import "./TradingStrategies.css";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js";
import EMAStrat from "../../TradingCalculations/EMAStrat.js";
import StrategyPage from "../StrategyPage/StrategyPage";
import { useParams } from "react-router";
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
import ClickPopover from "../Popover/Popover";

const TradingStrategies = ({ userId, setFormattedStrategyName }) => {
  const { name } = useParams();
  const [formDisplay, setFormDisplay] = useState(false);
  const [submission, setSubmission] = useState(false);
  return (
    <Center
      position={"absolute"}
      w={"full"}
      h={"100vh"}
      bgColor={"#ecf2f3"}
      color={"#03314b"}
      fontWeight={"light"}
      fontSize={"1cm"}
      display={"flex"}
    >
      <Flex flexDirection={"column"} ml={"400px"} mr={"400px"} w={"full"}>
        <Square>
          <Heading fontSize={"5rem"}>
            <ClickPopover
              display="Trading Strategies"
              word="What is a trading strategy?"
              description={
                "A trading strategy is like a gameplan for buying and selling stocks. It helps decide when you should buy and sell stocks based on things like current events, stock price changes, and your own financial goals. It's a way of making decisions in a more thought out way instead of trading based on gut instinct."
              }
            />
          </Heading>
        </Square>

        <Tabs variant="enclosed" borderColor={"#03314b"} w={"full"} p={5}>
          <TabList>
            <Tab
              _selected={{ color: "white", bg: "#03314b" }}
              _hover={{ bg: "green.500", color: "white" }}
              borderTopRadius={5}
              borderBottomRadius={0}
            >
              Moving Average Crossover
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#03314b" }}
              _hover={{ bg: "green.500", color: "white" }}
              borderTopRadius={5}
              borderBottomRadius={0}
            >
              Mean Reversion
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#03314b" }}
              _hover={{ bg: "green.500", color: "white" }}
              borderTopRadius={5}
              borderBottomRadius={0}
            >
              RSI Divergence
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#03314b" }}
              _hover={{ bg: "green.500", color: "white" }}
              borderTopRadius={5}
              borderBottomRadius={0}
            >
              Pairs Trading
            </Tab>
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

                <Button
                  as={"a"}
                  href="/strategies/movingaveragecrossover"
                  fontSize={"20px"}
                  bg="#bbdbcb"
                  color={"#03314b"}
                  _hover={{ bg: "green.500", color: "white" }}
                >
                  Moving Average Crossover
                </Button>
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

                <Button
                  as={"a"}
                  href="/strategies/meanreversion"
                  fontSize={"20px"}
                  bg="#bbdbcb"
                  color={"#03314b"}
                  _hover={{ bg: "green.500", color: "white" }}
                >
                  Mean Reversion
                </Button>
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

                <Button
                  as={"a"}
                  href="/strategies/divergence"
                  fontSize={"20px"}
                  bg="#bbdbcb"
                  color={"#03314b"}
                  _hover={{ bg: "green.500", color: "white" }}
                >
                  RSI Divergence
                </Button>
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

                <Button
                  as={"a"}
                  href="/strategies/pairstrading"
                  fontSize={"20px"}
                  bg="#bbdbcb"
                  color={"#03314b"}
                  _hover={{ bg: "green.500", color: "white" }}
                >
                  Pairs Trading
                </Button>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Center>
  );
};

export default TradingStrategies;
