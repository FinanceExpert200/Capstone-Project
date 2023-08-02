import { React, useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";
import MeanReversionGraph from "../Graph/MeanReversionGraph";


export default function ResultMeanReversion({ accountValue, transactionHistory, thrityDayAverage, twentyDayAverage, companies }) {
  
  const [checker, setChecker] = useState(0);
  const [meanReversionArray, setMeanReversionArray] = useState(null)
  const [history,setHistory] = useState(null)
  useEffect(() => {
    const updatedHistory = companies.map((company) => {
      console.log("company", company, thrityDayAverage.length)
      const c = thrityDayAverage.filter((comp) => {
        console.log("comp", comp.ticker)
        return comp.ticker === company
      });
      const t = twentyDayAverage.filter((comp) => comp.ticker === company);
      console.log("t", t, "c", c)
      const updatedC = c.map((co) => {
        const matchingTap = t.find((tap) => tap.ticker === co.ticker && tap.date === co.date);
        if (matchingTap) {
          return { ...co, twentyOneAverage: matchingTap.twentyOneAverage };
        } else {
          return co;
        }
      })
      //console.log("UPDATED ",updatedC )
      if (updatedC.length > 0) {
        return { [company]: updatedC };
      }
    });
    console.log("BEING USED", updatedHistory)
    // if (checker > companies.length){

      // setChecker(checker + 1);
    // }
    //console.log("BODY LENGTH",checker)
    // if (checker == companies.length) {
      setMeanReversionArray(updatedHistory);
    // }
    //filter and arranges the transactionHistory based on company's name
    const transaction = companies.map((company) => {
      return transactionHistory.filter((comp) => comp.map((c)=>{
        c.Ticker === company;

      }))
    });
    setHistory(transaction);


  }, [companies, thrityDayAverage, twentyDayAverage])
  console.log("Array: ",meanReversionArray);
  return (
    <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
      <Heading>Mean Reversion</Heading>
      <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
        <TabList p={1} >
          {companies.map((company) => (
            <Tab >{company}</Tab>
          ))
          }

        </TabList>
        <TabPanels>
          {meanReversionArray ? (
            meanReversionArray.map((array, index) => (
              <TabPanel key={index} w={'full'} h={30}>
                <MeanReversionGraph
                  data={array[companies[index]]}
                  dataName="close"
                  aspect={6}
                  color="white"
                  thirty="thirtyDayAverage"
                  twenty="twentyOneAverage"
                />
              </TabPanel>
            ))
          ) : (
            <Button isLoading loadingText="Loading" color="white" variant="outline"></Button>
          )}
        </TabPanels>
      </Tabs>



    </Flex>
  )
}