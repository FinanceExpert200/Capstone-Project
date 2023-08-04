import React from 'react'
import './LandingPage.css'
import {
  Stack,
  Flex,
  Link,
  Button,
  Text,
  VStack,
  Grid,
  useBreakpointValue,
} from '@chakra-ui/react';
//'url(https://www.nasdaq.com/sites/acquia.prod/files/image/29525db076bcc42505a356e55dbe94f38b28530b_getty-stock-market-data.jpg?1170962425)'
//https://images.unsplash.com/photo-1642790403805-a3835434499e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3590&q=80
//https://images.unsplash.com/photo-1642790261487-5b7e444c0dce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2858&q=80
const LandingPage = () => {
  return (
    <Flex
      w="full"
      h="100vh"
      backgroundImage="url(https://images.unsplash.com/photo-1642790261487-5b7e444c0dce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2858&q=80)"
      backgroundSize="cover"
      backgroundPosition="center center"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      
    >
    <VStack
    w="full"
    h="100vh"
    justify={'center'}
    px={useBreakpointValue({ base: 4, md: 8 })}
    bgGradient="linear(to-l, blackAlpha.500, black)">

    <Grid
    w={'full'}
    templateColumns={{ base: '1fr', md: '1fr 1fr' }} // 1 column in small screens, 2 columns in medium and above
    gap={3}
    maxWidth="8xl"
    px={useBreakpointValue({ base: 4, md: 8 })}
    
  >
    <Flex flexDirection="column" alignItems="flex-start">
      <Text
        color="white"
        fontWeight={700}
        lineHeight={1.2}
        fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
      >
        StockSwap
      </Text>
      <Text
        fontWeight={700}
        fontSize={50}
        bgGradient="linear(to-l, green.100, green)"
        bgClip="text">
        Give Your Future A Chance
      </Text>

      <Text
        color={'#cccbcc'}
        mt={3}
        mb={3}>
        With us you can make better choices.
      </Text>
      
    <Flex direction={'row'} mt ={4} >
      <Button  bg='#1ecc97' rounded="full" color="white" _hover={{ bg: 'green.500' }}>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button bg="whiteAlpha.600" rounded="full" color="black" _hover={{ bg: 'green.100' }}>
        <Link href="/register">Register</Link>
      </Button>
    </Flex>
    </Flex>
  </Grid>
    </VStack>
</Flex>
  )
}
export default LandingPage

   