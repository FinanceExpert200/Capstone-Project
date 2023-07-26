import React from 'react';
import './TransactionTable.css';
import { useState, useEffect } from 'react';
import { Box, Center, Image, Text, Flex, Stack } from '@chakra-ui/react'

const TransactionTable = ({ transactionHistory, stockData, fixedDate }) => {
  const [array, setArray] = useState([]);
  const [mergeChecker, setMergeChecker] = useState(false)
  //convert the stockData object to an array

  useEffect(() => {
    if (transactionHistory && stockData) {
      const test = Object.values(stockData);
      const mergedArray = [];
      transactionHistory.forEach((transaction) => {
        const matchedStock = test.find((stock) => stock.stockName === transaction.ticker);
        if (matchedStock) {
          mergedArray.push({
            id: transaction.id,
            stockName: matchedStock.stockName,
            company: matchedStock.company,
            logo: matchedStock.logo,
            curr_price: transaction.curr_price,
            created_at: transaction.created_at,
            quantity: transaction.quantity,
            trans_type: transaction.trans_type,
            user_id: transaction.user_id,

          });
        }
      });


      setArray(mergedArray);
      setMergeChecker(true);
    }
  }, [stockData, transactionHistory])
  //console.log("TEST",array);

  return (
    <Center
      w={'full'}
      position={'absolute'}
      bgColor={'#000409'}>
      <Box p={20} w={'full'} >
        <Center w={'full'} as={'h1'} fontWeight={'bold'} justifyContent={'center'} color={'#14AE5C'} >Transaction</Center>
        <Stack direction={'column'} w={'full'}>
          {mergeChecker &&
            array.map((transaction) => (
              <Stack borderRadius={10} position={'relative'} bgColor={'#757575'} m={1} color={'#E6E6E6'} key={transaction.id} display={'flex'} flexDirection={'column'} p={5}>

                <Stack justify={'space-between'} direction={'row'} w={'full'}>
                  {transaction.trans_type === "buy" ? (
                    <Text borderRadius={3} bgColor={'green.800'} color={'#14AE5C'}
                      fontWeight={'bold'} pl={2} pr={2}
                      fontSize={'20px'}>
                      {transaction.trans_type}
                    </Text>
                    ) : (
                    <Text borderRadius={3} bgColor={'red.800'} color={'#14AE5C'}
                      fontWeight={'bold'} pl={2} pr={2}
                      fontSize={'20px'}>
                      {transaction.trans_type}
                    </Text>
                  )}

                  <Text justify="right" fontSize={'20px'}>{fixedDate(transaction.created_at)}</Text>
                </Stack>

                <Stack direction={'row'} spacing={5} justify={'space-between'}>

                  <Stack direction={'row'} spacing={5}>
                    <Image src={transaction.logo} w={100} h={100} borderRadius={'full'} bgColor={'#b0aeb8'} />

                    <Stack direction={'column'} spacing={0} mt={3}>

                      <Text as={'h1'} fontWeight={'bold'} mb={0}>{transaction.stockName}</Text>
                      <Text>{transaction.company}</Text>
                    </Stack>

                  </Stack>

                  <Stack direction={'column'} justify="flex-end" >
                    <Text  as={'h1'} fontWeight={'bold'} mb={0}>${transaction.curr_price}</Text>
                    <Text ml={125} fontSize={'20px'}>{transaction.quantity} Stock</Text>
                  </Stack>
                </Stack>

              </Stack>
            ))}

        </Stack>
      </Box>

    </Center>
  );
};

export default TransactionTable;
