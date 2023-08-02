import { React, useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import MeanReversionGraph from "../Graph/MeanReversionGraph";

export default function ResultMeanReversion({ accountValue,transactionHistory,companies,priceRatioArray,test }) {
    console.log("account:___", accountValue)
    console.log("history:___", transactionHistory)
    console.log("TEST: ", test)
    console.log("companies:___", companies)
    console.log("arrayyy:___", priceRatioArray)
    return(
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
            <MeanReversionGraph data={priceRatioArray} aspect={4} color={'white'} dataName={'priceRatio'}/>
        </Flex>
    )

}