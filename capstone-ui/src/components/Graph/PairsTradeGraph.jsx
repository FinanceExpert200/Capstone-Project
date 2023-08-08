import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Tag } from '@chakra-ui/react';
import {format, parseISO} from "date-fns"
import { AreaChart, Area,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { LineChart,Line,Label } from 'recharts';
import{MinusIcon, InfoIcon} from '@chakra-ui/icons'

export default function PairsTradeGraph({data, historical , aspect , color, priceRatio}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
    console.log("THE ARRAY CALLED ", data)
    return (
      <Box position = "relative">
        <ResponsiveContainer  width={'100%'}  aspect={aspect}>
            <LineChart
             data={data}
             margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 0,

            }}>

          <XAxis stroke={color} 
                  dataKey={'date'}
                  tickLine={false}
                  tickFormatter={string => {
                  const date = parseISO(string);
                  if(date.getDate() % 1 === 0){
                      return format(date,"MMM,d")
                  }
                  return "";
                  }}>
                    <Label fontSize="100%" fill="white" stroke={'white'} value="Date" offset={0} position="insideBottom" />
                  </XAxis>
          <YAxis stroke={color} 
                  domain={['auto', 'auto']} 
                  tickCount={5}
                  tickFormatter={number => `${number.toFixed(2)}`}>
                  <Label
            style={{
              textAnchor: "middle",
              fontSize: "100%",
              fill: "white",
            }}
            position={'left'}
            angle={270}
            value={"Price Ratio"} />
                       </YAxis>
                <Tooltip content = {<CustomizeLabel color={color}/>}/>
                <Legend verticalAlign="top" height={36} content={renderLegend}></Legend>
                <CartesianGrid opacity={.3} vertical={false}/>
                <Line
                  type="monotone"  
                  dataKey={historical}
                  stroke="red" 
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  
                  activeDot={1} />
                
                <Line
                  type="monotone"  
                  dataKey={priceRatio}
                  stroke="green" 
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  activeDot={1} />
            </LineChart>
        </ResponsiveContainer>
        

        <IconButton
          aria-label="info"
          icon={<InfoIcon boxSize={5} cursor="pointer" color={"white"}/>}
          background = "transparent"
          position="absolute"
          top="5px"
          right="5px"
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Pairs Trading Chart</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text as="b">Price Ratio:</Text> This is a way of comparing the prices of two different stocks. For example, if we're looking at Stock A and Stock B, the price ratio is found by dividing the price of Stock A by the price of Stock B. This tells us how the two stocks are doing in relation to each other. If the price ratio is high, that means Stock A's price is high compared to Stock B's. If it's low, that means Stock B's price is high compared to Stock A's. <br/><br/>

                <Text as="b" color="blue.500">Historical Mean:</Text> The historical mean is just an average of the price ratio over a certain period of time in the past. It gives us a sense of what's "normal" for the price ratio. If the price ratio is way above or below the historical mean, that could be a sign that something unusual is happening with the prices of Stock A and Stock B. <br/><br/>

                <Text as="b" color="green.500">When the 'price ratio' line goes above the 'historical mean' line by a certain amount</Text>, that's our cue to <Text as="b" color="red.500">buy Stock A and sell Stock B</Text>. But if the <Text as="b" color="green.500">'price ratio' line drops a certain amount below the 'historical mean' line</Text>, we do the opposite - we <Text as="b" color="red.500">buy Stock B and sell Stock A</Text>.
            </ModalBody>
        </ModalContent>
        </Modal>
       </Box>
    )
}
function CustomizeLabel({ active, payload, label, color }) {
    if (active) {
      return (
        <Box bgColor={'black'} justify={'center'} p={3}>
          <Text color={'white'}>
            {format(parseISO(label), "eeee,d MMM, yyyy")}
          </Text>
  
          <Text color={color}>historical Mean : ${payload[0].value.toFixed(2)}</Text>
          <Text color={color}>Price Ratio: ${payload[0].value.toFixed(2)}</Text>
          
        </Box>
      )
    }
  
  }
  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <>
        {
          payload.map((entry, index) => (
            <Tag key= {index === 0 ? 'red' : 'green'} 
                 mr={3} bg="whiteAlpha.600">
              <MinusIcon color={'green'}/>{entry.value}</Tag>
          ))
        }
      </>
   
    );
  }
// content = {<CustomizeLabel color={color}/>}