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
                            if (date.getDate() % 3 === 0) {
                                return format(date, "MMM,d")
                            }
                            return "";
                        }}>
                        <Label fontSize="100%" fill="black"  value="Date" offset={0} position="insideBottom" />
                    </XAxis>

                    <YAxis stroke={color}
                        domain={['auto', 'auto']}
                        tickCount={5}
                        tickSize={-1}
                        tickFormatter={number => `$${number.toFixed(2)}`}>
                        <Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "100%",
                                fill: "black",
                            }}
                            position={'left'}
                            marginLeft={10}
                            angle={270}
                            value={"Index"}
                            offset={15}  />
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
                icon={<InfoIcon />}
                position="absolute"
                top="5px"
                right="5px"
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Stock Data</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This graph represents the stock data for a single stock over the course of 30 days. 
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

function CustomizeLabel({ active, payload, label, color }) {
    if (active) {
        return (
            <Box bgColor={'blackAlpha.700'} justify={'center'} p={3}>
                <Text color={'white'}>
                    {format(parseISO(label), "eeee,d MMM, yyyy")}
                </Text>

                <Text color={'white'}> Closing Price : ${payload[0].value.toFixed(2)}</Text>

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
