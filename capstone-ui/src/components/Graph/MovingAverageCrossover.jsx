import React from 'react';
import { format, parseISO } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import { Box, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons'

export default function StrategyGraph({ data, dataName, aspect, color }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box position="relative">
            <ResponsiveContainer width={'100%'} aspect={aspect}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 0,
                    }}>
                    <defs>
                        <linearGradient id='fade' x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca89" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <XAxis stroke={color}
                        dataKey={'date'}
                        tickLine={false}
                        tickFormatter={string => {
                            const date = parseISO(string);
                            if (date.getDate() % 0 === 0) {
                                return format(date, "MMM,d")
                            }
                            return "";
                        }}>
                        <Label stroke={color} value="Date" offset={0} position="insideBottom" />
                    </XAxis>

                    <YAxis stroke={color}
                        domain={['auto', 'auto']}
                        tickCount={5}
                        tickFormatter={number => `${number}%`}>
                        <Label style={{
                            textAnchor: "middle",
                            fontSize: "100%",
                            fill: "white",
                        }}
                            position={'left'}
                            angle={270} stroke={color}
                            marginRight={5}
                            value="Average Price (%)" 
                            offset={13} />
                    </YAxis>
                    
                    <Tooltip content={<CustomizeLabel color={'black'} />}/>
                    <Legend verticalAlign="top" height={36} />
                    <CartesianGrid opacity={.3} vertical={false} />

                    <Area
                        type="monotone"
                        dataKey={dataName}
                        stroke="green"
                        fillOpacity={1}
                        fill="url(#fade)"
                        dot={{ fill: 'transparent', stroke: 'transparent' }}
                        activeDot={1} />
                </AreaChart>
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
                    <ModalHeader>Moving Average Crossover</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This graph shows how the <Text as="b" color="green.500">average price</Text> of a certain stock has changed from a year ago until now. When the average price <Text as="b" color="red.500">drops below a certain point</Text>, it's a good time to <Text as="b" color="green.500">buy</Text> the stock. On the other hand, when the average price <Text as="b" color="red.500">goes up past a certain point</Text>, it's a good time to <Text as="b" color="red.500">sell</Text> the stock.
  
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
            {/* {format(parseISO(label), "eeee,d MMM, yyyy")} */}
            {label}
          </Text>
          <Text color={'white'}>Average Price: {payload[0].value.toFixed(2)}%</Text>
        </Box>
      )
    }
  
  }