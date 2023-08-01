import {React,useState,useEffect} from "react";
import {Box,Flex,Heading,Text} from '@chakra-ui/react'
import StrategyGraph from "../Graph/StrategyGraph";


export default function ResultMeanReversion({accountValue, transactionHistory, thrityDayAverage, twentyDayAverage,companies }){
    const companyArray = [];
    const [carray,setCarray] = useState([])
useEffect(() => {
  const updatedHistory = companies.map((company) => {
    const c = thrityDayAverage.filter((comp) => comp.ticker === company);
    const t = twentyDayAverage.filter((comp)=> comp.ticker === company);
    console.log("TWENTY DAY: ",t)
    return { [company]: c };
  });
  console.log("UPDATED:" , updatedHistory)
  setCarray(updatedHistory)

}, [companies, thrityDayAverage])

    console.log("THE ARRAY",carray)
    return (
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
        <Heading>Mean Reversion</Heading>
        <StrategyGraph data={twentyDayAverage} dataName={'average'} aspect={4} color={'white'}/>
        

    </Flex>
    )
}