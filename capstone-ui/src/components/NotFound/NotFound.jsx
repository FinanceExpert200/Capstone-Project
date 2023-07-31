import React from "react";
import {Box,Center,Heading,Image,Text} from '@chakra-ui/react'

export default function NotFound () {
   return(
    <Center
        w={'full'}
        h={'100vh'}
        position={'absolute'}
        bgColor={'#171923'} 
        flexDirection={'column'}
    >
       <Heading fontSize={60}  color={'white'}>404</Heading>
       <Heading color={'white'}>Page Not Found</Heading>

    </Center>
   )

    
}