import { React, useState, useEffect } from "react";
import {
  Box, Button, Flex, Heading, Text,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer
} from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";
import MeanReversionGraph from "../Graph/MeanReversionGraph";
import { format, parseISO } from "date-fns"


export default function ResultMeanReversion({ accountValue, transactionHistory, averageArray, companies }) {

  const [checker, setChecker] = useState(0);
  const [meanReversionArray, setMeanReversionArray] = useState([])
  const [transHistory, setTransHistory] = useState(null)
  useEffect(() => {
    //console.log("HISTORY of transaction : ", accountValue)
    setTimeout(() => {
      fetchMeanReversionData()
    }, 700
    )
  }, [averageArray, transactionHistory])

  function fetchMeanReversionData() {
    if (averageArray) {
      //console.log("the array length is greater than zero.")
      const updatedHistory = companies.map((company) => {
        const c = averageArray.filter((comp) => comp.ticker === company);
        return { [company]: c };
      });
      //console.log("Before set Meanreversion data - UPDATED history: ", updatedHistory)
      setMeanReversionArray(updatedHistory);
    }
    if (transactionHistory) {
      const updatedTransaction = companies.map((company) => {
        return transactionHistory.filter((trans) => trans.Ticker === company)
      })
      setTransHistory(updatedTransaction)
    }

  }
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
              <TabPanel key={index} w={'full'} h={'25vh'}>
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
      <Flex direction={'row'} justify={'space-between'} >
        <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
          <TabList p={1} >
            {companies.map((company) => (
              <Tab >{company}</Tab>
            ))
            }

          </TabList>
          <TabPanels>
            {transHistory ? (
              transHistory.map((company) => (
                <TabPanel key={company} overflow="scroll" h={'25vh'}>
                  <TableContainer>
                    <Table variant='simple'>
                      <TableCaption>Description</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Date</Th>
                          <Th>Type</Th>
                          <Th isNumeric>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody overflow="scroll" h={'20vh'}>
                        {company.map((c) => (
                          <Tr >
                            <Td>{c.Ticker}</Td>
                            <Td>{format(parseISO(c.Date), "MMM, d, yyyy")}</Td>
                            <Td>{c.Type.slice(0, 1).toUpperCase() + c.Type.slice(1, c.Type.length)}</Td>
                            <Td isNumeric>${c.Price.toFixed(2)}</Td>
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
              ))
            ) : (
              <Button isLoading loadingText="Loading" color="white" variant="outline"></Button>
            )}

          </TabPanels>

          {/* <TabPanels>
            {transHistory.map((company) => (
              <TabPanel key={company} overflow="scroll" h={'25vh'}>
                <Flex direction={'column'} justify={'space-between'} align={'center'}>
                  {company.map((c) => (
                    <Text key={c.ticker}>{c.ticker}</Text>
                  ))}
                </Flex>
              </TabPanel>
            ))}
          </TabPanels> */}


        </Tabs>

      </Flex>



    </Flex>
  )
}