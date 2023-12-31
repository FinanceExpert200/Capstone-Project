import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { format, parseISO } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, Label,CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '@chakra-ui/icons'
// import { relative } from 'path';


export default function StockGraph({ priceList }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(priceList)

  return (
    <Box width="100%" h={'80vh'} position={'relative'}>
      <ResponsiveContainer  >
        <AreaChart
          data={priceList}
          margin={{
            top: 5,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
          <linearGradient id='meta' x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#03314b" stopOpacity={0.8} />
            <stop offset="60%" stopColor="white" stopOpacity={0} />
          </linearGradient>
          <linearGradient id='amzn' x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="red" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#db101f" stopOpacity={0} />
          </linearGradient>
          <linearGradient id='google' x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="white" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#47ff2e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id='crm' x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="#0331b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="white" stopOpacity={0} />
          </linearGradient>
          <linearGradient id='nflx' x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1ecc97" stopOpacity={0.8} />
            <stop offset="95%" stopColor="white" stopOpacity={0} />
          </linearGradient>

          </defs>

          <XAxis stroke={'#03314b'}
            dataKey={'date'}
            tickLine={false}
            tickFormatter={string => {
              const date = parseISO(string);
              if (date.getDate() % 3 === 0) {
                return format(date, "MMM,d")
              }
              return "";
            }} >
              <Label fill={'#03314b'} value="Date" offset={0} position="insideBottom" />
            </XAxis>
          <YAxis 
            fontSize={15}
            stroke={'#03314b'}
            domain={['auto', 'auto']}
            tickCount={5}
            tickSize={0}
            tickFormatter={number => `$${number.toFixed(2)}`}>
              <Label style={{
                textAnchor: "middle",
                fontSize: "100%",
                fill: "black",
              }}
              position={'left'}
              angle={270}
              marginRight={5}
              value="Opening Price" 
              offset={13} />
            </YAxis>
          <Tooltip content={<CustomizeLabel color={'black'} />}/>
          <Legend verticalAlign="top" height={36}/>
          <CartesianGrid opacity={.3} vertical={false}/>
          <Area
            type="monotone"
            dataKey="META"
            stroke="#03314b"
            fillOpacity={.7}
            fill="url(#meta)"
            activeDot={{ r: 4 }} />
          <Area
            type="monotone"
            dataKey="AMZN"
            stroke="red"
            fillOpacity={.5}
            fill="url(#amzn)"
            activeDot={{ r: 4 }} />
          <Area
            type="monotone"
            dataKey="GOOGL"
            stroke="green"
            fillOpacity={.5}
            fill="url(#google)"
            activeDot={{ r: 4 }} />
          <Area
            type="monotone"
            dataKey="CRM"
            stroke="#0331b"
            fillOpacity={.5}
            fill="url(#crm)"
            activeDot={{ r: 4 }} />
          <Area
            type="monotone"
            dataKey="NFLX"
            stroke="#1ecc97"
            fillOpacity={.5}
            fill="url(#nflx)"
            activeDot={{ r: 4 }} />
          
          </AreaChart>
        </ResponsiveContainer>
        <IconButton
            boxSize={5}
            aria-label="info"
            icon={<InfoIcon color="#03314b" boxSize={5} />} // Color and boxSize have been matched to your InfoIcon
            position="absolute"
            top="5px"
            right="5px"
            bg="transparent" // To remove background color
            _hover={{ bg: "transparent" }} // To remove hover effect
            zIndex="2"
            onClick={onOpen}
        />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Historical Closing Price Chart</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    This chart shows how the prices of stocks for four big tech companies - Facebook (now called META), Amazon (AMZN), Google (GOOGL), Netflix (NFLX), and Salesforce (CRM) - have changed over a year. By looking at this chart, you can see how well these companies did on the stock market and get a sense of the ups and downs they experienced. This data can be a very important tool for making trades in the future. 
                    </ModalBody>
                </ModalContent>
            </Modal>

      </Box>
  )

} 
function CustomizeLabel({ active, payload, label, color }) {
  if (active) {
    return (
      <Box bgColor={'blackAlpha.700'}  justify={'center'} p={3}>
        <Text color={'white'}>
          {format(parseISO(label), "eeee,d MMM, yyyy")}
        </Text>
        <Text color={'white'}>{payload[0].name} : ${payload[0].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[1].name} : ${payload[1].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[2].name} : ${payload[2].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[3].name} : ${payload[3].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[4].name} : ${payload[4].value.toFixed(2)}</Text>
      </Box>
    )
  }

}