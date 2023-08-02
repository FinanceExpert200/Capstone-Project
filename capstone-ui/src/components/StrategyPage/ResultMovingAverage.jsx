import React from "react";
import { useState, useEffect } from "react";
import {
  Heading,
  Button,
  Box,
  Center,
  Circle,
  Square,
  Stack,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import StrategyGraph from "../Graph/StrategyGraph";
import { format } from "date-fns";

//maArray, transactionHistory, accountValues

export default function MovingAverageResult({
    maArray,
    transactionHistory,
    accountValues,
    companies,
  }) {
    console.log("Moving Average Result: ", maArray);
  
    console.log("look at this", transactionHistory);
  
    console.log("companies", companies);
    const [history, setHistory] = useState([]);
    // console.log("The history: ", transactionHistory);
    useEffect(() => {
      const updatedHistory = companies.map((company) => {
        return transactionHistory.filter((comp) => comp.ticker === company);
      });
      setHistory(updatedHistory);
    }, [companies, transactionHistory]);
    //const meta = transactionHistory.filter(company => company.ticker === companies[0])
    // console.log("THE RSI : ", history);
  
    console.log(history);
    return (
      <Flex
        direction={"column"}
        w={"full"}
        h={"80vh"}
        mt={10}
        p={10}
        textColor={"white"}
      >
        <Heading>Moving Average</Heading>
        <StrategyGraph
          data={maArray}
          dataName={"percentage"}
          aspect={4}
          color={"white"}
        />
        <Tabs variant="enclosed" borderColor={"black"} w={"full"} p={5}>
          
          <TabList p={1}>
            {companies.map((company) => (
              <Tab>{company}</Tab>
            ))}
          </TabList>
          <TabPanels>
              {history.map((company) => (
                <TabPanel  overflow="scroll" h={"25vh"}>
                  <Flex
                    direction={"column"}
                    justify={"space-between"}
                    align={"center"}
                  >
                    {company.map((c) => (
                      <Flex direction={"row"} justify={"space-between"} margin={3} >
                        
  
                        <Text>{c.ticker}</Text>
                        <Text marginLeft={2}>{c.type}</Text>
                        <Text marginLeft={2}>{c.price}</Text>
                        <Text marginLeft={2}>{format(new Date(c.date), 'MMMM dd, yyyy')}</Text>
  
  
                          
  
  
                      </Flex>
  
                    ))}
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
  {/* 
          <TabPanels>
  
            {history.map((company) => (
              <TabPanel overflow="scroll" h={"25vh"}>
                <Flex
                  direction={"column"}
                  justify={"space-between"}
                  align={"center"}
                >
                  <Flex direction={"row"} justify={"space-between"} margin={3}>
                    <Text>{company.ticker}</Text>
                    <Text marginLeft={2}>{company.type}</Text>
                    <Text marginLeft={2}>{company.price}</Text>
                    <Text marginLeft={2}>
                      {format(new Date(company.date), "MMMM dd, yyyy")}
                    </Text>
                  </Flex>
                </Flex>
              </TabPanel>
            ))}
  
  
          </TabPanels> */}
  
        </Tabs>
      </Flex>
    );
  }
  
