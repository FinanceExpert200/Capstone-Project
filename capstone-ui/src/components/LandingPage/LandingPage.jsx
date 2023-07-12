import React from 'react'
import './LandingPage.css'
import {
    Stack,
    Flex,
    Link,
    Box,
    AbsoluteCenter,
    Center,
    Button,
    Text,
    VStack,
    useBreakpointValue,
    Container,
} from '@chakra-ui/react';
//
const LandingPage = () => {
    return (
        <Flex
            w={'full'}
            h={'100vh'}
            backgroundImage={
                'url(https://www.nasdaq.com/sites/acquia.prod/files/image/29525db076bcc42505a356e55dbe94f38b28530b_getty-stock-market-data.jpg?1170962425)'
            }
            backgroundSize={'cover'}
            backgroundPosition={'center center'}
            justifyContent={'center'}
        // filter= 'auto'
        // blur='2px'
        >
        <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, green)'}>
  
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
            StockSim
          </Text>
          <Stack direction={'row'}>
            <Button
              bg={'blue.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}>
              Sign In
            </Button>
            <Button
              bg={'whiteAlpha.300'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'whiteAlpha.500' }}>
                <Link href= "/register">Register</Link>
              
            </Button>
          </Stack>
        </Stack>
      </VStack>
           

        </Flex>
    )
}
export default LandingPage
{/* <Box position='relative' m='100px' >
    <Center bg='tomato' p='20' color='white' axis='both' >
        This is the pre main page 
    </Center>
</Box>
    {/* <Center bg = 'grey' height={'100px'}>
        This is the pre main page
    </Center> */} 