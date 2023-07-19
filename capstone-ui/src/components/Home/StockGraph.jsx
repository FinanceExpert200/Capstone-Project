import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Text} from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockGraph ({priceList}) {
    console.log("when called first : " , priceList)
    // const [dataPrice, setDataPrice] = useState([])
    // console.log("This is the list: " ,dataPrice);
    return (
        <Box>
            <Text>
                This is the list: 
            </Text>
            <Text>
               test
            </Text>
            <ResponsiveContainer width="100%" aspect={2}>
      <LineChart
        width={100}
        height={300}
        data={[]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']}/>
        <Tooltip />
        <Legend />
        {priceList.map((companySets, index) => (
          <Line   key = {index}
                  name={'Company'}
                  type="monotone"  
                  data= {companySets}
                  dataKey="openPrice"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} />

          ))}
        
      </LineChart>
    </ResponsiveContainer>
        </Box>
    )

} 