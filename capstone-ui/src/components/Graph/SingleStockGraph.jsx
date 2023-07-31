import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Center,Text} from '@chakra-ui/react'
import {format, parseISO} from "date-fns"
import { AreaChart, Area,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SingleStockGraph({data, dataName, aspect , color}) {
    return (
        <ResponsiveContainer  width={'100%'}  aspect={aspect}>
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
                    <stop offset="5%" stopColor="#82ca89" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>

                </defs>

                <XAxis stroke={color} 
                       dataKey={'date'}
                       tickLine={false}
                       tickFormatter={string => {
                        const date = parseISO(string);
                        if(date.getDate() % 4 === 0){
                            return format(date,"MMM,d")
                        }
                        return "";
                       }}/>
                <YAxis stroke={color} 
                       domain={['auto', 'auto']} 
                       tickCount={5}
                       tickFormatter={number => `$${number.toFixed(2)}`}/>
                <Tooltip content = {<CustomizeLabel color={color}/>}/>
                <Legend></Legend>
                <CartesianGrid opacity={.3} vertical={false}/>
                <Area
                  type="monotone"  
                  dataKey={dataName}
                  stroke="green" 
                  fillOpacity={1}
                  fill="url(#fade)"
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  
                  activeDot={1} />
            </AreaChart>
        </ResponsiveContainer>
    )
}
function CustomizeLabel ({active, payload, label, color}){
    if(active){
        return (
            <Box bgColor={'black'} justify={'center'}>
                <Text color={'white'}>
                {format(parseISO(label), "eeee,d MMM, yyyy")}
                </Text>
                
                <Text color={color}>${payload[0].value.toFixed(2)}</Text>
            </Box>
        )
    }

}