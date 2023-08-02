import React from 'react'
import { useState, useEffect } from 'react'
import { Heading, Button, Box, Center, Circle, Square, Stack, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import StrategyGraph from '../Graph/StrategyGraph';
//maArray, transactionHistory, accountValues

export default function MovingAverageResult({ maArray, transactionHistory, accountValues, companies }) {
    console.log('Moving Average Result: ', maArray)
    const [companyMovAvg, setCompanyMovAvg] = useState(null)
    const [history,setHistory] = useState(null);

    useEffect(() => {
        const updatedHistory = companies.map((company) => {
            return maArray.filter((comp) => comp.ticker === company);
        });
        setCompanyMovAvg(updatedHistory);
        const transaction = companies.map((company) => {
            return transactionHistory.filter((comp) => comp[company].ticker === company);
          });
          setHistory(transaction);

    }, [companies, maArray,transactionHistory])
    console.log("RESULT : ", history)
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
                    {companyMovAvg ? (
                        companyMovAvg.map((company) => (
                            <TabPanel key={company}  h={'auto'}>
                                <StrategyGraph data={company} dataName={'percentage'} aspect={6} color={'white'} />
                            </TabPanel>
                        ))
                    ):(
                        <Button isLoading loadingText="Loading" color="white" variant="outline"></Button>
                    )}
                </TabPanels>


            </Tabs>
            <Flex  direction={'row'} justify={'space-between'} >
            <Flex direction={'row'} >
                    <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
                        <Text color={'green.600'} fontSize={30}>${Number(accountValues[0]).toFixed(2)}</Text> 
                        <Text color={'black'} fontSize={30}>3 month</Text>

                    </Circle>
                    <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
                        <Text color={'green.600'} fontSize={30}>${Number(accountValues[1]).toFixed(2)}</Text> 
                        <Text color={'black'} fontSize={30}>6 month</Text>

                    </Circle>
                    <Circle m={2} bgColor={'white'} w={'200px'} h={'200px'} display={'flex'} flexDirection={'column'}>
                        <Text color={'green.600'} fontSize={30}>${Number(accountValues[2]).toFixed(2)}</Text> 
                        <Text color={'black'} fontSize={30}>1 year</Text>

                    </Circle>
                </Flex>
                <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
          <TabList p={1} >
            {companies.map((company)=>(
                <Tab >{company}</Tab>
            ))
            }
            
          </TabList>

          <TabPanels  >
          {history.map((company) => (
              <TabPanel key={company} overflow="scroll" h={'25vh'}>
                <Flex direction={'column'} justify={'space-between'} align={'center'}>
                  {company.map((c) => (
                    <Text key={c.ticker}>{c.ticker}</Text>
                  ))}
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>


        </Tabs>
            </Flex>
            


        </Flex>
    )
}