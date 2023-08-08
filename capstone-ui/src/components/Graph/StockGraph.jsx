import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react'
import { format, parseISO } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, Label,CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockGraph({ priceList }) {

  return (
    <ResponsiveContainer width="100%" >
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
          <stop offset="5%" stopColor="#1ecc97" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#6d51dc" stopOpacity={0} />
        </linearGradient>
        <linearGradient id='netflix' x1="0" y1="0" x2="0" y2="1">
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
        <Tooltip content = {<CustomizeLabel color={'black'}/>}/>
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
          stroke="#1ecc97"
          fillOpacity={.5}
          fill="url(#crm)"
          activeDot={{ r: 4 }} />
        <Area
          type="monotone"
          dataKey="NFLX"
          stroke="#1ecc97"
          fillOpacity={.5}
          fill="url(#crm)"
          activeDot={{ r: 4 }} />



      </AreaChart>
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
        <Text color={'white'}>{payload[0].name} : ${payload[0].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[1].name} : ${payload[1].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[2].name} : ${payload[2].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[3].name} : ${payload[3].value.toFixed(2)}</Text>
        <Text color={'white'}>{payload[4].name} : ${payload[4].value.toFixed(2)}</Text>
      </Box>
    )
  }

}