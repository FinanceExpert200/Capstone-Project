import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Center,Text} from '@chakra-ui/react'
import {format, parseISO} from "date-fns"
import { AreaChart, Area,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart,Line } from 'recharts';

export default function MeanReversionGraph({data, dataName, aspect , color, thirty,twenty}) {
    console.log("THE ARRAY CALLED ", data)
    return (
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
                        if(date.getDate() % 4 === 0){
                            return format(date,"MMM,d")
                        }
                        return "";
                       }}/>
                <YAxis stroke={color} 
                       domain={['auto', 'auto']} 
                       tickCount={5}
                       tickFormatter={number => `${number}%`}/>
                <Tooltip content = {<CustomizeLabel color={color}/>}/>
                <Legend></Legend>
                <CartesianGrid opacity={.3} vertical={false}/>
                <Line
                  type="monotone"  
                  dataKey={dataName}
                  stroke="red" 
                //   fillOpacity={1}
                //   fill="url(#fade)"
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  
                  activeDot={1} />
                
                <Line
                  type="monotone"  
                  dataKey={thirty}
                  stroke="green" 
                //   fillOpacity={1}
                //   fill="url(#fade)"
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  
                  activeDot={1} />
                <Line
                  type="monotone"  
                  dataKey={twenty}
                  stroke="brown" 
                //   fillOpacity={1}
                //   fill="url(#fade)"
                  dot={{ fill: 'transparent', stroke:'transparent'}}
                  
                  activeDot={1} />
            </LineChart>
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
                
                <Text color={color}>{payload[0].value.toFixed(2)}</Text>
            </Box>
        )
    }

}
// content = {<CustomizeLabel color={color}/>}