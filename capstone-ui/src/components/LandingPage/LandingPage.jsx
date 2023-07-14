import React from 'react'
import './LandingPage.css'
import {
  Stack,
  Flex,
  Link,
  Button,
  Text,
  VStack,
  useBreakpointValue,
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
      position={'absolute'}
    // filter= 'auto'
    // blur='2px'
    >
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.100,black)'}>

        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
            StockSim:
            Expert Finance
            Helping you take control of your finances
            This is a personal finance app that allows you to simulate buying and selling stocks.
            Create your account now

          </Text>
          <Stack direction={'row'}>
            <Button
              bg={'green.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'green.500' }}>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              bg={'whiteAlpha.600'}
              rounded={'full'}
              color={'black'}
              _hover={{ bg: 'green.100' }} >
              <Link href="/register">Register</Link>

            </Button>
          </Stack>
        </Stack>
      </VStack>


    </Flex>
  )
}
export default LandingPage
