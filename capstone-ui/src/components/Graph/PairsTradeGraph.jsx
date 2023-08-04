import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Center,Text,Tag} from '@chakra-ui/react'
import {format, parseISO} from "date-fns"
import { AreaChart, Area,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart,Line,Label } from 'recharts';
import{MinusIcon} from '@chakra-ui/icons'

export default function PairsTradeGraph({data, historical , aspect , color, priceRatio}) {
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