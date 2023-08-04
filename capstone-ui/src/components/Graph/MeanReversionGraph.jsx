import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Center, Text,Tag } from '@chakra-ui/react'
import { format, parseISO } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line,Label } from 'recharts';
import{MinusIcon} from '@chakra-ui/icons'

export default function MeanReversionGraph({ data, dataName, aspect, color, thirty, twenty }) {
  //console.log("THE ARRAY CALLED ", data)
  return (
    <ResponsiveContainer width={'100%'} aspect={aspect}>
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
          tickFormatter={number => `${number}`}>
          <Label
            style={{
              textAnchor: "middle",
              fontSize: "100%",
              fill: "white",
            }}
            position={'left'}
            angle={270}
            value={"Averages"} /></YAxis>
        <Tooltip content = {<CustomizeLabel color={color}/>}/>
        <Legend verticalAlign="top" height={36} content={renderLegend}></Legend>
        <CartesianGrid opacity={.3} vertical={false} />
        <Line
          type="monotone"
          dataKey={dataName}
          stroke="red"
          //   fillOpacity={1}
          //   fill="url(#fade)"
          dot={{ fill: 'transparent', stroke: 'transparent' }}

          activeDot={1} />

        <Line
          type="monotone"
          dataKey={thirty}
          stroke="green"
          //   fillOpacity={1}
          //   fill="url(#fade)"
          dot={{ fill: 'transparent', stroke: 'transparent' }}

          activeDot={1} />
        <Line
          type="monotone"
          dataKey={twenty}
          stroke="brown"
          //   fillOpacity={1}
          //   fill="url(#fade)"
          dot={{ fill: 'transparent', stroke: 'transparent' }}

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

        <Text color={color}>Closing Price : ${payload[0].value.toFixed(2)}</Text>
        <Text color={color}>30 Day Average : ${payload[1].value.toFixed(2)}</Text>
        <Text color={color}>120 Day Average : ${payload[2].value.toFixed(2)}</Text>
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
            <MinusIcon color={index === 0 ? ('red') : index === 1 ? 'green' : 'brown'}
            
          />{entry.value}</Tag>
        ))
      }
    </>
 
  );
}
// content = {<CustomizeLabel color={color}/>}