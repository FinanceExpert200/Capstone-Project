import {React,useState} from "react";
import {Box,Flex,Heading,Text} from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";


export default function ResultMeanReversion({accountValue, transactionHistory, thrityDayAverage, twentyDayAverage,companies }){
    
    return (
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
        <Heading>Mean Reversion</Heading>
        <StrategyGraph data={twentyDayAverage} dataName={'average'} aspect={4} color={'white'}/>
        

    </Flex>
    )
}