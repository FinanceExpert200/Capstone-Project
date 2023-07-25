import MovAvgTrading from "../../TradingCalculations/MovingAverageCrossover.js";
import React from "react";
import "./TradingStrategies.css";
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"


import {
  Grid,
  Text,
  Flex,
  Center,
  Box,
  GridItem,
  Stack,
  Container,
  Button,
} from "@chakra-ui/react";

const runStrategy = async (event) => {
  event.preventDefault();
  // MovAvgTrading.calculateDisplayedProfit(5000);


  MeanReversionStrat.mainFunc(5000);

};

const TradingStrategies = () => {
  return (
    <div id="tempdiv">
      Moving Average Crossover Strategy:
      <Button onClick={runStrategy}>Run Strategy</Button>
      {/* <div>Account value after 3 months {MovAvgTrading.totalThreeMonthProfit}, Account value after 6 months {MovAvgTrading.totalSixMonthProfit}, Account value after 1 year {MovAvgTrading.botAccountValue}</div> */}
    </div>
  );
};

export default TradingStrategies;
