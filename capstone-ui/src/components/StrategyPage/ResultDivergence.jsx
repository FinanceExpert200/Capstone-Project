import React from 'react'
import { useState } from 'react'
import { Heading,Button,Box,Center,Square,Stack,Text,Flex } from '@chakra-ui/react';
import SingleStockGraph from '../Graph/SingleStockGraph';

export default function ResultDisplay ({accountValues,transactionHistory,rsi}){
    console.log("THE RSI : " ,rsi)
    console.log("The history: ", transactionHistory)

    return (
        <Flex direction={'column'} w={'full'} mt={10} p={10}>
            <Heading fontWeight={'light'} fontSize={'80px'} alignSelf={'center'}>Divergence</Heading>
            <Flex  direction={'row'} justify={'space-between'} >
                <Flex direction={'column'} >
                <Flex direction={'row'} justify={'space-between'} fontSize={'50px'}>
                    <Stack m={3}>
                        <Text color={'green.600'}>${Number(accountValues[0]).toFixed(2)}</Text>
                        <Text>3 month</Text>

                    </Stack>
                    <Stack m={3}>
                        <Text color={'green.600'}>${Number(accountValues[1]).toFixed(2)}</Text>
                        <Text>6 month</Text>

                    </Stack>
                    <Stack m={3}>
                        <Text color={'green.600'}>${Number(accountValues[2]).toFixed(2)}</Text>
                        <Text>1 year</Text>

                    </Stack>
                </Flex>
                </Flex>

                <Box>
                    <Text>Container with three different time stamps</Text>
                    
                </Box>
            </Flex>
            <SingleStockGraph data={rsi} dataName="RSI" aspect={4} color={'black'} />

        </Flex>
    )
}