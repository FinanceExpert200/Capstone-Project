import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Text} from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockGraph ({priceList}) {

  return (
  <ResponsiveContainer width="100%" aspect={2}>
    <LineChart
      data={priceList}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      
      <XAxis stroke={'white'} dataKey="date" />
      <YAxis stroke={'white'} domain={['auto', 'auto']}/>
      <Tooltip />
      <Legend />    
          <Line
                  type="monotone"  
                  dataKey="META"
                  stroke="blue" 
                  dot = "none"
                  activeDot={{ r: 4}} />
           <Line
                  type="monotone"  
                  dataKey="AMZN"
                  stroke="red" 
                  activeDot={{ r: 4 }} />
           <Line
                  type="monotone"  
                  dataKey="GOOGL"
                  stroke="green" 
                  activeDot={{ r: 4 }} />
           <Line
                  type="monotone"  
                  dataKey="CRM"
                  stroke="purple" 
                  activeDot={{ r: 4 }} />
      
      
      
    </LineChart>
  </ResponsiveContainer>
  )

} 