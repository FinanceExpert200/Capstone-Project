import { React, useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";
import MeanReversionGraph from "../Graph/MeanReversionGraph";


export default function ResultMeanReversion({ accountValue, transactionHistory, averageArray, companies }) {
  
  const [checker, setChecker] = useState(0);
  const [meanReversionArray, setMeanReversionArray] = useState([])
  const [history,setHistory] = useState(null)
  const [pageUpdated, setPageUpdated] = useState(false)

  useEffect(() => {
    setTimeout(()=>{
      fetchMeanReversionData()
      setPageUpdated(true)
    },700
    )
  }, [averageArray])

  function fetchMeanReversionData() {
      if (averageArray) {
        console.log("the array length is greater than zero.")
        const updatedHistory = companies.map((company) => {
          const c = averageArray.filter((comp) => comp.ticker === company);
          return { [company]: c };
        });
        console.log("Before set Meanreversion data - UPDATED history: ", updatedHistory)
        setMeanReversionArray(updatedHistory);
      }
    }

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
          {meanReversionArray.length === companies.length ? (
            meanReversionArray.map((array, index) => (
              <TabPanel key={index} w={'full'} h={30}>
                <MeanReversionGraph
                  data={array[companies[index]]}
                  dataName="close"
                  aspect={6}
                  color="white"
                  thirty="thirtyDayAverage"
                  twenty="twentyOneAverage"
                  key={index}
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