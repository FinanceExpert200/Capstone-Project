import React from 'react';
import { format, parseISO } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import { MinusIcon } from '@chakra-ui/icons';
import { Box, Center, Text, Tag, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons'

export default function SingleStockGraph({ data, dataName, aspect, color }) {
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
                            if (date.getDate() % 1 === 0) {
                                return format(date, "MMM,d")
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
                            value={"Index"} />
                    </YAxis>
                    
                    <Tooltip content={<CustomizeLabel color={color} />} />
                    <Legend verticalAlign="top" height={36} content={renderLegend} />
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
                <ModalHeader fontSize="2xl" fontWeight="bold">RSI Divergence</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="md">
                        The Relative Strength Index (RSI) is a tool that helps us understand if a stock is being bought too much (overbought) or sold too much (oversold).<br/>
                        <br/>
                        Imagine it like a car race where the cars are the prices of stocks. If a car (stock price) has been going too fast for too long (overbought), it might need to slow down. On the other hand, if a car (stock price) has been going too slow for too long (oversold), it might have the energy to speed up.<br/>
                        <br/>
                        The RSI provides us with a score between 0 and 100. A score above 70 typically means the stock might be overbought (going too fast), so it might slow down (price might drop). A score below 30 means the stock might be oversold (going too slow), so it might speed up (price might rise).<br/>
                        <br/>
                        By looking at the RSI, traders can make guesses about what might happen to a stock's price in the near future. But remember, these are just educated guesses and not definite predictions.
                    </Text>
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

                <Text color={color}>Closing Price : ${payload[0].value.toFixed(2)}</Text>

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
                    <Tag key={`item-${index}`} mr={3} bg="whiteAlpha.600">
                        <MinusIcon color={'green'} />{entry.value}</Tag>
                ))
            }
        </>

    );
}
