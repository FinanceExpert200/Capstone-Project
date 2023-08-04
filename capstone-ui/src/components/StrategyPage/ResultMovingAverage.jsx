import React from 'react'
import { useState, useEffect } from 'react'
import { Heading, Button, Box, Center, Circle, Square, Stack, Text, Flex, 
         Tabs, TabList, TabPanels, Tab, TabPanel,
         Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react';
         import {format, parseISO} from "date-fns"
import StrategyGraph from '../Graph/StrategyGraph';
//maArray, transactionHistory, accountValues

export default function MovingAverageResult({ maArray, transactionHistory, accountValues, companies, buyingPower }) {
  console.log('Moving Average Result: ', transactionHistory)
  const [history, setHistory] = useState([]);
  const [transHistory, setTransHistory] = useState([])
  useEffect(() => {
    const updatedHistory = companies.map((company) => {
      return maArray.filter((comp) => comp.ticker === company);
    });
    setHistory(updatedHistory);
    const updatedTransaction = companies.map((company) => {
      console.log("company: ", company)
      return transactionHistory.filter((trans) => trans.ticker === company)
    })
    console.log("HISTORY_____ ", updatedHistory)
    setTransHistory(updatedTransaction)

  }, [companies, transactionHistory])
  
  console.log("BO", buyingPower)

  return (
    <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
      <Heading>Moving Average</Heading>
      <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
        <TabList p={1} >
          {companies.map((company) => (
            <Tab >{company}</Tab>
          ))
          }

        </TabList>

        <TabPanels  >
          {history.map((company) => (
            <TabPanel key={company}>
              <StrategyGraph data={company} dataName={'percentage'} aspect={4} color={'white'} />
            </TabPanel>
          ))}
          <TabPanel>
            <StrategyGraph data={maArray} dataName={'percentage'} aspect={4} color={'white'} />
          </TabPanel>
        </TabPanels>


      </Tabs>
      <Flex direction={'row'} justify={'space-between'}>
        <Flex direction={'row'} >
          <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
            <Text color={'black'} fontSize={30}>3 Month Profit</Text>
            <Text color={Number(accountValues[0]) < 0 ? 'red.600' : 'green.600'} fontSize={30}>${Number(accountValues[0]).toFixed(2)}</Text>
            

          </Circle>
          <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
          <Text color={'black'} fontSize={30}>6 Month Profit</Text>
          <Text color={Number(accountValues[1]) < 0 ? 'red.600' : 'green.600'} fontSize={30}>${Number(accountValues[1]).toFixed(2)}</Text>
            

          </Circle>
          <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
            <Text color={'black'} fontSize={30}>1 Year Profit</Text>
            <Text color={Number(accountValues[2]) < 0 ? 'red.600' : 'green.600'} fontSize={30}>${Number(accountValues[2]).toFixed(2)}</Text>
            

          </Circle>
        </Flex>
        <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
          <TabList p={1} >
            {companies.map((company) => (
              <Tab >{company}</Tab>
            ))
            }

          </TabList>
          <TabPanels>
                        {transHistory.map((company) => (
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
                                                    <Td>{c.ticker}</Td>
                                                    <Td>{format(parseISO(c.date), "MMM, d, yyyy")}</Td>
                                                    <Td>{c.type.slice(0,1).toUpperCase() + c.type.slice(1,c.type.length)}</Td>
                                                    <Td isNumeric>${c.price.toFixed(2)}</Td>
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
                        ))}

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