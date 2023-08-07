import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { format, parseISO } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, Label,CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InfoIcon } from '@chakra-ui/icons'


export default function StockGraph({ priceList }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position = {"relative"}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <AreaChart
          data={priceList}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
          <linearGradient id='meta' x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
            <stop offset="5%" stopColor="purple" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6d51dc" stopOpacity={0} />
          </linearGradient>

          </defs>

          <XAxis stroke={'#03314b'}
            dataKey={'date'}
            tickLine={false}
            tickFormatter={string => {
              const date = parseISO(string);
              if (date.getDate() % 4 === 0) {
                return format(date, "MMM,d")
              }
              return "";
            }} >
              <Label stroke={'#03314b'} value="Date" offset={0} position="insideBottom" />
            </XAxis>
          <YAxis 
            fontSize={15}
            stroke={'#03314b'}
            domain={['auto', 'auto']}
            tickCount={5}
            tickFormatter={number => `$${number.toFixed(2)}`}>
              <Label style={{
                textAnchor: "middle",
                fontSize: "100%",
                fill: "white",
              }}
              position={'left'}
              angle={270}stroke={'#03314b'} 
              marginRight={5}
              value="Opening Price" 
              offset={13} />
            </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <CartesianGrid opacity={.3} vertical={false}/>
          <Area
            type="monotone"
            dataKey="META"
            stroke="blue"
            dot="none"
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
            stroke="#6d51dc"
            fillOpacity={.5}
            fill="url(#crm)"
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