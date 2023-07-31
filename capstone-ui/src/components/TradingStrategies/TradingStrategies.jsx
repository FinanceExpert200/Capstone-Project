
import React from "react";
import "./TradingStrategies.css";

import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
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
// import { Link } from "react-router-dom";



const TradingStrategies = ({userId}) => {
  
  return (
    <div id="tempdiv">
      <Link as={RouterLink} to="/strategies/movingaveragecrossover">Moving Average Crossover</Link>
      <Link as={RouterLink} to="/strategies/meanreversion">Mean Reversion</Link>
      <Link as={RouterLink} to="/strategies/divergence">RSI Divergence</Link>
      <Link as={RouterLink} to="/strategies/pairstrading">Pairs Trading</Link>
    </div>
  );
};

export default TradingStrategies;
