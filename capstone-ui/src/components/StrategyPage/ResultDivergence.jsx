import React from 'react'
import { useState, useEffect } from 'react'
import {
  Heading, Button, Box, Center, Circle, Square, Stack,
  Text, Flex, Container, Divider, Tag,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import SingleStockGraph from '../Graph/SingleStockGraph';
import { format, parseISO } from "date-fns"

export default function ResultDisplay({ accountValues, transactionHistory, rsi, companies, buyingPower }) {
  const [history, setHistory] = useState([])
  console.log("The history: ", rsi)
  useEffect(() => {
    const updatedHistory = companies.map((company) => {
      return transactionHistory.filter((comp) => comp.ticker === company);
    });
    setHistory(updatedHistory);

  }, [companies, transactionHistory])
  //const meta = transactionHistory.filter(company => company.ticker === companies[0])
  console.log("THE RSI : ", history)


  return (
    <Flex direction={'column'} w={'full'} h={'full'} mt={10} p={10} textColor={'#03314b'}>
      <Box bgColor={'#03314b'} minH={'30vh'} w={'full'} p={7}>
        <Flex direction={'row'} w={'full'} justify={'space-between'} textColor={'white'}>
          <Heading fontWeight={'light'}>Divergence Strategy</Heading>
          <Tag fontSize={'23'} bg="whiteAlpha.600">Buying Power : ${buyingPower}</Tag>

        </Flex>

      </Box>
      <Container color='#edf0f5' p={4} w={'full'} mt={'-120px'}  h={300} boxShadow={'0,2px,5px,rgba(0,0,0,0.2)'}>
        <Flex direction={'row'} justify={'space-between'} 
              bgColor={'#edf0f5'} borderRadius={'5'} 
              pl={3} pr={3} boxShadow={'20px 20px 30px grey'}>
          <Square w={'auto'} h={'200px'} 
            display={'flex'} flexDirection={'column'}
            justify={'center'}
          >
            <Text color={Number(accountValues[0]) < 0 ? 'red.600' : '#1ecc97'} fontSize={30}>${Number(accountValues[0]).toFixed(2)}</Text>
            <Text color={'gray.500'} fontSize={25}>3 Month Profit</Text>
          </Square>

          <Box display="flex" alignItems="center">
            <Divider orientation="vertical" h="100px" borderColor="gray.300" />
          </Box>

          <Square w={'auto'} h={'200px'}
            display={'flex'} flexDirection={'column'}
          >
            <Text color={Number(accountValues[1]) < 0 ? 'red.600' : '#1ecc97'} fontSize={30}>${Number(accountValues[1]).toFixed(2)}</Text>
            <Text color={'gray.500'} fontSize={25}>6 Month Profit</Text>
          </Square>

          <Box display="flex" alignItems="center">
            <Divider orientation="vertical" h="100px" borderColor="gray.300" />
          </Box>

          <Square w={'auto'} h={'200px'} 
            display={'flex'} flexDirection={'column'}>
            <Text color={Number(accountValues[2]) < 0 ? 'red.600' : '#1ecc97'} fontSize={30}>${Number(accountValues[2]).toFixed(2)}</Text>
            <Text color={'gray.500'} fontSize={25}>1 Year Profit</Text>
          </Square>

        </Flex>
      </Container>

      <Box w={'full'} p={5} bgColor={'#03314b'} borderRadius={10}>
      <SingleStockGraph data={rsi} dataName="RSI" aspect={4} color={'#b4abaf'} />
      </Box>

      <Flex direction={'row'} justify={'space-between'} >
      <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
          <TabList  >
            {companies.map((company) => (
              <Tab _selected={{ color: 'white', bg: '#03314b' }} 
              _hover={{ bg: "green.500", color: "white" }}>{company}</Tab>
            ))
            }

          </TabList>
          <TabPanels>
            {history.map((company) => (
              <TabPanel key={company} overflow="scroll" h={'25vh'}>
                <TableContainer>
                  <Table variant='simple'>
                    <TableCaption>Description</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Date</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody overflow="scroll" h={'20vh'}>
                      {company.map((c) => (
                        <Tr >
                          <Td>{c.ticker}</Td>
                          <Td>{format(parseISO(c.date), "MMM, d, yyyy")}</Td>
                          <Td><Tag bg="whiteAlpha.600">{c.type.slice(0, 1).toUpperCase() + c.type.slice(1, c.type.length)}</Tag></Td>
                          <Td isNumeric>${c.price.toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Date</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Price</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </TabPanel>
            ))}

          </TabPanels>


        </Tabs>


      </Flex>

    </Flex>
  )
}
