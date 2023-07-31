import React from 'react'
import { useState,useEffect } from 'react'
import { Heading,Button,Box,Center,Circle,Square,Stack,Text,Flex,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import StrategyGraph from '../Graph/StrategyGraph';
//maArray, transactionHistory, accountValues

export default function MovingAverageResult({maArray, transactionHistory, accountValues}){
    console.log('Moving Average Result: ', maArray)
    return (
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
            <Heading>Moving Average</Heading>
            <StrategyGraph data={maArray} dataName={'percentage'} aspect={4} color={'white'}/>
            

        </Flex>
    )
}