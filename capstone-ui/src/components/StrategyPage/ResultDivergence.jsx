import React from 'react'
import { useState,useEffect } from 'react'
import { Heading,Button,Box,Center,Circle,Square,Stack,Text,Flex,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import SingleStockGraph from '../Graph/SingleStockGraph';

export default function ResultDisplay ({accountValues,transactionHistory,rsi,companies}){
    const [history,setHistory] = useState([])
    console.log("The history: ", transactionHistory)
    useEffect(()=>{
        const updatedHistory = companies.map((company) => {
            return transactionHistory.filter((comp) => comp.ticker === company);
          });
          setHistory(updatedHistory);

    },[companies,transactionHistory])
    //const meta = transactionHistory.filter(company => company.ticker === companies[0])
    console.log("THE RSI : " ,history)


    return (
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
            <Heading fontWeight={'light'} fontSize={'80px'} alignSelf={'center'}>Divergence</Heading>
            <SingleStockGraph data={rsi} dataName="RSI" aspect={4} color={'white'} />
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
