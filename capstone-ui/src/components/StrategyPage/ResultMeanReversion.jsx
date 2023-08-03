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
    console.log("AVERAGE ARRAY HAS CHANGED!")
    console.log(averageArray)
    fetchMeanReversionData()
    setPageUpdated(true)
  }, [averageArray])

  function fetchMeanReversionData() {
    console.log("Array length in fetch: ")
    console.log(averageArray.length)
      if (averageArray) {
        console.log("the array length is greater than zero.")
        const updatedHistory = companies.map((company) => {
          const c = averageArray.filter((comp) => comp.ticker === company);
          return { [company]: c };
        });
        setMeanReversionArray(updatedHistory);
      }
    }



  // useEffect(() => {
  //   async function fetchMeanReversionData() {
  //     if (averageArray.length > 0) {
  //       const updatedHistory = await Promise.all(companies.map((company) => {
  //         const c = averageArray.filter((comp) => comp.ticker === company);
  //         return { [company]: c };
  //       }));
  //       setMeanReversionArray(updatedHistory);
  //     }

  //     // const transaction = await Promise.all(companies.map(async (company) => {
  //     //   return transactionHistory.filter((comp) => {
  //     //     return comp.map((c) => {
  //     //       return c.Ticker === company;
  //     //     });
  //     //   });
  //     // }));
  //     // setHistory(transaction);
  //   }

  //   fetchMeanReversionData();
  // }, [companies, averageArray])

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