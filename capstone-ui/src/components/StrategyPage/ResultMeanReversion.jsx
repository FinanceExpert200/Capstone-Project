import { React, useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";
import MeanReversionGraph from "../Graph/MeanReversionGraph";


export default function ResultMeanReversion({ accountValue, transactionHistory, averageArray, companies }) {
  
  const [checker, setChecker] = useState(0);
  const [meanReversionArray, setMeanReversionArray] = useState([])
  const [history,setHistory] = useState(null)
  useEffect(() => {
    let updatedHistory  = [];
    if(averageArray.length > 0){
        updatedHistory = companies.map((company) => {
        const c = averageArray.filter((comp) => {
          return comp.ticker === company
        });
          return  {[company]: c };
        
      });
    }
      if(updatedHistory.length > 0){

        setMeanReversionArray(updatedHistory);
      }
    const transaction = companies.map((company) => {
      return transactionHistory.filter((comp) => comp.map((c)=>{
        c.Ticker === company;

      }))
    });
    setHistory(transaction);


  }, [companies, averageArray])

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
          {meanReversionArray.length > 0 ? (
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